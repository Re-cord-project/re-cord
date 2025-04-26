'use client'

import React, { ReactNode, useRef, useState, useEffect } from 'react'
import { Editor } from '@tinymce/tinymce-react'
import type { Editor as TinyMCEEditor } from 'tinymce'
import type { IAllProps } from '@tinymce/tinymce-react'

interface ContentEditorProps {
    value: string
    onChange: (content: string) => void
    height?: number
    actions?: ReactNode
    plainTextMode?: boolean
    onImageDrop?: (file: File, dataUrl: string) => void // 이미지 드롭 이벤트 핸들러 추가
}

const ContentEditor: React.FC<ContentEditorProps> = ({
    value,
    onChange,
    height = 500,
    actions,
    plainTextMode = false,
    onImageDrop,
}) => {
    // 환경 변수에서 API 키 가져오기
    const apiKey = process.env.NEXT_PUBLIC_TINYMCE_API_KEY
    const editorRef = useRef<TinyMCEEditor | null>(null)
    const [editorContent, setEditorContent] = useState(value || '')

    // 컨텐츠가 외부에서 변경되었을 때 에디터 내용 업데이트
    useEffect(() => {
        if (value !== editorContent && editorRef.current) {
            // 명시적으로 에디터 내용 설정
            editorRef.current.setContent(value)
            setEditorContent(value)
        }
    }, [value])

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
}

export default ContentEditor
