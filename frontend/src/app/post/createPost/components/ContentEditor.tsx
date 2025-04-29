'use client'

import React, { ReactNode, useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { Editor } from '@tinymce/tinymce-react'
import type { Editor as TinyMCEEditor } from 'tinymce'
import type { IAllProps } from '@tinymce/tinymce-react'
import { useEditorConfig } from '@/app/post/createPost/hooks/useEditorConfig'
import { useImageHandler } from '@/app/post/createPost/hooks/useImageHandler'

// 컴포넌트 ref 타입 정의
export interface ContentEditorRef {
    processContentBeforeSubmit: (uploadFunction?: (file: File) => Promise<string>) => Promise<string>
}

interface ContentEditorProps {
    value: string
    onChange: (content: string) => void
    height?: number
    actions?: ReactNode
    plainTextMode?: boolean
    onImageDrop?: (file: File, dataUrl: string) => void
    uploadImageToS3?: (file: File) => Promise<string>
}

const ContentEditor = forwardRef<ContentEditorRef, ContentEditorProps>(
    ({ value, onChange, height = 500, actions, plainTextMode = false, onImageDrop, uploadImageToS3 }, ref) => {
        // 환경 변수에서 API 키 가져오기
        const apiKey = process.env.NEXT_PUBLIC_TINYMCE_API_KEY
        const editorRef = useRef<TinyMCEEditor | null>(null)
        const [editorContent, setEditorContent] = useState(value || '')

        // 이미지 핸들링 로직을 별도 훅으로 분리
        const { tempImages, setTempImages, fileDropCache, handleFileDrop } = useImageHandler(onImageDrop)

        // 컨텐츠가 외부에서 변경되었을 때 에디터 내용 업데이트
        useEffect(() => {
            if (value !== editorContent && editorRef.current) {
                // 명시적으로 에디터 내용 설정
                editorRef.current.setContent(value)
                setEditorContent(value)
            }
        }, [value, editorContent])

        // 게시하기 전 이미지 처리를 위한 함수
        const processContentBeforeSubmit = async (uploadFunction = uploadImageToS3): Promise<string> => {
            if (!uploadFunction || tempImages.size === 0 || !editorRef.current) {
                return editorContent
            }

            // 현재 에디터 내용 가져오기
            let currentContent = editorRef.current.getContent()
            const tempImageUrls = Array.from(tempImages.keys())

            try {
                // 모든 임시 이미지를 S3에 업로드하고 URL 치환
                for (const tempUrl of tempImageUrls) {
                    const file = tempImages.get(tempUrl)
                    if (file) {
                        // S3에 업로드하고 URL 받기
                        const s3Url = await uploadFunction(file)
                        // 본문에서 임시 URL을 S3 URL로 치환
                        currentContent = currentContent.replace(
                            new RegExp(tempUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
                            s3Url,
                        )
                    }
                }

                // 처리된 내용으로 에디터 업데이트 및 상태 업데이트
                if (editorRef.current) {
                    editorRef.current.setContent(currentContent)
                }
                setEditorContent(currentContent)
                onChange(currentContent)

                // 임시 이미지 맵 초기화
                setTempImages(new Map())

                return currentContent
            } catch (error) {
                console.error('이미지 업로드 중 오류:', error)
                throw new Error('이미지 업로드 중 오류가 발생했습니다.')
            }
        }

        // ref를 통해 외부에서 함수를 호출할 수 있도록 설정
        useImperativeHandle(ref, () => ({
            processContentBeforeSubmit,
        }))

        // 에디터 내용 변경 핸들러
        const handleEditorChange = (content: string) => {
            setEditorContent(content)
            onChange(content)
        }

        // 에디터 설정을 커스텀 훅으로 분리
        const editorOptions = useEditorConfig({
            height,
            plainTextMode,
            value,
            handleFileDrop,
        })

        return (
            <div className="editor-container">
                <Editor
                    apiKey={apiKey}
                    onInit={(evt, editor) => {
                        editorRef.current = editor
                    }}
                    value={editorContent}
                    onEditorChange={handleEditorChange}
                    init={editorOptions}
                />

                {/* 버튼 영역 */}
                {actions && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex justify-end items-center">{actions}</div>
                    </div>
                )}
            </div>
        )
    },
)

// 정적 메서드를 사용하는 대신 유틸리티 함수로 분리
export const processEditorContent = async (
    editorRef: React.RefObject<ContentEditorRef>,
    uploadFunction?: (file: File) => Promise<string>,
): Promise<string | null> => {
    if (editorRef.current) {
        try {
            return await editorRef.current.processContentBeforeSubmit(uploadFunction)
        } catch (error) {
            console.error('콘텐츠 처리 중 오류:', error)
            return null
        }
    }

    return null
}

// 컴포넌트 표시 이름 설정
ContentEditor.displayName = 'ContentEditor'

export default ContentEditor
