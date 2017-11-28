'use strict';

const cheerio = require('cheerio');
const {
  removeUnlessKoreanWhitespace,
  replaceContinuousSpaceToNewLine,
  removeBetweenParentheses,
} = require('./cafeteriaUtils');

function parseOfficer(body) {
  // 교식
  // return:
  // { '중식1': [ '뚝배기불고기전골', '호박새우젓볶음오렌지쥬스맛김치' ],
  //   '중식2': [ '해물볶음우동', '유부초밥김말이튀김' ],
  //   '중식3': [ '치킨까스유린기', '감자채볶음배추국맛김치' ],
  //   '석식1': [ '참치마요덮밥', '볶음김치계란국요구르트' ] }
  const json = JSON.parse(body);
  const facultyFoods = json['교직원식당'];
  const ret = [];
  Object.keys(facultyFoods).forEach((time) => {
    const $ = cheerio.load(facultyFoods[time]);
    let officerString = '';
    $('div').each((i, div) => {
      officerString = officerString.concat('\n'.concat($(div).text()));
    });
    officerString = removeUnlessKoreanWhitespace(officerString);
    officerString = replaceContinuousSpaceToNewLine(officerString.trim());
    const single = {
      category: time.replace(/[0-9 ]/g, ''),
      price: 404,
      meals: officerString.trim().split('\n'),
    };
    ret.push(single);
  });

  return ret;
}

function parseStudent(body) {
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
  const ret = [];
  Object.keys(pupilFoods).forEach((time) => {
    const $ = cheerio.load(pupilFoods[time]);
    let pupilString = '';
    $('div').each((i, div) => {
      const t = $(div).text();
      pupilString += `\n ${t}`;
    });

    pupilString = removeUnlessKoreanWhitespace(pupilString);
    pupilString = replaceContinuousSpaceToNewLine(pupilString.trim());
    const single = {
      category: time.replace(/[0-9 ]/g, ''),
      price: 404,
      meals: pupilString.split('\n'),
    };
    ret.push(single);
  });

  return ret;
}

function parseResidence(response) {
  const $ = cheerio.load(response);
  const table = $('table[class=boxstyle02]');
  const rows = table.find('tr').slice(1);
  const ret = {};
  rows.each((i, tr) => {
    const cells = $(tr).find('td');
    ret['월화수목금토일'[i]] = [];
    cells.each((j, td) => {
      let koreanData = $(td).text();
      koreanData = removeBetweenParentheses(koreanData);
      koreanData = removeUnlessKoreanWhitespace(koreanData);
      koreanData = replaceContinuousSpaceToNewLine(koreanData);
      const single = {
        category: ['조식', '중식', '석식', '특식'][j],
        price: 404,
        meals: koreanData.trim().split('\n'),
      };
      ret['월화수목금토일'[i]].push(single);
    });
  });

  return ret;
}

function parseFoodCourt(body) {
  const json = JSON.parse(body);
  const foodCourtFoods = json['푸드코트'];
  const ret = [];
  Object.keys(foodCourtFoods).forEach((section) => {
    const $ = cheerio.load(foodCourtFoods[section]);
    let foodString = '';
    $('div').each((i, div) => {
      const t = $(div).text();
      if (t.length < 35) {
        foodString += `\n${t.trim()}`;
      }
    });
    let menus = foodString.split('\n');
    menus = menus.filter((menu) => ['#', '<', '('].indexOf(menu[0]) < 0);
    menus = menus.filter((menu) => menu !== '');
    const single = {
      category: section,
      price: 404,
      meals: menus,
    };
    ret.push(single);
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

module.exports = {
  parseOfficer,
  parseResidence,
  parseStudent,
  parseFoodCourt,
  parsePrice,
};
