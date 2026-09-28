# [수정 버전] Naver English Dictionary (Unofficial)

찾고싶은 영어 단어를 선택하면 네이버 사전 팝업을 띄워줍니다.

## 이 프로젝트에 대하여

[khris](https://github.com/khris)가 만든 [khris/naver-endic-unofficial](https://github.com/khris/naver-endic-unofficial)을 fork하여 수정한 버전입니다. 원작자는 **khris**이며, 원본과 마찬가지로 MPL-2.0 라이선스를 따릅니다.

### 원작자께

22년 7월에 마지막 업데이트가 있었던 걸로 확인했습니다. 제작해주셔서 감사하다는 말씀 드립니다. 혹시 문제가 있을 경우 contact@hyukyk.dev로 연락 주시면 감사드리겠습니다.

### 변경 사항

- 팝업 UI 개선: 내용에 맞춰 크기가 조절되고, 길면 스크롤로 내려볼 수 있습니다.
- 발음 듣기 버튼이 동작하지 않던 문제 수정
- 옵션 화면 개선: 다크 모드 지원, 기능키를 Ctrl / Alt / Meta 중 하나만 선택
- 팝업 크기 선택: 고정 크기(길면 스크롤) / 전체 크기(내용만큼 크게)
- 사전 데이터를 안전한 방식으로 표시하도록 수정 (`innerHTML` 미사용)
- 한글·공백이 들어간 검색어가 깨지던 문제와 기타 오류 수정

## 권한 안내

설치할 때 "모든 웹 사이트에 대한 사용자 데이터에 접근"이라는 권한이 표시됩니다. 걱정되실 수 있어 아래에 이유를 적어 둡니다.

| 권한 | 이유 |
|---|---|
| 모든 웹 사이트 접근 (필수) | 어떤 사이트에서든 단어를 클릭하거나 드래그했을 때 사전 팝업을 띄우려면 그 페이지에서 동작해야 합니다. 페이지 내용을 읽어 저장하거나 전송하지 않으며, 사용자가 선택한 단어(최대 40자)만 사용합니다. |
| `en.dict.naver.com` | 선택한 단어의 뜻과 발음을 네이버 영어사전에서 조회합니다. |
| `dict-dn.pstatic.net` | 네이버 사전의 발음 듣기 음성 파일을 재생합니다. |
| `storage` | 단어 선택 방법, 기능키 같은 설정을 브라우저 안에 저장합니다. |

- 페이지 내용, 입력한 글, 방문 기록은 수집하지 않습니다.
- 선택한 단어 외에는 어떤 정보도 외부로 전송하지 않습니다. 광고나 분석 도구도 없습니다.
- 소스 코드는 모두 공개되어 있어 직접 확인할 수 있습니다.

## 개인정보

선택한 단어는 뜻과 발음을 조회하기 위해 `en.dict.naver.com`으로 전송됩니다. 그 외의 정보는 수집하거나 외부로 보내지 않습니다. 설정값은 브라우저 안에만 저장됩니다.

이 확장 기능은 NAVER와 관련이 없으며, NAVER의 승인을 받지 않았습니다.

## 문의

버그 제보나 문의는 [GitHub Issues](https://github.com/hyuk08/naver-endic-fixed-in-firefox/issues) 또는 contact@hyukyk.dev 로 보내주세요.

## 라이선스

Mozilla Public License 2.0. 자세한 내용은 `LICENSE.md`를 참고하세요.

`icons/speech.png`는 [Google Material Design Icons][0]에서 가져왔습니다.

[0]: https://github.com/google/material-design-icons/
