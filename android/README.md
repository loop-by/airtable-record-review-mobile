# Record Review Mobile — Android 소스 프로토타입

공개된 원본 Interface를 Android WebView로 열고, 포함한 `mobile-fix.js`로 목록과 상세를 전환합니다. Airtable 데이터는 Airtable 서버에서 직접 표시합니다. 로그인, Airtable PAT, 별도 데이터베이스 또는 JavaScript 브리지는 없습니다.

**현재 상태:** 소스만 제공됩니다. 이 환경에는 Android SDK/Gradle이 없어 APK를 빌드하지 않았으며, 실제 기기에서 실행을 검증하지 않았습니다. 설치 가능한 앱으로 간주하면 안 됩니다.

기본 Interface 주소는 포함하지 않습니다. 실행 시 Activity의 `Intent.data`로 사용할 공개 `/app…/shr…` 주소를 전달해야 합니다. 주소 없이 실행하면 링크를 전달하라는 안내만 표시합니다.

## 빌드

1. 공식 Android Studio에서 이 `android` 폴더를 프로젝트로 엽니다.
2. JDK 17, Gradle 8.9, Android SDK Platform 35를 선택합니다. 필요한 의존성은 Google/Maven Central에서 가져옵니다.
3. Gradle 동기화 후 `:app:assembleDebug`를 실행합니다. CLI에 Gradle 8.9가 준비되어 있다면 `gradle :app:assembleDebug`도 가능합니다. Gradle Wrapper는 포함하지 않았습니다.
4. 결과 `app/build/outputs/apk/debug/app-debug.apk`를 테스트 기기에 설치합니다.

AGP 8.7.3과 Gradle 8.9를 고정한 작은 Java 프로젝트입니다. 외부 Android UI 라이브러리는 사용하지 않습니다.

## 기기에서 확인할 항목

- 세로 화면에서 하단 목록/상세/해제 버튼과 긴 본문이 잘리지 않는지
- 목록 선택, 이전/다음 레코드 이동, 레코드의 섹션 탐색
- Drive, YouTube, 첨부파일 링크를 누를 때 원래 권한 범위 내에서 열리는지
- 공유 링크 폐기/로딩 실패/네트워크 단절 시 오류 처리
- 화면 회전, 시스템 뒤로가기, 글꼴 크기 확대, 접근성

원본 페이지에 포함된 외부 링크는 사용자가 누르면 외부 브라우저로 보냅니다. WebView가 Airtable 로그인 또는 다른 페이지로 이동하면 자동 진행하지 않습니다. 게시/권한/레코드 수정 기능은 구현하지 않았습니다.

Airtable DOM 변경으로 보정이 깨질 수 있습니다. 이 소스의 UA와 CSS 선택자는 공식 호환성 계약이 아닙니다.
