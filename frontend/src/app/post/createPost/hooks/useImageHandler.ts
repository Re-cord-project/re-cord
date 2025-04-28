import { useState, useRef } from 'react'

/**
 * 에디터 이미지 처리를 위한 커스텀 훅
 *
 * @param onImageDrop 이미지 드롭시 호출할 콜백 함수
 * @returns 이미지 핸들링에 필요한 상태와 함수들
 */
export const useImageHandler = (onImageDrop?: (file: File, dataUrl: string) => void) => {
    // 임시 이미지 URL과 파일을 추적하기 위한 상태
    const [tempImages, setTempImages] = useState<Map<string, File>>(new Map())

    // 메모이제이션을 위한 맵 (파일 키 => dataUrl)
    const fileDropCache = useRef<Map<string, string> | null>(null)

    // 파일 드롭 이벤트 핸들러
    const handleFileDrop = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            if (!file.type.startsWith('image/')) {
                reject('이미지 파일이 아닙니다.')
                return
            }

            // 파일명과 크기로 중복 체크를 위한 키 생성
            const fileKey = `${file.name}-${file.size}`

            // 메모이제이션을 위한 맵 초기화 (처음 사용시)
            if (!fileDropCache.current) {
                fileDropCache.current = new Map()
            }

            // 이미 처리한 이미지인지 확인
            if (fileDropCache.current.has(fileKey)) {
                resolve(fileDropCache.current.get(fileKey)!)
                return
            }

            const reader = new FileReader()
            reader.onload = () => {
                const dataUrl = reader.result as string

                // 임시 이미지 URL과 파일 매핑 저장
                setTempImages((prevMap) => {
                    const newMap = new Map(prevMap)
                    newMap.set(dataUrl, file)
                    return newMap
                })

                // 캐시에 저장
                fileDropCache.current!.set(fileKey, dataUrl)

                // 콜백 호출
                if (onImageDrop) {
                    onImageDrop(file, dataUrl)
                }

                resolve(dataUrl)
            }
            reader.onerror = () => {
                reject('이미지 파일을 읽는 중 오류가 발생했습니다.')
            }
            reader.readAsDataURL(file)
        })
    }

    return {
        tempImages,
        setTempImages,
        fileDropCache,
        handleFileDrop,
    }
}
