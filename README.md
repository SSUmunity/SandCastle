# SandCastle
손으로 모래를 모아 모래성을 쌓듯 한손 한손 데이터를 긁어모아서 만든 숭실대학교 데이터 크롤러.  
NodeJS 라이브러리로 API호출로 데이터 오브젝트를 반환한다.

# 목차
- [설치 방법](#설치-방법)
- [제공 기능](#제공-기능)
  - [공지사항](#공지사항)
    - [중앙 공지사항](#중앙-공지사항)
      - [사용법](#사용법)
- [License](#License)

# 설치 방법
NodeJS의 패키지매니저로부터 `sandcastle-ssu` 내려받기
## npm을 사용할 때
```bash
$ npm install sandcastle-ssu
```
## yarn을 사용할 때
```bash
$ yarn add sandcastle-ssu
```

# 제공 기능
숭실대학교 학생들이 사용할 수 있는 서비스을 크롤링하는 기능을 제공한다.
## 공지사항
숭실대학교의 공지사항을 크롤링해오는 기능을 수행한다. 
### 중앙 공지사항
숭실대학교 홈페이지에서 확인되는 공지사항을 크롤링해올 수 있다. 
#### 사용법
```js
// 라이브러리 추가해서 sandCastle 변수에 할당.
const sandCastle = require('sandcastle-ssu');

// 크롤링을 수행할 옵션을 설정.
const option = {
  kind: sandCastle.Notice.Kind.MAIN,
  startPage: 1,
  endPage: 2,
  count: '',
  increaseMode: sandCastle.Notice.Main.IncreaseMode.PAGE,
  category: [sandCastle.Notice.Main.Category.notice],
};

// 공지사항 크롤링 수행.
const noticeList = sandCastle.notice(option);
// 반환된 Promise의 결과를 출력하기.
noticeList
  .then(console.log)
  .catch(console.log);
```

##### sandCastle.notice(option)
실질적으로 공지사항 크롤링을 수행하는 함수. 정해진 option인자를 넣으면 거기에 맞는 형태로 크롤링을 수행한다.  
비동기방식으로 수행되며 Promise를 반환한다.

##### option
- kind : 공지사항의 종류를 선택하는 속성. ex) 중앙 공지사항, 도서관 공지사항, 각 학부(과) 공지사항
  - sandCastle.Notice.Kind.MAIN : 중앙 공지사항
- category : 공지사항의 카테고리 선택하는 속성. 배열 객체로 되어있어서 원하는 카테고리를 추가할 수 있다.
  - Main
    - sandCastle.Notice.Main.Category.all : 전체 카테고리
    - sandCastle.Notice.Main.Category.notice : 학사 카테고리
    - sandCastle.Notice.Main.Category.scholarship : 학사 카테고리
    - sandCastle.Notice.Main.Category.international : 국제교류 카테고리
    - sandCastle.Notice.Main.Category.foreign : 외국인유학생 카테고리
    - sandCastle.Notice.Main.Category.recruit : 모집·채용 카테고리
    - sandCastle.Notice.Main.Category.events : 교내행사 카테고리
    - sandCastle.Notice.Main.Category.external : 교외행사 카테고리
    - sandCastle.Notice.Main.Category.volunteer : 봉사 카테고리
- increaseMode : 공지사항의 페이지를 가지고 오는 방식을 선택하는 속성. 
  - sandCastle.Notice.Main.IncreaseMode.PAGE : 페이지 단위로 startPage부터 시작해서 endPage - 1 페이지까지 크롤링해온다.
  - sandCastle.Notice.Main.IncreaseMode.COUNT : 페이지 단위로 startPage부터 시작해서 count개 페이지를 크롤링해온다.
- startPage : 공지사항 크롤링의 첫번째 페이지를 선택한다.
- endPage : 공지사항 크롤링의 마지막 페이지를 선택한다.
- count : 크롤링할 페이지의 수를 지정한다.
#### 반환값
```js
[{
  notice: {
    title: 'ssumunity가 크롤러를 오픈했습니다!',
    date: '2017-11-11',
    url: 'http://hostname/p/a/t/h/file.hwp',
    messageId: '1234152',
    contents: '<html><head>우아아아앙</head></html>',
    category: 'notice',
    kind: 'main',
  },
  attachedFiles: {
    url: 'http://hostname/p/a/t/h/file.hwp',
    name: 'path파일.hwp',
  },
}, {Notice Object}]
```
배열로 반환되며 그 안에 공지사항 오브젝트가 담겨있는 형태이다.
##### Notice Object
- notice : 하나의 공지사항을 다루는 오브젝트.
  - title : 공지사항의 제목.
  - date : 공지사항이 공지된 날짜.
  - url : 공지사항 페이지의 링크.
  - messageId : 공지사항의 식별번호. 문자열
  - contents : 공지사항의 내용을 가져온다. html형태.
  - category : 공지사항의 카테고리
  - kind : 공지사항의 종류
- attachedFiles : 공지사항에 첨부된 파일의 오브젝트.
  - url : 첨부파일을 다운받을 수 있는 링크.
  - name : 첨부파일의 이름.

## License
```
Copyright 2017 SSUmunity

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```
