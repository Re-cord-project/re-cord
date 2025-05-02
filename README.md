![header](https://capsule-render.vercel.app/api?type=waving&&color=0:C9E6F0,100:78B3CE&height=300&section=header&text=Re:cord&fontColor=FFFFFF&fontSize=90)

---

## 🚀 시작하기

### 🛠️ 시작 가이드
```bash
npm install
npm run dev
```

---

## 🧾 서비스 개요

- **서비스명**: RE:cord  
- **설명**: 부트캠프 수강생의 회고 기반 학습을 지원하는 기록형 플랫폼

---

## 🔀 개발 워크플로우

- **브랜치 전략**: Git Flow  
  - `main`: 배포 가능한 상태의 코드 유지  
  - `dev`: 개발 환경 상태의 코드 유지  
  - `feat`, `fix`, `refactor`: 팀원 각자의 개발 코드

---

## ✨ 주요 기능

### 🔐 인증 및 사용자 관리
- 회원가입
- JWT 기반 로그인

### 🏠 서비스 홈
- 전체 회고 게시물 검색
- 최신, 인기, 부트캠프별 회고 게시물 조회

### 📝 회고 블로그
- 회고 게시물 작성
- 블로그 내 게시물 검색
- 카테고리 기능

### 💬 소통 기능
- 댓글 및 대댓글 작성
- 추천 기능

### 👤 마이페이지
- 게시물, 댓글, 추천 통계 확인
- 팔로우 및 차단 관리

---

## 🎥 유튜브 시연 영상

📺 [https://youtu.be/pr629YElCp4](https://youtu.be/pr629YElCp4)

---

## 🛠️ Tech Stack

| 분류 | 기술 스택 |
|------|-----------|
| **Frontend** | ![React](https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black) ![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white) |
| **Backend** | ![Spring Boot](https://img.shields.io/badge/springboot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white) ![Spring Security](https://img.shields.io/badge/Spring%20Security-6DB33F?style=for-the-badge&logo=springsecurity&logoColor=white) ![MySQL](https://img.shields.io/badge/mysql-4479A1?style=for-the-badge&logo=mysql&logoColor=white) |
| **DevOps / Infra** | ![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white) ![Amazon EC2](https://img.shields.io/badge/Amazon%20EC2-FF9900?style=for-the-badge&logo=amazonec2&logoColor=white) ![Amazon S3](https://img.shields.io/badge/Amazon%20S3-569A31?style=for-the-badge&logo=amazons3&logoColor=white) ![NGINX](https://img.shields.io/badge/NGINX-009639?style=for-the-badge&logo=nginx&logoColor=white) ![Terraform](https://img.shields.io/badge/Terraform-844FBA?style=for-the-badge&logo=terraform&logoColor=white) ![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white) |
| **Collaboration** | ![Git](https://img.shields.io/badge/git-F05032?style=for-the-badge&logo=git&logoColor=white) ![Discord](https://img.shields.io/badge/Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white) |
| **Documentation/Test** | ![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=white) |

---

## 🏗️ Project Structure
```
re-cord
├─ backend
│  ├─ src
│  │  ├─ main
│  │  │  ├─ java
│  │  │  │  └─ com.commitmate.record
│  │  │  │     ├─ domain      # 도메인별 폴더 구조 
│  │  │  │     ├─ global      # 공통 설정 및 보안, 예외
│  │  │  │     └─ scheduler   # 스케줄링 로직
│  │  │  └─ resources         # application.yml, static, templates 
│
├─ frontend
│  ├─ public                  # 이미지, 아이콘, 로고
│  ├─ src
│  │  ├─ app                  # 페이지별 라우팅 구조 및 API 핸들링
│  │  ├─ components           # 공통 UI 컴포넌트
│  │  ├─ config               # 환경 설정
│  │  └─ types                # 타입 정의
│
├─ infra
│  ├─ main.tf
│  └─ variables.tf
│
└─ README.md
```

---

## 📝 프로젝트 개요

### 📌 DB ERD

<img width="1414" alt="ERD" src="https://github.com/user-attachments/assets/206afb94-a902-4eae-86d3-b012c89ec8de" />

---

### 📑 API 명세서 (Swagger)

> Swagger를 통해 API 목록을 확인할 수 있습니다.

- 🔗 [Swagger API 문서 보러가기](http://localhost:8080/swagger-ui/index.html)  
  *(URL은 실제 배포 주소로 변경 필요)*

---

## 👥 팀원 소개

| 이름     | 역할 | GitHub |
|----------|------|--------|
| 김진경   | BE   | [codefish-sea](https://github.com/codefish-sea) |
| 한영흔   | BE   | [Heun0](https://github.com/Heun0) |
| 근하람   | BE   | [gkfka9901](https://github.com/gkfka9901) |
| 김현우   | BE   | [asdf-qwe](https://github.com/asdf-qwe) |
| 홍보람   | BE   | [researcherrabbit](https://github.com/researcherrabbit) |

> 각 팀원은 백엔드 개발을 담당하였으며,  
> 인증/인가, 데이터베이스 설계, API 구현 등의 역할을 분담하였습니다.
