'use client'

import React, { useState, useEffect, useCallback, ReactNode } from 'react'
import { Editor } from '@tinymce/tinymce-react'

interface ContentEditorProps {
    value: string
    onChange: (content: string) => void
    height?: number
    actions?: ReactNode // 버튼 영역을 위한 props 추가
}

const ContentEditor: React.FC<ContentEditorProps> = ({ value, onChange, height = 500, actions }) => {
    // 환경 변수에서 API 키 가져오기
    const apiKey = process.env.NEXT_PUBLIC_TINYMCE_API_KEY
    const [tags, setTags] = useState<string[]>([])
    const [editorInstance, setEditorInstance] = useState<any>(null)

    // 내용에서 #태그를 추출하는 함수
    const extractTags = useCallback((content: string) => {
        const tagRegex = /#([가-힣a-zA-Z0-9_]+(?:\.[가-힣a-zA-Z0-9_]+)*)/g
        const matches = content.match(tagRegex)
        if (matches) {
            return matches.map((tag) => tag.substring(1)) // # 제거
        }
        return []
    }, [])

    // 에디터 내용이 변경될 때마다 태그 추출
    const handleEditorChange = useCallback(
        (content: string) => {
            onChange(content)
            const newTags = extractTags(content)
            setTags(newTags)
        },
        [onChange, extractTags],
    )

    // 태그 클릭 시 태그 제거
    const removeTag = (tagToRemove: string) => {
        if (editorInstance) {
            const content = editorInstance.getContent()
            // #태그를 찾아서 제거 (한글 지원)
            const updatedContent = content.replace(
                new RegExp(`#${tagToRemove}(?=[^가-힣a-zA-Z0-9_]|$)`, 'g'),
                tagToRemove,
            )
            editorInstance.setContent(updatedContent)
            onChange(updatedContent)
            setTags(tags.filter((tag) => tag !== tagToRemove))
        }
    }

    // 에디터 초기화 후 인스턴스 저장
    const handleEditorInit = (evt: any, editor: any) => {
        setEditorInstance(editor)

        // 에디터에서 스페이스바 누를 때 태그 처리
        editor.on('keydown', (e: any) => {
            if (e.keyCode === 32) {
                // 스페이스바
                const content = editor.getContent()
                const newTags = extractTags(content)
                if (newTags.length !== tags.length) {
                    setTags(newTags)
                }
            }
        })
    }

    return (
        <div className="editor-container">
            <Editor
                apiKey={apiKey}
                value={value}
                onEditorChange={handleEditorChange}
                onInit={handleEditorInit}
                init={{
                    height,
                    menubar: true,
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
                    toolbar:
                        'undo redo | blocks | ' +
                        'bold italic forecolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | help',
                    content_style:
                        'body { font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif; font-size: 14px }',
                }}
            />

            <div className="mt-4">
                {tags.length > 0 ? (
                    <div className="flex flex-wrap gap-2 items-center">
                        <span className="text-sm font-medium text-gray-600">태그: </span>
                        {tags.map((tag, index) => (
                            <div
                                key={index}
                                className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center"
                            >
                                {tag}
                                <button
                                    className="ml-1 text-blue-700 hover:text-blue-900"
                                    onClick={() => removeTag(tag)}
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500 italic">
                        글 작성 중에 단어 앞에 #이 붙어있으면 태그로 나타낼 수 있습니다 (예: #next.js)
                    </p>
                )}
            </div>

            {/* 버튼 영역 추가 */}
            {actions && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-end items-center">{actions}</div>
                </div>
            )}
        </div>
    )
}

export default ContentEditor
