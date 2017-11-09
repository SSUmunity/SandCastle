'use strict';

const utils = require('./../common/utils');
const constants = require('./../common/baseUrl');
const errors = require('./errors');
const cheerio = require('cheerio');

utils.loadFormatUnicorn();

// 괄호 () 사이의 모든문자와 괄호 제거
function removeBetweenParentheses(text) {
  return text.replace(/(\(.+)\)/g, '');
}

function removeUnlessKoreanWhitespace(text) {
  /* 한글, 띄어쓰기 제외하고 전부 제거
  *는 남겨둔다 */
  return text.replace(/[a-z0-9]|[[\]{}()<>?|`~!@#$%^&-_+=,.;:"\\]/g, '');
}

function replaceContinuousSpaceToNewLine(text) {
  /* 이름에 오해의 소지가 있음.
  여러개의 화이트스페이스를 개행문자 \n으로 치환한다. */
  return text.replace(/\s{2,}/g, '\n');
}

function parseOfficer(body) {
  // 교식
  // return:
  // { '중식1': [ '뚝배기불고기전골', '호박새우젓볶음오렌지쥬스맛김치' ],
  //   '중식2': [ '해물볶음우동', '유부초밥김말이튀김' ],
  //   '중식3': [ '치킨까스유린기', '감자채볶음배추국맛김치' ],
  //   '석식1': [ '참치마요덮밥', '볶음김치계란국요구르트' ] }
  const json = JSON.parse(body);
  const facultyFoods = json['교직원식당'];
  const ret = {};
  Object.keys(facultyFoods).forEach((time) => {
    const $ = cheerio.load(facultyFoods[time]);
    let officerString = '';
    $('div').each((i, div) => {
      officerString = officerString.concat('\n'.concat($(div).text()));
    });
    officerString = removeUnlessKoreanWhitespace(officerString);
    officerString = replaceContinuousSpaceToNewLine(officerString.trim());
    ret[time] = officerString.trim().split('\n');
  });

  return ret;
}

function parsePupil(body) {
  /* 학식
  return:
  { '조식': [ '쇠고기미역국' ],
    '중식1':
    [ '가오리찜양념장',
      '녹두밥',
      '블로콜리초장',
      '훈제오리김치볶음',
      '쑥갓두부무침',
      '들깨가루무나물',
      '얼큰어묵국' ],
      '중식2': [ '콩나물밥양장피잡채' ],
    '석식1':
    [ '청양풍돈사태찜덮밥',
      '고구마맛탕',
      '라면사리초장무침',
      '지리멸치땅콩조림',
      '호박고추장국',
      '배추김치',
      '흰밥' ] } */
  const json = JSON.parse(body);
  const pupilFoods = json['학생식당'];
  const ret = {};
  Object.keys(pupilFoods).forEach((time) => {
    const $ = cheerio.load(pupilFoods[time]);
    let pupilString = '';
    $('div').each((i, div) => {
      const t = $(div).text();
      pupilString += `\n ${t}`;
    });

    pupilString = removeUnlessKoreanWhitespace(pupilString);
    pupilString = replaceContinuousSpaceToNewLine(pupilString.trim());
    ret[time] = pupilString.split('\n');
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
      koreanData = replaceContinuousSpaceToNewLine(koreanData);
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
    DAY_OF_WEEK: d === 0 ? 7 : d,
  });

  return urlForm;
}

function getSsuDormUrl(dayOfWeek, year, month, day) {
  // params: year, month, day
  // 인자가 없으면 오늘 날짜를 넣어준다.
  // TODO: UTC 기준으로 날짜 받는걸 한국시간으로 바꿔야함
  let urlForm = constants.SSU_DORM_URL;
  const date = new Date();
  const dow = dayOfWeek || date.getDay();
  const lnt = {}; // eslint가 계속 고치라해서 어쩔수없잉 넣음
  if (dow === 0) {
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

function getThisWeeksSunday() {
  const today = new Date();
  return new Date(new Date().setDate(new Date().getDate() - today.getDay()));
}

function reformDayOfWeek(dayOfWeek) {
  if (typeof dayOfWeek === 'string') {
    if (dayOfWeek.toLowerCase().match(/^(sun|mon|tue|wed|weds|thu|fri|sat)$/g)) {
      const stringToInteger = {
        sun: 0,
        mon: 1,
        tue: 2,
        wed: 3,
        weds: 3,
        thu: 4,
        fri: 5,
        sat: 6,
      };
      return stringToInteger[dayOfWeek];
    }
  }
  return dayOfWeek;
}

function getDate(dayOfWeek) {
  /*
  dayOfWeek를 인자로 받아서 Date객체를 리턴한다.
  ex ) getDate('mon') returns '2017-11-13'
   */
  const sun = getThisWeeksSunday();
  if (typeof dayOfWeek === 'string') {
    if (dayOfWeek.toLowerCase().match(/^(sun|mon|tue|wed|weds|thu|fri|sat)$/g)) {
      const today = new Date(new Date().setDate(sun.getDate() + reformDayOfWeek(dayOfWeek)));
      return today;
    } else if (dayOfWeek.match(/^0-6$/)) {
      const today = new Date(new Date().setDate(sun.getDate() + parseInt(dayOfWeek, 10)));
      return today;
    }
  } else if (typeof dayOfWeek === 'number') {
    const today = new Date(new Date().setDate(sun.getDate() + dayOfWeek));
    return today;
  }
  throw new errors.UnexpectedParameterDayOfWeek(dayOfWeek);
}

function getDayOfWeek(dateString) {
  if (typeof dateString === 'string') {
    if (dateString.match(/^\d{4}-\d{2}-\d{2}$/g)) {
      const date = new Date(dateString);
      return date.getDay();
    }
    throw new errors.UnexpectedParameterDate();
  }
  throw new Error('dateString must be string type');
}

function getSsuDesktopUrl() {
  return constants.SOONGGURI_DESKTOP_URL;
}

module.exports = {
  getSoonguriJsonUrl,
  getSsuDormUrl,
  getSsuDesktopUrl,
  parseOfficer,
  parsePupil,
  parseDorm,
  getDayOfWeek,
  getDate,
  reformDayOfWeek,
  parsePrice, // 테스트용
};
