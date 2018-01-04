# SandCastle
손으로 모래를 모아 모래성을 쌓듯 한손 한손 데이터를 긁어모아서 만든 숭실대학교 데이터 크롤러.
NodeJS 라이브러리로 API호출로 데이터 오브젝트를 반환한다.

# 목차
- [설치 방법](#설치-방법)
- [제공 기능](#제공-기능)
  - [공지사항](#공지사항)
    - [중앙 공지사항](#중앙-공지사항)
      - [사용법](#사용법)
  - [식단](#식단)
    - [학식](#학식)
      - [사용법](#학식-예제)
    - [교식](#교식)
      - [사용법](#교식-예제)
    - [기식](#기식)
      - [사용법](#기식-예제)
    - [푸드코트](#푸드코트)
      - [사용법](#푸드코트-예제)
    - [더 키친](#더-키친)
      - [사용법](#더키친-예제)
- [에러](#에러)
  - [NoFoodToday](#nofoodtoday)
  - [UnexpectedParameterDate](#unexpectedparameterdate)
  - [UnexpectedParameterDayOfWeek](#unexpectedparameterdayofweek)
  - [SoongguriDesktopConnectionError](#soongguridesktopconnectionerror)
  - [SoongguriJsonConnectionError](#soonggurijsonconnectionerror)
  - [SsuDormConnectionError](#ssudormconnectionerror)
- [License](#license)

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

## 식단

숭실대학교의 식단을 파싱하는 기능을 수행한다.

#### sandCastle.cafeteria

- args: [cafeteria option](#cafeteria-option)

- return: Native-Promise

#### cafeteria option

dayOfWeek, date, kind 를 키값으로 갖는 object.

##### kind, dayOfWeek

kind 와 dayOfWeek를 위한 상수는 sandCastle.Cafeteria.Kind 와 sandCastle.Cafeteria.DayOfWeek 에 다음과 같이 정의 된다.

```js
sandCastle.Cafeteria.Kind = {
  STUDENT: '학식',
  OFFICER: '교식',
  RESIDENCE: '기식',
  FOOD_COURT: '푸드코트',
  SNACK_CORNER: '스넥코너',
};

sandCastle.Cafeteria.DayOfWeek = {
  SUN: 'sun',
  MON: 'mon',
  TUE: 'tue',
  WED: 'wed',
  THU: 'thu',
  FRI: 'fri',
  SAT: 'sat',
};
```

kind에 따라 option을 다르게 준다. 다음의 표를 참고

| kind  | dayOfWeek | date         |
| :------------ | :-----------: | :-----------------------: |
| 학식 | 필수 | 인자로 받을 수 없음(지원 예정) |
| 교식 | 필수 | 인자로 받을 수 없음(지원 예정) |
| 기식 |양자택일 | 양자택일 |
| 푸드코트 | 필수 | 인자로 받을 수 없음(지원 예정) |
| 스넥코너 | 필수 | 인자로 받을 수 없음(지원 예정) |

##### date

'YEAR-MONTH-DATE' or 'MONTH/DATE/YEAR' 형식을 갖는 String

#### Basic Usage

```js
const sandCastle = require('sandcastle');
sandCastle.cafeteria({
  dayOfWeek: sandCastle.Cafeteria.DayOfWeek.MON,
  // date: '2018-2-2',
  kind: sandCastle.Cafeteria.Kind.STUDENT,
}).then((result) => {
  // Your Code HERE
}).catch((err) => {
  // Your Code HERE
});

sandCastle.cafeteria
```

### 학식

#### 학식 예제

option.kind = sandCastle.Cafeteria.Kind.STUDENT 로 옵션 인자를 전달해서 사용한다.

sandCastle.Cafeteria.Kind.STUDENT 는 '학식'으로 정의된 상수이다.

```js
const sandCastle = require('sandcastle');
const util = require('util');

const myLogger = (res) => {
  console.log(util.inspect(res, {showHidden: false, depth: null}));
};

const option = {
  dayOfWeek: sandCastle.Cafeteria.DayOfWeek.TUE,
  kind: sandCastle.Cafeteria.Kind.STUDENT,
};

sandCastle.cafeteria(option)
  .then(myLogger)
  .catch(myLogger);


> { kind: 'student',
    dayOfWeek: 2,
    date: '2018-2-2',
    menu:
     [ { category: '조식', price: undefined, meals: [ '새해 복 많이 받으세요' ] },
       { category: '중식',
         price: [ '4,000' ],
         meals: [ '포테이토치즈돈가스토마토소스', '미니밥', '미소국', '양상추샐러드', '마늘빵', '깍두기' ] } ] }

```

### 교식

#### 교식 예제

option.kind = sandCastle.Cafeteria.Kind.OFFICER 로 옵션 인자를 전달해서 사용한다.

sandCastle.Cafeteria.Kind.STUDENT 는 '교식'으로 정의된 상수이다.

```js
const sandCastle = require('sandcastle');
const util = require('util');

const myLogger = (res) => {
  console.log(util.inspect(res, {showHidden: false, depth: null}));
};

const option = {
  dayOfWeek: sandCastle.Cafeteria.DayOfWeek.TUE,
  kind: sandCastle.Cafeteria.Kind.OFFICER,
};

sandCastle.cafeteria(option)
  .then(myLogger)
  .catch(myLogger);


> { kind: 'officer',
    dayOfWeek: 4,
    date: '2018-2-4',
    menu:
     [ { category: '중식',
         price: [ '5,000' ],
         meals: [ '고구마돈까스정식', '파스타', '양상추샐러드드레싱', '양파링튀김귤' ] },
       { category: '석식',
         price: [ '4,000' ],
         meals: [ '등뼈감자탕', '오징어파전', '춘권사과잼', '맛살오이초장무침' ] } ] }

```

### 기식

#### 기식 예제

option.kind = sandCastle.Cafeteria.Kind.RESIDENCE 로 옵션 인자를 전달해서 사용한다.

sandCastle.Cafeteria.Kind.RESIDENCE 는 '기식'으로 정의된 상수이다.

```js
const sandCastle = require('sandcastle');
const util = require('util');

const myLogger = (res) => {
  console.log(util.inspect(res, {showHidden: false, depth: null}));
};

// option에 date를 이용
let option = {
  // date는 'YEAR-MONTH-DATE' 혹은 'MONTH/DATE/YEAR' 형식을 만족해야 한다.
  date: '2017-11-30', // '11/30/2017' 로 대신 할 수 있다.
  kind: sandCastle.Cafeteria.Kind.RESIDENCE,
};

sandCastle.cafeteria(option)
  .then(myLogger)
  .catch(myLogger);


> { kind: 'residence',
    dayOfWeek: 4,
    date: '11/30/2017',
    menu:
     [ { category: '조식',
         price: 0,
         meals: [ '동그랑땡전', '연두부맑은국', '건파래볶음', '마늘쫑무침', '김치', '흑미밥' ] },
       { category: '중식',
         price: 0,
         meals: [ '한식잡채', '수제비김칫국', '소시지양파볶음', '깍두기', '흑미밥' ] },
       { category: '석식',
         price: 0,
         meals: [ '생선까스타르타르소스', '육개장', '시금치나물', '김치', '흑미밥' ] },
       { category: '특식', price: 0, meals: [ '특식제육뚝배기', '특석식갈비탕' ] } ] }

//option에 dayOfWeek 이용
option = {
  dayOfWeek: sandCastle.Cafeteria.DayOfWeek.TUE,
  kind: sandCastle.Cafeteria.Kind.RESIDENCE,
};


sandCastle.cafeteria(option)
  .then(myLogger)
  .catch(myLogger);

> { kind: 'residence',
    dayOfWeek: 5,
    date: '1/2/2018',
    menu:
     [ { category: '조식',
         price: 0,
         meals: [ '한식잡채', '시금치된장국', '두부계란전', '깻잎지', '김치', '흑미밥' ] },
       { category: '중식',
         price: 0,
         meals: [ '닭강정', '바지락된장국', '마카로니샐러드', '유부숙주나물', '김치', '흑미밥' ] },
       { category: '석식',
         price: 0,
         meals: [ '베이컨마늘볶음밥', '미역국', '만두강정', '어묵볶음', '김치' ] },
       { category: '특식', price: 0, meals: [ '' ] } ] }

```

### 스넥코너

#### 스넥코너 예제

option.kind = sandCastle.Cafeteria.Kind.SNACK_CORNER 로 옵션 인자를 전달해서 사용한다.

sandCastle.Cafeteria.Kind.SNACK_CORNER 는 '스넥코너'으로 정의된 상수이다.

```js
const sandCastle = require('sandcastle');
const util = require('util');

const myLogger = (res) => {
  console.log(util.inspect(res, {showHidden: false, depth: null}));
};

const option = {
  dayOfWeek: sandCastle.Cafeteria.DayOfWeek.TUE,
  kind: sandCastle.Cafeteria.Kind.SNACK_CORNER,
};

sandCastle.cafeteria(option)
  .then(myLogger)
  .catch(myLogger);


> { kind: 'snackCorner',
    dayOfWeek: 2,
    date: '2018-2-2',
    menu:
     [ { category: '면류', price: '2.8', meals: '짜계치 +야끼만두' },
       { category: '면류', price: '2.5', meals: '계란신라면' },
       { category: '면류', price: '2.5', meals: '치즈신라면' },
       { category: '면류', price: '3.0', meals: '신라면+스쿱밥' },
       { category: '밥류', price: '3.0', meals: '참치마요컵밥' },
       { category: '밥류', price: '2.5', meals: '도시락' },
       { category: '밥류', price: '3.0', meals: '불고기비빔밥' },
       { category: '김밥류', price: '2.5', meals: 'SSU야채김밥' },
       { category: '김밥류', price: '2.5', meals: '매콤마요소고기김밥' },
       { category: '떡볶이류', price: '3.5', meals: '피자치즈라떡볶이' },
       { category: '샌드위치', price: '2.5', meals: '샌드위치+음료' },
       { category: '기타류', price: '3.5', meals: '사골떡만두국' },
       { category: '기타류', price: '1.0', meals: '빅핫도그' },
       { category: '기타류', price: '1.0', meals: '공기밥' } ] }

```

### 푸드코트

#### 푸드코트 예제

```js


option.kind = sandCastle.Cafeteria.Kind.FOOD_COURT 로 옵션 인자를 전달해서 사용한다.

sandCastle.Cafeteria.Kind.FOOD_COURT 는 '푸드코트'으로 정의된 상수이다.

```js
const sandCastle = require('sandcastle');
const util = require('util');

const myLogger = (res) => {
  console.log(util.inspect(res, {showHidden: false, depth: null}));
};

const option = {
  dayOfWeek: sandCastle.Cafeteria.DayOfWeek.TUE,
  kind: sandCastle.Cafeteria.Kind.FOOD_COURT,
};

sandCastle.cafeteria(option)
  .then(myLogger)
  .catch(myLogger);

> { kind: 'foodCourt',
    dayOfWeek: 2,
    date: '2018-2-2',
    menu:
     [ { category: '파스타', price: '6.5', meals: '투움바 파스타' },
       { category: '파스타', price: '6.5', meals: '봉골레 파스타' },
       { category: '파스타', price: '7.0', meals: '빠네파스타' },
       { category: '파스타', price: '6.5', meals: '아라비아따 파스타' },
       { category: '파스타', price: '6.5', meals: '상하이 파스타' },
       { category: '파스타', price: '6.5', meals: '해물크림파스타' },
       { category: '파스타', price: '6.5', meals: '해물토마토파스타' },
       { category: '파스타', price: '6.5', meals: '라구파스타' },
       { category: '리조또', price: '6.5', meals: '해물리조또' },
       { category: '리조또', price: '6.5', meals: '쉬림프로제리조또' },
       { category: '피자', price: '9.0', meals: '마르게리따 피자' },
       { category: '피자', price: '9.0', meals: '고르곤졸라 피자' },
       { category: '미분류', price: '6.5', meals: '찜닭' },
       { category: '미분류', price: '7.0', meals: '치즈찜닭' },
       { category: '면류', price: '6.5', meals: '소고기쌀국수(국물쌀국수)' },
       { category: '면류', price: '6.5', meals: '팟타이(볶음쌀국수)' },
       { category: '밥', price: '6.0', meals: '치킨마늘볶음밥' },
       { category: '면류', price: '6.0', meals: '짬뽕밥' },
       { category: '면류', price: '6.0', meals: '삼선짬뽕' },
       { category: '미분류', price: '6.5', meals: '로스까스' },
       { category: '미분류', price: '6.5', meals: '가츠벤토' },
       { category: '미분류', price: '6.5', meals: '김치치즈가츠동' } ] }


```

## 에러

### NoFoodToday

학교 서버에 식단이 업로드 되지 않아서 데이터를 가져올 수 없는 경우 발생함.

### UnexpectedParameterDate

option으로 넘겨준 date가 'YEAR-MONTH-DATE' 혹은 'MONTH/DATE/YEAR' 형식을 만족하지 않은 경우 발생함.

### UnexpectedParameterDayOfWeek

option으로 넘겨준 dayOfWeek가 ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] 중 한가지가 아닌경우 발생함.

### SoongguriDesktopConnectionError

`http://www.soongguri.com/main.php?mkey=2&w=3&l=3` 로부터 1.5초 이상 응답이 없거나 네트워크가 연결되지 않음.

### SoongguriJsonConnectionError

`http://soongguri.com/menu/m_menujson.php` 로부터 1.5초 이상 응답이 없거나 네트워크가 연결되지 않음.

### SsuDormConnectionError

`http://ssudorm.ssu.ac.kr/SShostel/mall_main.php` 로부터 1.5초 이상 응답이 없거나 네트워크가 연결되지 않음.

## Run Tests

```bash

node ./example/food/student.js

node ./example/food/officer.js

node ./example/food/residence.js

node ./example/food/snackCorner.js

node ./example/food/foodCourt.js

node ./example/noticeCrawler.js

```

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

