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
}

const ContentEditor: React.FC<ContentEditorProps> = ({
    value,
    onChange,
    height = 500,
    actions,
    plainTextMode = false,
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

    // 더 단순한 에디터 설정으로 수정
    const editorOptions: IAllProps['init'] = {
        height,
        menubar: false,
        toolbar: plainTextMode ? 'undo redo' : 'undo redo | formatselect | bold italic | bullist numlist',
        plugins: ['lists'],
        statusbar: false,
        content_style: `
            body { 
                font-family: Arial, sans-serif; 
                font-size: 14px; 
                line-height: 1.5;
                padding: 0px 10px 10px 10px; /* 상단 패딩 제거 */
            }
            p {
                margin-top: 0;
                margin-bottom: 10px;
            }
        `,
        entity_encoding: 'raw',

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
