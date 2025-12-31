# 🚀 배포 가이드

## Vercel로 배포하기 (추천)

### 1️⃣ Vercel 준비
1. https://vercel.com 접속
2. GitHub 계정으로 로그인

### 2️⃣ 프로젝트 Import
1. Vercel 대시보드에서 **"Add New Project"** 클릭
2. GitHub 저장소 선택: `so-oyeonii/ai-advisor-experiment`
3. **"Import"** 클릭

### 3️⃣ 환경 변수 설정 ⚠️ 중요!

**Environment Variables** 섹션에서 다음 변수들을 추가:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDI26pyq90LhlVD9n8sICMT2BryAgV4EMM
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=ai-advisor-experiment.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=ai-advisor-experiment
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=ai-advisor-experiment.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=685896095806
NEXT_PUBLIC_FIREBASE_APP_ID=1:685896095806:web:0bf50c9c75ed5cd2a3b8fd
NEXT_PUBLIC_ADMIN_PASSWORD=admin123
```

💡 **팁**: 모든 변수를 `Production`, `Preview`, `Development` 모두에 체크하세요!

### 4️⃣ 배포
1. **"Deploy"** 버튼 클릭
2. 1-2분 대기
3. 배포 완료! 🎉

---

## 📍 배포 후 URL

### 실험 참가자용
```
https://your-app.vercel.app/
```
- 랜딩 페이지
- 동의서
- 자극물 (제품 페이지)
- 회상 과제
- 설문
- 인구통계
- 완료 페이지

### 어드민 페이지
```
https://your-app.vercel.app/admin/export
```
- 비밀번호: `admin123`
- 실시간 데이터 모니터링
- CSV 다운로드

---

## 🔧 배포 후 설정

### Firebase Security Rules
Firebase Console에서 Firestore Security Rules 업데이트:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 모든 읽기/쓰기 허용 (개발/실험용)
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

⚠️ **주의**: 실험 종료 후에는 보안 규칙을 강화하세요!

### 커스텀 도메인 (선택사항)
1. Vercel 프로젝트 설정 → **Domains**
2. 원하는 도메인 추가
3. DNS 설정 따라하기

---

## ✅ 배포 확인 체크리스트

- [ ] 랜딩 페이지 열림
- [ ] 동의서 작성 가능
- [ ] 제품 이미지 표시됨
- [ ] 설문 제출 가능
- [ ] Firebase에 데이터 저장 확인
- [ ] 어드민 페이지 로그인 가능
- [ ] 어드민에서 데이터 확인 가능
- [ ] CSV 다운로드 작동

---

## 🔄 재배포 (코드 수정 후)

### 자동 배포
- GitHub에 push하면 자동으로 재배포됩니다!
```bash
git add .
git commit -m "Update experiment"
git push
```

### 수동 배포
1. Vercel 대시보드 → 프로젝트 선택
2. **"Redeploy"** 클릭

---

## 💡 팁

### 환경 변수 변경 시
1. Vercel 프로젝트 → **Settings** → **Environment Variables**
2. 변수 수정
3. **Redeploy** 필수!

### 어드민 비밀번호 변경
```env
NEXT_PUBLIC_ADMIN_PASSWORD=new_password_here
```
변경 후 재배포 필요!

### 데이터 삭제
```bash
node scripts/clearFirebaseData.mjs
```

---

## 🆘 문제 해결

### 환경 변수 오류
- Vercel에서 모든 `NEXT_PUBLIC_*` 변수가 설정되었는지 확인
- 재배포 실행

### Firebase 연결 오류
- Firebase Console에서 Security Rules 확인
- API 키가 올바른지 확인

### 이미지 안 보임
- `public/images/` 폴더에 png 파일 존재 확인
- 대소문자 정확히 일치하는지 확인

---

## 📞 지원

문제가 있으면:
1. Vercel 빌드 로그 확인
2. 브라우저 콘솔 (F12) 에러 확인
3. Firebase Console에서 데이터 확인

**배포 성공을 기원합니다!** 🚀
