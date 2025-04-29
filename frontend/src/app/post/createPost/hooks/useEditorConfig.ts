import { useMemo } from 'react'
import type { IAllProps } from '@tinymce/tinymce-react'
import type { Editor as TinyMCEEditor } from 'tinymce'

interface EditorConfigProps {
    height: number
    plainTextMode: boolean
    value: string
    handleFileDrop: (file: File) => Promise<string>
}

/**
 * TinyMCE 에디터 설정을 관리하는 커스텀 훅
 */
export const useEditorConfig = ({
    height,
    plainTextMode,
    value,
    handleFileDrop,
}: EditorConfigProps): IAllProps['init'] => {
    return useMemo(
        () => ({
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
            img {
                display: block;
                margin: 10px 0;
                max-width: 100%;
                height: auto;
            }
        `,
            entity_encoding: 'raw',

            // 이미지 자동 업로드 비활성화 - 커스텀 로직만 사용
            automatic_uploads: false,

            // 이미지 처리 커스텀 핸들러
            images_upload_handler: (blobInfo, progress) => {
                // 이미지 파일 생성
                const file = new File([blobInfo.blob()], blobInfo.filename(), {
                    type: blobInfo.blob().type,
                })

                // 공통 handleFileDrop 함수 사용
                return handleFileDrop(file)
            },

            // 파일 붙여넣기 이벤트 비활성화 - 에디터의 기본 처리 방지
            paste_data_images: false,

            // 에디터 설정
            forced_root_block: 'p',
            remove_trailing_brs: false,
            convert_urls: false,
            browser_spellcheck: true,
            directionality: 'ltr',
            inline: false,
            formats: {
                bold: { inline: 'strong' },
                italic: { inline: 'em' },
            },

            // 에디터 이벤트 설정
            setup: function (editor: TinyMCEEditor) {
                editor.on('init', function () {
                    editor.setContent(value || '')
                })

                // 이미지 붙여넣기 이벤트 캡처
                editor.on('paste', function (e) {
                    const clipboardData = e.clipboardData
                    if (clipboardData && clipboardData.items) {
                        const items = clipboardData.items

                        for (let i = 0; i < items.length; i++) {
                            if (items[i].type.indexOf('image') !== -1) {
                                // 클립보드의 이미지 파일 가져오기
                                const file = items[i].getAsFile()
                                if (file) {
                                    // 기본 붙여넣기 동작 방지
                                    e.preventDefault()

                                    // 이미지 처리 및 삽입
                                    handleFileDrop(file)
                                        .then((url) => {
                                            editor.insertContent(`<img src="${url}" alt="${file.name}" />`)
                                        })
                                        .catch((error) => {
                                            console.error('이미지 붙여넣기 처리 오류:', error)
                                        })

                                    // 한 번에 하나의 이미지만 처리
                                    break
                                }
                            }
                        }
                    }
                })

                // 파일 드롭 이벤트 완전히 재정의
                editor.on('drop', function (e) {
                    const dataTransfer = e.dataTransfer
                    if (dataTransfer && dataTransfer.files.length > 0) {
                        // 이미지 파일만 처리
                        for (let i = 0; i < dataTransfer.files.length; i++) {
                            const file = dataTransfer.files[i]
                            if (file.type.startsWith('image/')) {
                                // 에디터 기본 드롭 처리 방지
                                e.preventDefault()

                                // 이미지 처리 및 삽입
                                handleFileDrop(file)
                                    .then((url) => {
                                        // 에디터 내용에 이미지 추가 (캐럿 위치에)
                                        editor.insertContent(`<img src="${url}" alt="${file.name}" />`)
                                    })
                                    .catch((error) => {
                                        console.error('이미지 드롭 처리 오류:', error)
                                    })

                                // 한 번에 하나만 처리
                                break
                            }
                        }
                    }
                })

                // 이미지 클릭 핸들러 (선택 사항)
                editor.on('click', function (e) {
                    const target = e.target as HTMLElement
                    if (target.nodeName === 'IMG') {
                        // 필요시 이미지 클릭 동작 처리 가능
                    }
                })
            },
        }),
        [height, plainTextMode, value, handleFileDrop],
    )
}
