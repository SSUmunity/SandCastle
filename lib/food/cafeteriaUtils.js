'use strict';

const utils = require('./../common/utils');
const constants = require('./../common/baseUrl');
const errors = require('./errors');

utils.loadFormatUnicorn();

// 괄호 () 사이의 모든문자와 괄호 제거
function removeBetweenParentheses(text) {
  return text.replace(/(\(.+)\)/g, '');
}

/* 한글, 띄어쓰기 제외하고 전부 제거
 *는 남겨둔다 */
function removeUnlessKoreanWhitespace(text) {
  return text.replace(/[a-z0-9]|[[\]{}()<>?|`~!@#$%^&-_+=,.;:"\\]/g, '');
}

/* 이름에 오해의 소지가 있음.
 여러개의 화이트스페이스를 개행문자 \n으로 치환한다. */
function replaceContinuousSpaceToNewLine(text) {
  return text.replace(/\s{2,}/g, '\n');
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

function getSsuDormUrl(year, month, day) {
  // params: year, month, day
  // 인자가 없으면 오늘 날짜를 넣어준다.
  // TODO: UTC 기준으로 날짜 받는걸 한국시간으로 바꿔야함
  let urlForm = constants.SSU_DORM_URL;
  const date = new Date('{}-{}-{}'.formatUnicorn({year, month, day}));
  const dow = date.getDay();
  const lnt = {}; // eslint가 계속 고치라해서 어쩔수없잉 넣음
  if (dow === 0) {
    // 일요일에 표가 다음주로 넘어가버림
    const yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
    lnt.year = yesterday.getUTCFullYear();
    lnt.month = yesterday.getUTCMonth();
    lnt.day = yesterday.getUTCDate();
  } else {
    lnt.year = year;
    lnt.month = month;
    lnt.day = day;
  }

  urlForm = urlForm.formatUnicorn({
    YEAR: lnt.year,
    MONTH: lnt.month,
    DAY: lnt.day,
  });
  console.log(urlForm);
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

/*
 dayOfWeek를 인자로 받아서 Date객체를 리턴한다.
 ex ) getDate('mon') returns '2017-11-13'
 */
function getDate(dayOfWeek) {
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
  removeBetweenParentheses,
  removeUnlessKoreanWhitespace,
  replaceContinuousSpaceToNewLine,
  getSoonguriJsonUrl,
  getSsuDormUrl,
  getSsuDesktopUrl,
  getDayOfWeek,
  getDate,
  reformDayOfWeek,
};
