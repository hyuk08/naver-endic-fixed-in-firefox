# [수정 버전] Naver English Dictionary (Unofficial)

찾고싶은 영어 단어를 선택하면 네이버 사전 팝업을 띄워줍니다.

## 이 프로젝트에 대하여

[khris](https://github.com/khris)님이 만드신 [khris/naver-endic-unofficial](https://github.com/khris/naver-endic-unofficial)을 fork하여 수정한 버전입니다. 원작자는 **khris**이며, 원본과 마찬가지로 MPL-2.0 라이선스를 따릅니다.

### 원작자께

22년 7월에 마지막 업데이트가 있었던 걸로 확인했습니다. 제작해주셔서 감사하다는 말씀 드립니다. 혹시 문제가 있을 경우 contact@hyukyk.dev로 연락 주시면 감사드리겠습니다.

### 변경 사항

- 팝업 UI 개선: 내용에 맞춰 크기가 조절되고, 길면 스크롤로 내려볼 수 있습니다.
- 발음 듣기 버튼이 동작하지 않던 문제 수정
- 옵션 화면 개선: 다크 모드 지원, 기능키를 Ctrl / Alt / Meta 중 하나만 선택
- 팝업 크기 선택: 고정 크기(길면 스크롤) / 전체 크기(내용만큼 크게)
- 우클릭 메뉴 "네이버 사전에서 찾기" 추가: Firefox PDF 뷰어에서도 작은 창으로 사전을 볼 수 있습니다.
- 사전 데이터를 안전한 방식으로 표시하도록 수정 (`innerHTML` 미사용)
- 한글·공백이 들어간 검색어가 깨지던 문제와 기타 오류 수정

## 권한 안내

설치할 때 "모든 웹 사이트에 대한 사용자 데이터에 접근"이라는 권한이 표시됩니다. 걱정되실 수 있어 아래에 이유를 적어 둡니다.

| 권한 | 이유 |
|---|---|
| 모든 웹 사이트 접근 (필수) | 어떤 사이트에서든 단어를 클릭하거나 드래그했을 때 사전 팝업을 띄우려면 그 페이지에서 동작해야 합니다. 페이지 내용을 읽어 저장하거나 전송하지 않으며, 사용자가 선택한 단어(최대 40자)만 사용합니다. |
| `en.dict.naver.com` | 선택한 단어의 뜻과 발음을 네이버 영어사전에서 조회합니다. |
| `dict-dn.pstatic.net` | 네이버 사전의 발음 듣기 음성 파일을 재생합니다. |
| `contextMenus` | 단어를 선택하고 우클릭했을 때 "네이버 사전에서 찾기" 메뉴를 보여줍니다. PDF 뷰어처럼 팝업을 띄울 수 없는 곳에서 사용합니다. |
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

---

# English (translation of the above)

# [Modified Version] Naver English Dictionary (Unofficial)

Select an English word and a Naver Dictionary popup appears.

## About this project

This is a modified version, forked from [khris/naver-endic-unofficial](https://github.com/khris/naver-endic-unofficial) created by [khris](https://github.com/khris). The original author is **khris**, and it follows the same MPL-2.0 license as the original.

### To the original author

I saw that the last update was in July 2022. I would like to say thank you for creating this. If there is any problem, please contact me at contact@hyukyk.dev.

### Changes

- Improved popup UI: the size adjusts to the content, and long content can be scrolled.
- Fixed the pronunciation button that did not work
- Improved options screen: dark mode support, choose only one of Ctrl / Alt / Meta as the modifier key
- Popup size setting: fixed size (scrolls if long) / full size (as large as the content)
- Added a right-click menu item "Look up in Naver Dictionary": lets you use the dictionary in a small window even in the Firefox PDF viewer.
- Dictionary data is now displayed in a safe way (no `innerHTML`)
- Fixed search terms containing Korean characters or spaces being garbled, and other bugs

## Permissions

When you install it, the permission "Access your data for all websites" is displayed. Since this may be a concern, the reasons are described below.

| Permission | Reason |
|---|---|
| Access to all websites (required) | To show the dictionary popup when you click or drag a word on any site, it needs to run on that page. It does not read, store or send page content; it only uses the word you selected (up to 40 characters). |
| `en.dict.naver.com` | Looks up the meaning and pronunciation of the selected word in the Naver English Dictionary. |
| `dict-dn.pstatic.net` | Plays the pronunciation audio files of the Naver Dictionary. |
| `contextMenus` | Shows the "Look up in Naver Dictionary" item when you right-click a selected word. Used where the popup cannot be shown, such as the PDF viewer. |
| `storage` | Saves settings such as the word selection method and the modifier key inside the browser. |

- It does not collect page content, text you type, or browsing history.
- It does not send any information to the outside other than the selected word. There are no ads or analytics tools.
- All source code is public, so you can check it yourself.

## Privacy

The selected word is sent to `en.dict.naver.com` to look up its meaning and pronunciation. No other information is collected or sent out. Settings are stored only inside the browser.

This extension is not affiliated with NAVER and has not been approved by NAVER.

## Contact

For bug reports or inquiries, please send them to [GitHub Issues](https://github.com/hyuk08/naver-endic-fixed-in-firefox/issues) or contact@hyukyk.dev.

## License

Mozilla Public License 2.0. See `LICENSE.md` for details.

`icons/speech.png` is taken from [Google Material Design Icons][0].
