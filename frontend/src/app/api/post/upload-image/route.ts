import { NextRequest, NextResponse } from 'next/server'
import { S3Client, PutObjectCommand, PutBucketCorsCommand } from '@aws-sdk/client-s3'
import { v4 as uuidv4 } from 'uuid'

// S3 설정
const s3Client = new S3Client({
    region: process.env.AWS_S3_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
})

// CORS 설정을 위한 함수
async function configureBucketCors() {
    try {
        const corsParams = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            CORSConfiguration: {
                CORSRules: [
                    {
                        AllowedHeaders: ['*'],
                        AllowedMethods: ['GET', 'PUT', 'POST', 'DELETE', 'HEAD'],
                        AllowedOrigins: ['*'], // 프로덕션에서는 실제 도메인으로 제한하는 것이 좋습니다
                        ExposeHeaders: ['ETag'],
                        MaxAgeSeconds: 3000,
                    },
                ],
            },
        }

        const command = new PutBucketCorsCommand(corsParams)
        await s3Client.send(command)
        console.log('S3 버킷 CORS 설정 완료')
    } catch (error) {
        console.error('S3 버킷 CORS 설정 오류:', error)
        // CORS 설정 실패해도 이미지 업로드는 진행
    }
}

export async function POST(request: NextRequest) {
    try {
        // CORS 설정 시도 (필요시 주석 해제)
        // await configureBucketCors();

        // multipart/form-data 형식으로 전송된 데이터 처리
        const formData = await request.formData()
        const file = formData.get('image') as File

        if (!file) {
            return NextResponse.json({ error: '이미지 파일이 없습니다.' }, { status: 400 })
        }

        // 파일 이름 생성 (충돌 방지를 위한 UUID 사용)
        const fileExtension = file.name.split('.').pop() || 'jpg'
        const fileName = `${uuidv4()}.${fileExtension}`
        const filePath = `posts/images/${fileName}`

        // 파일 버퍼로 변환
        const buffer = Buffer.from(await file.arrayBuffer())

        console.log('이미지 업로드 시작:', fileName, file.type, file.size)

        // S3에 업로드 (ACL 옵션 제거)
        const command = new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: filePath,
            Body: buffer,
            ContentType: file.type,
            // ACL 옵션 제거 - 버킷 정책에 의존
            // CORS 관련 메타데이터 추가
            Metadata: {
                'x-amz-acl': 'public-read',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        })

        await s3Client.send(command)

        console.log('이미지 업로드 완료:', fileName)

        // S3 URL 생성
        const imageUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${filePath}`

        return NextResponse.json(
            {
                imageUrl,
                message: '이미지가 성공적으로 업로드되었습니다.',
                note: '만약 이미지 로드에 문제가 있다면, S3 버킷의 CORS 설정을 확인해주세요.',
            },
            { status: 200 },
        )
    } catch (error) {
        console.error('이미지 업로드 오류:', error)
        return NextResponse.json({ error: '이미지 업로드 중 오류가 발생했습니다.' }, { status: 500 })
    }
}

// 최대 파일 크기 설정 (예: 10MB)
export const config = {
    api: {
        bodyParser: false,
        sizeLimit: '10mb',
    },
}
