'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'

export default function SignupPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const oauthId = searchParams?.get('oauthId') ?? ''

    // 상태 변수 변경: email, bootcamp, generation
    const [email, setEmail] = useState('')
    const [bootcamp, setBootcamp] = useState('')
    const [generation, setGeneration] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // 추가 정보 전송
        // const response = await fetch('/api/oauth2/complete-signup', {
        const response = await fetch('http://localhost:8090/api/oauth2/complete-signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // 이게 있어야 CORS + 쿠키 문제 없음

            body: JSON.stringify({ oauthId, email, bootcamp, generation }),
        })

        // 응답 상태 확인
        if (response.ok) {
            router.push('/') // 회원가입 완료 후 리디렉션
        } else {
            const error = await response.text() // 오류 메시지 텍스트 확인
            console.error('회원가입 오류:', error) // 콘솔에 오류 출력
            alert('회원가입 중 오류가 발생했습니다.') // 사용자에게 알림
        }
    }

    return (
        <div>
            <h1>추가 정보 입력</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    이메일:
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </label>
                <label>
                    부트캠프:
                    <input type="text" value={bootcamp} onChange={(e) => setBootcamp(e.target.value)} required />
                </label>
                <label>
                    기수:
                    <input type="text" value={generation} onChange={(e) => setGeneration(e.target.value)} required />
                </label>
                <button type="submit">완료</button>
            </form>
        </div>
    )
}
