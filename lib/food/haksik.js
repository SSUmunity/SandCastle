'use strict';

const utils = require('./../common/utils');
const constants = require('./../common/baseUrl');
const cheerio = require('cheerio');

utils.loadFormatUnicorn();

// function keepOnlyKorean(text) {
//   // 한글 제외하고 전부 제거
//   // *는 남겨둔다.
//   return text.replace(/[a-z0-9]|[ [\]{}()<>?|`~!@#$%^&-_+=,.;:"\\]/g, '');
// }

function removeBetweenParentheses(text) {
  // 괄호 () 사이의 모든문자와 괄호 제거
  return text.replace(/(\(.+)\)/g, '');
}

function removeUnlessKoreanWhitespace(text) {
  // 한글, 띄어쓰기 제외하고 전부 제거
  // *는 남겨둔다
  return text.replace(/[a-z0-9]|[[\]{}()<>?|`~!@#$%^&-_+=,.;:"\\]/g, '');
}

function removeContinuousWhitespace(text) {
  // TODO: 이름 적절하게 바꾸기
  // 이름에 오해의 소지가 있음.
  // 여러개의 화이트스페이스를 개행문자 \n으로 치환한다.
  return text.replace(/\s{2,}/g, '\n');
}

function parseFaculty(response) {
  // 교식
  // return:
  // { '중식1': [ '뚝배기불고기전골', '호박새우젓볶음오렌지쥬스맛김치' ],
  //   '중식2': [ '해물볶음우동', '유부초밥김말이튀김' ],
  //   '중식3': [ '치킨까스유린기', '감자채볶음배추국맛김치' ],
  //   '석식1': [ '참치마요덮밥', '볶음김치계란국요구르트' ] }
  const jsn = JSON.parse(response.body);
  const facultyFoods = jsn['교직원식당'];
  const ret = {};
  Object.keys(facultyFoods).forEach((time) => {
    const $ = cheerio.load(facultyFoods[time]);
    let f = '';
    $('div').each((i, div) => {
      f = f.concat('\n'.concat($(div).text()));
    });
    f = removeUnlessKoreanWhitespace(f);
    f = removeContinuousWhitespace(f.trim());
    ret[time] = f.trim().split('\n');
  });

  return ret;
}

function parsePupil(response) {
  // 학식
  // return:
  // { '조식': [ '쇠고기미역국' ],
  //   '중식1':
  //   [ '가오리찜양념장',
  //     '녹두밥',
  //     '블로콜리초장',
  //     '훈제오리김치볶음',
  //     '쑥갓두부무침',
  //     '들깨가루무나물',
  //     '얼큰어묵국' ],
  //     '중식2': [ '콩나물밥양장피잡채' ],
  //   '석식1':
  //   [ '청양풍돈사태찜덮밥',
  //     '고구마맛탕',
  //     '라면사리초장무침',
  //     '지리멸치땅콩조림',
  //     '호박고추장국',
  //     '배추김치',
  //     '흰밥' ] }
  const jsn = JSON.parse(response.body);
  const pupilFoods = jsn['학생식당'];
  const ret = {};
  Object.keys(pupilFoods).forEach((time) => {
    const $ = cheerio.load(pupilFoods[time]);
    let f = '';
    $('div').each((i, div) => {
      const t = $(div).text();
      f += `\n ${t}`;
    });

    f = removeUnlessKoreanWhitespace(f);
    f = removeContinuousWhitespace(f.trim());
    ret[time] = f.split('\n');
  });

  return ret;
}

function parseDorm(response) {
  const $ = cheerio.load(response);
  const table = $('table[class=boxstyle02]');
  const rows = table.find('tr').slice(1);
  const ret = {};
  rows.each((i, tr) => {
    const cells = $(tr).find('td');
    ret['월화수목금토일'[i]] = {};
    cells.each((j, td) => {
      let koreanData = $(td).text();
      koreanData = removeBetweenParentheses(koreanData);
      koreanData = removeUnlessKoreanWhitespace(koreanData);
      koreanData = removeContinuousWhitespace(koreanData);
      ret['월화수목금토일'[i]][['아침', '점심', '저녁', '특식'][j]] = koreanData.trim().split('\n');
    });
  });

  return ret;
}

function parsePrice(response, menuList) {
  // TODO: complete function
  // // on going
  // const $ = cheerio.load(response);
  // const ret = [];
  // for (const menu in menuList) {
  //   const div = $('div');
  //   if (div.length === 0) {
  //     // console.log('div 가 없다!! span으로 찾아야함.');
  //     // $('span').each(function (i, span) {
  //     //   if ($(span).text().includes(menu)) {
  //     //     console.log($(span).parent().parent().parent().text());
  //     //   }
  //     // })
  //   } else {
  //     // div.each(function (i, div) {
  //     //   if ($(div).text().includes(menu)) {
  //     //     console.log($(div).text());
  //     //   }
  //     // })
  //     // const selector = 'div:contains("{text}")'.formatUnicorn({
  //     //   text: menu,
  //     // });
  //     // console.log(selector);
  //     // console.log($(selector).text());
  //   }
  // }
  //
  // return ret;
}

function getSoonguriJsonUrl(dayOfWeek) {
  // params: dayOfWeek = 0~6
  let urlForm = constants.SOONGGURI_JSON;
  const date = new Date();
  const d = dayOfWeek || date.getDay();
  urlForm = urlForm.formatUnicorn({
    DAY_OF_WEEK: d,
  });

  return urlForm;
}

function getSsuDormUrl(year, month, day) {
  // params: year, month, day
  // 인자가 없으면 오늘 날짜를 넣어준다.
  // TODO: UTC 기준으로 날짜 받는걸 한국시간으로 바꿔야함
  let urlForm = constants.SSU_DORM_URL;
  const date = new Date();
  const dayOfWeek = date.getDay();
  const lnt = {}; // eslint가 계속 고치라해서 어쩔수없잉 넣음
  if (dayOfWeek === 0) {
    // 일요일에 표가 다음주로 넘어가버림
    const yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
    lnt.year = year || yesterday.getUTCFullYear();
    lnt.month = month || yesterday.getUTCMonth() + 1;
    lnt.day = day || yesterday.getUTCDate();
  } else {
    lnt.year = year || date.getUTCFullYear();
    lnt.month = month || date.getUTCMonth() + 1;
    lnt.day = day || date.getUTCDate();
  }

  urlForm = urlForm.formatUnicorn({
    YEAR: lnt.year,
    MONTH: lnt.month,
    DAY: lnt.day,
  });

  return urlForm;
}

function getSsuDesktopUrl() {
  return constants.SOONGGURI_DESKTOP_URL;
}

module.exports = {
  getSoonguriJsonUrl,
  getSsuDormUrl,
  getSsuDesktopUrl,
  parseFaculty,
  parsePupil,
  parseDorm,
  parsePrice, // 테스트용
};
