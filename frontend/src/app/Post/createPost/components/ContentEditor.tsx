'use client'

import React, { ReactNode, useRef } from 'react'
import { Editor } from '@tinymce/tinymce-react'

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
    const editorRef = useRef<any>(null)

    // 에디터 내용 변경 핸들러
    const handleEditorChange = (content: string) => {
        onChange(content)
    }

    // 에디터 설정
    const editorOptions = {
        height,
        menubar: false,
        toolbar: 'undo redo | formatselect | bold italic | bullist numlist',
        plugins: ['lists'],
        statusbar: false,
        content_style: 'body { font-family: Arial, sans-serif; font-size: 14px; }',
        entity_encoding: 'raw',
        forced_root_block: 'p',
        // 자동 포커스 방지
        auto_focus: false,
        // 커서 위치 유지 관련 설정
        keep_styles: true,
        convert_fonts_to_spans: false,
    }

    return (
        <div className="editor-container">
            <Editor
                apiKey={apiKey}
                onInit={(evt, editor) => {
                    editorRef.current = editor
                    // 초기 값 설정 (컴포넌트 마운트 시 1회)
                    if (value) {
                        editor.setContent(value)
                    }
                }}
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
