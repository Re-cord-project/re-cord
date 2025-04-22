## 백엔드로 보내는 JSON 데이터 항목

현재 프론트엔드에서 백엔드로 `/api/oauth2/complete-signup` 엔드포인트에 POST 요청을 보낼 때 전송하는 JSON 데이터 항목:

```javascript
{
  username: usernameInput,  // 사용자명
  nickname: nickname,       // 닉네임
  bootcamp: bootcamp,       // 부트캠프
  generation: generation    // 기수
}
```

이 데이터는 다음 코드에서 확인할 수 있습니다:

```javascript
const response = await fetch("/api/oauth2/complete-signup", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    username: usernameInput,
    nickname,
    bootcamp,
    generation,
  }),
});
```

백엔드의 `OAuth2SignupRequest` DTO 클래스와 필드 이름이 일치해야 합니다.
