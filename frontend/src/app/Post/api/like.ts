// 서버 URL 환경 변수 설정 - 기본값으로 백엔드 서버 URL 사용
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8090'
import { fetchWithAuth } from '@/utils/auth'

/**
 * 게시글 좋아요 토글 함수
 * @param postId 게시글 ID
 * @returns 성공 여부
 */
export async function togglePostLike(postId: number): Promise<boolean> {
    try {
        console.log(`좋아요 토글 API 호출: ${postId}`)

        // 인증된 요청 수행
        const response = await fetchWithAuth(`${API_BASE_URL}/api/posts/${postId}/like`, {
            method: 'POST',
        })

        console.log(`좋아요 토글 API 응답 상태:`, response.status)

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            console.error('좋아요 처리 오류:', errorData)
            throw new Error(errorData.message || '좋아요 처리 중 오류가 발생했습니다')
        }

        return true
    } catch (error) {
        console.error('좋아요 처리 중 오류:', error)
        return false
    }
}

/**
 * 게시글 좋아요 상태 확인 함수
 * @param postId 게시글 ID
 * @returns 좋아요 상태 (true: 좋아요 누름, false: 좋아요 안 누름)
 */
export async function checkPostLikeStatus(postId: number): Promise<boolean> {
    try {
        console.log(`좋아요 상태 확인 API 호출: ${postId}`)

        // 인증된 요청 수행
        const response = await fetchWithAuth(`${API_BASE_URL}/api/posts/${postId}/like/status`, {
            method: 'GET',
        })

        console.log(`좋아요 상태 확인 API 응답 상태:`, response.status)

        if (!response.ok) {
            // 비로그인 상태나 기타 오류는 좋아요 안 누름 상태로 처리
            if (response.status === 401) {
                console.log('미인증 상태, 좋아요 상태를 false로 설정')
                return false
            }

            const errorData = await response.json().catch(() => ({}))
            console.error('좋아요 상태 확인 오류:', errorData)
            return false
        }

        // 백엔드가 Boolean을 직접 반환하는 경우
        const result = await response.json()
        console.log('좋아요 상태 응답 데이터:', result)

        // Boolean 값을 직접 반환하는 컨트롤러에 맞게 처리
        return !!result
    } catch (error) {
        console.error('좋아요 상태 확인 중 오류:', error)
        return false
    }
}
