'use client'

import React, { ReactNode, useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { Editor } from '@tinymce/tinymce-react'
import type { Editor as TinyMCEEditor } from 'tinymce'
import type { IAllProps } from '@tinymce/tinymce-react'

// 컴포넌트 ref 타입 정의
export interface ContentEditorRef {
    processContentBeforeSubmit: () => Promise<string>
}

interface ContentEditorProps {
    value: string
    onChange: (content: string) => void
    height?: number
    actions?: ReactNode
    plainTextMode?: boolean
    onImageDrop?: (file: File, dataUrl: string) => void
    // 이미지 업로드 처리 함수 추가
    uploadImageToS3?: (file: File) => Promise<string>
}

const ContentEditor = forwardRef<ContentEditorRef, ContentEditorProps>(
    ({ value, onChange, height = 500, actions, plainTextMode = false, onImageDrop, uploadImageToS3 }, ref) => {
        // 환경 변수에서 API 키 가져오기
        const apiKey = process.env.NEXT_PUBLIC_TINYMCE_API_KEY
        const editorRef = useRef<TinyMCEEditor | null>(null)
        const [editorContent, setEditorContent] = useState(value || '')
        // 임시 이미지 URL과 파일을 추적하기 위한 상태 추가
        const [tempImages, setTempImages] = useState<Map<string, File>>(new Map())

        // 컨텐츠가 외부에서 변경되었을 때 에디터 내용 업데이트
        useEffect(() => {
            if (value !== editorContent && editorRef.current) {
                // 명시적으로 에디터 내용 설정
                editorRef.current.setContent(value)
                setEditorContent(value)
            }
        }, [value, editorContent])

        // 게시하기 전 이미지 처리를 위한 함수
        const processContentBeforeSubmit = async (): Promise<string> => {
            if (!uploadImageToS3 || tempImages.size === 0 || !editorRef.current) {
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
                        const s3Url = await uploadImageToS3(file)
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

        // 기존 코드는 여기서 이어집니다...
        // ...existing code...

        // 에디터 내용 변경 핸들러
        const handleEditorChange = (content: string) => {
            setEditorContent(content)
            onChange(content)
        }

        // 파일 드롭 이벤트 핸들러
        const handleFileDrop = (file: File) => {
            if (onImageDrop && file.type.startsWith('image/')) {
                const reader = new FileReader()
                reader.onload = () => {
                    const dataUrl = reader.result as string
                    // 임시 이미지 URL과 파일 매핑 저장
                    setTempImages((prevMap) => {
                        const newMap = new Map(prevMap)
                        newMap.set(dataUrl, file)
                        return newMap
                    })
                    // 이미지 드롭 이벤트 핸들러 호출
                    onImageDrop(file, dataUrl)
                }
                reader.readAsDataURL(file)
            }
        }

        // 기본 에디터 설정
        const editorOptions: IAllProps['init'] = {
            height,
            menubar: true,
            toolbar: plainTextMode
                ? 'undo redo'
                : 'undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | link image media | forecolor backcolor emoticons',
            plugins: [
                'advlist',
                'autolink',
                'lists',
                'link',
                'image',
                'charmap',
                'preview',
                'anchor',
                'searchreplace',
                'visualblocks',
                'code',
                'fullscreen',
                'insertdatetime',
                'media',
                'table',
                'code',
                'help',
                'wordcount',
            ],
            statusbar: true,
            content_style: `
            body { 
                font-family: Arial, sans-serif; 
                font-size: 14px; 
                line-height: 1.5;
                padding: 10px; 
            }
            p {
                margin-top: 0;
                margin-bottom: 10px;
            }
        `,
            entity_encoding: 'raw',

            // 이미지 처리 옵션
            images_upload_handler: (blobInfo, progress) => {
                return new Promise((resolve, reject) => {
                    // 이미지 파일 생성
                    const file = new File([blobInfo.blob()], blobInfo.filename(), {
                        type: blobInfo.blob().type,
                    })

                    // 이미지 드롭 이벤트 핸들러 호출
                    if (onImageDrop) {
                        const reader = new FileReader()
                        reader.onload = () => {
                            const dataUrl = reader.result as string
                            onImageDrop(file, dataUrl)
                            resolve(dataUrl) // 에디터에 이미지 표시
                        }
                        reader.onerror = () => {
                            reject('이미지 파일을 읽는 중 오류가 발생했습니다.')
                        }
                        reader.readAsDataURL(file)
                    } else {
                        // 이미지 핸들러가 없는 경우, 기본적으로 Base64로 처리
                        const reader = new FileReader()
                        reader.onload = () => {
                            resolve(reader.result as string)
                        }
                        reader.onerror = () => {
                            reject('이미지 파일을 읽는 중 오류가 발생했습니다.')
                        }
                        reader.readAsDataURL(file)
                    }
                })
            },

            // 커서 이동을 위한 중요 설정들
            forced_root_block: 'p',
            remove_trailing_brs: false,
            convert_urls: false,
            browser_spellcheck: true,

            // 텍스트 방향 설정 제거 (기본값 사용)
            directionality: 'ltr',

            // 인라인 모드 설정 제거 (iframe 모드 사용)
            inline: false,

            // 기본 텍스트 서식 간소화
            formats: {
                bold: { inline: 'strong' },
                italic: { inline: 'em' },
            },

            // 에디터 초기화 후 설정
            setup: function (editor: TinyMCEEditor) {
                editor.on('init', function () {
                    editor.setContent(value || '')
                })

                // 파일 드롭 이벤트 감지
                editor.on('drop', function (e) {
                    const dataTransfer = e.dataTransfer
                    if (dataTransfer && dataTransfer.files.length > 0) {
                        const file = dataTransfer.files[0]
                        handleFileDrop(file)
                    }
                })
            },
        }

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
            return await editorRef.current.processContentBeforeSubmit()
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
