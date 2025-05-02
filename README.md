## 🛠️ Tech Stack

| 분류 | 기술 스택 |
|------|-----------|
| **Frontend** | <img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black"> <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white"> <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white"> |
| **Backend** | <img src="https://img.shields.io/badge/springboot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white"> <img src="https://img.shields.io/badge/Spring Security-6DB33F?style=for-the-badge&logo=springsecurity&logoColor=white"> <img src="https://img.shields.io/badge/mysql-4479A1?style=for-the-badge&logo=mysql&logoColor=white"> |
| **DevOps / Infrastructure** | <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white"> <img src="https://img.shields.io/badge/Amazon EC2-FF9900?style=for-the-badge&logo=amazonec2&logoColor=white"> <img src="https://img.shields.io/badge/Amazon S3-569A31?style=for-the-badge&logo=amazons3&logoColor=white"> <img src="https://img.shields.io/badge/NGINX-009639?style=for-the-badge&logo=nginx&logoColor=white"> <img src="https://img.shields.io/badge/Terraform-844FBA?style=for-the-badge&logo=terraform&logoColor=white"> <img src="https://img.shields.io/badge/GitHub Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white"> |
| **Collaboration** | <img src="https://img.shields.io/badge/git-F05032?style=for-the-badge&logo=git&logoColor=white"> <img src="https://img.shields.io/badge/Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white"> |
| **Documentation/Test** | <img src="https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=white"> |





프로젝트 구조 : 
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
