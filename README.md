## 👉 [Lolog](https://lolog.site/) 체험해보기

<br>

# _Lolog?_

벨로그를 사용해보면서 불편했던 점을 개선해보기 위해 만든 프로젝트입니다.
<br>
게시글을 삭제하였을 때 발생한 엔드 포인트 관련 문제와 UX적인 문제, 최근 읽은 게시글에 대한 삭제 기능과 팔로우 기능을 추가로 개발하였습니다. 팔로우 기능을 통해 기존의 구독 기능을 개선하고, 자주 방문하는 유저의 글을 더욱 쉽게 찾을 수 있도록 했습니다.

<br>

# _데이터베이스 모델링_

![롤로그DB](https://user-images.githubusercontent.com/110225060/218933335-d4828bcf-01cd-4cac-bfb2-e0c10b5103f7.png)

<br>

# _실행 방법_

### 1. git clone

```
git clone https://github.com/hhhj1008/velog-clone-project.git
```

### 2. 패키지 설치

```
npm install -g @nestjs/cli@8.2.8
npm i
```

### 3. .env 파일 설정

```
DATABASE_CONNECTION = 사용할 데이터베이스 종류
DATABASE_HOST = host
DATABASE_PORT = port
DATABASE_USERNAME = username
DATABASE_PASSWORD = password
DATABASE_DATABASE = dbname
SERVER_PORT = serverpost
SECRET_KEY = jwt시크릿키
GITHUB_CLIENT_ID = github 소셜 로그인 클라이언트 ID
GITHUB_CLIENT_SECRET = github 소셜 로그인 클라이언트 시크릿키

GOOGLE_CLIENT_ID = 구글 소셜 로그인 클라이언트 ID
GOOGLE_CLIENT_SECRET = 구글 소셜 로그인 클라이언트 시크릿키

GOOGLE_REDIRECT_URI = 구글 redirect uri
GOOGLE_GRANT_TYPE = 구글 소셜 로그인 권한 타입

FACEBOOK_CLIENT_ID = 페이스북 소셜 로그인 클라이언트 ID
FACEBOOK_CLIENT_SECRET = 페이스북 소셜 로그인 클라이언트 시크릿키

GMAIL_LOGIN_ID = 인증코드 전송을 위한 gamil ID
GMAIL_PASSWORD = gmail password

CALL_BACK_URL = 소셜 로그인 call back url
URL = cors 허용을 위한 클라이언트 url

IMAGE_URL = 게시글 썸네일, 프로필 이미지를 위한 백엔드 url
```

### 4. 서버 실행

```
npm run start
npm run start:dev         // 개발 모드로 실행
```

<br>

**기능의 동작은 [API 명세서](https://lolog-api-docs.gitbook.io/lolog-api-docs/) 참조**
