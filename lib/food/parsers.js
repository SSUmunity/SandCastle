'use strict';

const cheerio = require('cheerio');
const {
  removeUnlessKoreanWhitespace,
  replaceContinuousSpaceToNewLine,
  removeBetweenParentheses,
} = require('./cafeteriaUtils');
const errors = require('./errors');


function parsePrice(response, menuList) {
  // TODO: complete function
  // // on going
  const $ = cheerio.load(response);
  const priceReg = /\d,\d{3}/g;
  const prices = [];
  const $td = $('td');
  menuList.forEach((menu) => {
    if ($td.length !== 0) {
      $td.each((i, elem) => {
        if ($(elem).text().includes(menu)) {
          const priceIncludedString = $(elem).text();
          const price = priceIncludedString.match(priceReg);
          if (price === null) return;
          prices.push(price);
        }
      });
    } else {
      $('span').each((i, elem) => {
        if ($(elem).text().length < 50) {
          if ($(elem).text().includes(menu)) {
            const priceIncludedString = $(elem).parent().parent().parent()
              .text();
            const price = priceIncludedString.match(priceReg);
            if (price === null) return;
            prices.push(price);
          }
        }
      });
    }
  });
  return prices
    .sort((a, b) => prices.filter(v => v === a).length - prices.filter(v => v === b).length)
    .pop();
}


function parseOfficer(body, priceBody) {
  // 교식
  // return:
  // { '중식1': [ '뚝배기불고기전골', '호박새우젓볶음오렌지쥬스맛김치' ],
  //   '중식2': [ '해물볶음우동', '유부초밥김말이튀김' ],
  //   '중식3': [ '치킨까스유린기', '감자채볶음배추국맛김치' ],
  //   '석식1': [ '참치마요덮밥', '볶음김치계란국요구르트' ] }
  const json = JSON.parse(body);
  const facultyFoods = json['교직원식당'];
  if (facultyFoods === undefined) {
    throw new errors.NoFoodToday('교직원식당');
  }
  const ret = [];
  Object.keys(facultyFoods).forEach((time) => {
    const $ = cheerio.load(facultyFoods[time]);
    let officerString = '';
    $('div').each((i, div) => {
      officerString = officerString.concat('\n'.concat($(div).text()));
    });
    officerString = removeUnlessKoreanWhitespace(officerString);
    officerString = replaceContinuousSpaceToNewLine(officerString.trim());

    const meals = officerString.trim().split('\n');
    const category = time.replace(/[0-9 ]/g, '');
    const price = parsePrice(priceBody, meals);
    const single = {
      category, price, meals,
    };
    ret.push(single);
  });

  return ret;
}

function parseStudent(body, priceBody) {
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
  if (pupilFoods === undefined) {
    throw new errors.NoFoodToday('학생식당');
  }
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

    const meals = pupilString.split('\n');
    const category = time.replace(/[0-9 ]/g, '');
    const price = parsePrice(priceBody, meals);
    const single = {
      category, price, meals,
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
        price: 0,
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
  if (foodCourtFoods === undefined) {
    throw new errors.NoFoodToday('푸드코트');
  }
  const priceReg = /\d\.\d$/g;
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
    let kind = '';
    menus.forEach((menu) => {
      if (menu.search('파스타') >= 0) {
        kind = '파스타';
      } else if (menu.search('리조또') >= 0) {
        kind = '리조또';
      } else if (menu.search('국수') >= 0) {
        kind = '면류';
      } else if (menu.search('피자') >= 0) {
        kind = '피자';
      } else if (menu.search('짬뽕') >= 0) {
        kind = '면류';
      } else if (menu.search('밥') >= 0) {
        kind = '밥';
      } else {
        kind = '미분류';
      }
      let price = menu.match(priceReg);
      if (price !== null) {
        [price] = price;
      }
      const single = {
        category: kind,
        price,
        meals: menu.replace(/\d|\.|(\s?-\s?)/g, '').trim(),
      };
      ret.push(single);
    });
  });
  return ret;
}

function parseSnackCorner(body) {
  const json = JSON.parse(body);
  const foodCourtFoods = json['스넥코너'];
  if (foodCourtFoods === undefined) {
    throw new errors.NoFoodToday('스넥코너');
  }
  const ret = [];
  const priceReg = /\d\.\d$/g;
  Object.keys(foodCourtFoods).forEach((section) => {
    const $ = cheerio.load(foodCourtFoods[section]);
    let foodString = '';
    $('div').each((i, div) => {
      const t = $(div).text();
      if (t.length < 20) {
        foodString += `\n${t.trim()}`;
      }
    });
    let menus = foodString.split('\n');
    // menus = menus.filter((menu) => ['#', '<', '('].indexOf(menu[0]) < 0);
    menus = menus.filter((menu) => menu !== '');
    menus = Array.from(new Set(menus));
    menus = menus.map((menu) => menu.replace('<new>', ''));
    menus = menus.map((menu) => menu.trim());
    let kind = '';
    menus.forEach((menu) => {
      if (menu.slice(-1) === '류' || menu === '샌드위치') {
        kind = menu;
        return;
      }
      let price = menu.match(priceReg);
      if (price !== null) {
        [price] = price;
      }
      const single = {
        category: kind,
        price,
        meals: menu.replace(/\d|\.|(\s?-\s?)/g, '').trim(),
      };
      ret.push(single);
    });
  });
  return ret;
}


module.exports = {
  parseOfficer,
  parseResidence,
  parseStudent,
  parseFoodCourt,
  parseSnackCorner,
  parsePrice,
};
