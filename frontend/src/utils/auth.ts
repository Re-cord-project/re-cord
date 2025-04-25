/**
 * 인증 관련 유틸리티 함수
 */

/**
 * 액세스 토큰을 가져오는 함수
 * @returns {string | null} 액세스 토큰 또는 null
 */
export const getAccessToken = (): string | null => {
    if (typeof window !== 'undefined') {
        const token = sessionStorage.getItem('accessToken')
        return token
    }
    return null
}

/**
 * 인증 헤더를 포함한 객체를 반환하는 함수
 * @returns {Record<string, string>} 인증 헤더가 포함된 객체
 */
export const getAuthHeaders = (): Record<string, string> => {
    const token = getAccessToken()
    // Content-Type 헤더를 따로 설정하지 않고 필요한 경우에만 호출자가 추가하도록 변경
    // 일부 요청(예: FormData)에서는 Content-Type을 설정하면 안 됨
    if (token) {
        return {
            Authorization: `Bearer ${token}`,
        }
    }
    return {}
}

/**
 * API 요청을 위한 기본 fetch 함수
 * @param {string} url - API 엔드포인트 URL
 * @param {RequestInit} options - fetch 옵션
 * @returns {Promise<Response>} fetch 응답
 */
export const fetchWithAuth = async (url: string, options: RequestInit = {}): Promise<Response> => {
    // 기본 헤더 설정 (Content-Type은 options에 있으면 그것을 우선 사용)
    const defaultHeaders: HeadersInit = {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
    }

    const requestOptions: RequestInit = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...(options.headers || {}),
        },
        credentials: 'include', // 쿠키 기반 인증을 위해 추가
    }

    try {
        const response = await fetch(url, requestOptions)

        // 응답이 401 Unauthorized인 경우 토큰이 만료되었을 수 있음
        if (response.status === 401) {
            console.error('인증 오류(401):', url)
            // 여기서 토큰 갱신 로직을 추가할 수 있음
        }

        return response
    } catch (error) {
        console.error('API 요청 오류:', url, error)
        throw error
    }
}

/**
 * 토큰 유효성을 확인하는 함수
 * @returns {Promise<boolean>} 토큰 유효 여부
 */
export const validateToken = async (): Promise<boolean> => {
    try {
        const response = await fetchWithAuth('http://localhost:8090/api/auth/validate')
        return response.ok
    } catch (error) {
        console.error('토큰 유효성 검사 오류:', error)
        return false
    }
}

/**
 * 액세스 토큰을 설정하는 함수
 * @param {string} token - 저장할 액세스 토큰
 */
export const setAccessToken = (token: string): void => {
    if (typeof window !== 'undefined') {
        sessionStorage.setItem('accessToken', token)
    }
}

/**
 * 액세스 토큰을 제거하는 함수
 */
export const removeAccessToken = (): void => {
    if (typeof window !== 'undefined') {
        sessionStorage.removeItem('accessToken')
    }
}
