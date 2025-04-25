# 팔로우 관련 컴포넌트

## FollowButton 컴포넌트 사용법

`FollowButton` 컴포넌트는 사용자를 팔로우하거나 언팔로우할 수 있는 토글 버튼입니다.

### Props

- `userId` (string): 팔로우/언팔로우할 사용자의 ID
- `initialHasFollowed` (boolean): 초기 팔로우 상태 (true: 팔로우 중, false: 팔로우 안 함)
- `onFollowStatusChange` (function, optional): 팔로우 상태가 변경될 때 호출되는 콜백 함수

### 사용 예제

```tsx
// 기본 사용법
<FollowButton 
  userId="123" 
  initialHasFollowed={false} 
/>

// 상태 변경 콜백 사용
<FollowButton 
  userId="123" 
  initialHasFollowed={true}
  onFollowStatusChange={(hasFollowed) => {
    console.log(`사용자 123의 팔로우 상태: ${hasFollowed}`);
    // 추가 로직...
  }}
/>

// 프로필 페이지에서 사용
function ProfilePage({ userId, hasFollowed }) {
  return (
    <div className="profile-header">
      <h1>사용자 프로필</h1>
      <div className="profile-actions">
        <FollowButton 
          userId={userId} 
          initialHasFollowed={hasFollowed}
          onFollowStatusChange={(newStatus) => {
            // UI 업데이트 로직
          }}
        />
      </div>
    </div>
  );
}
``` 