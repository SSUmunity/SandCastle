'use strict';

const request = require('request');
const cafeteriaUtils = require('./cafeteriaUtils');
const parser = require('./parsers');
const {Iconv} = require('iconv');
const errors = require('./errors');
const {Kind, DayOfWeek} = require('./constants');

const iConv = new Iconv('euc-kr', 'utf-8//translit//ignore');


async function getPriceBody() {
  return new Promise((resolve, reject) => {
    request({
      uri: cafeteriaUtils.getSsuDesktopUrl(),
      timeout: 1500,
    }, (err, response) => {
      if (!err) {
        resolve(response.body);
      }
      reject(new errors.SoongguriDesktopConnectionError());
    });
  });
}

async function getOfficer(dayOfWeek) {
  // params: dayOfWeek = 0~6
  return getPriceBody().then((priceBody) => new Promise((resolve, reject) => {
    request({
      uri: cafeteriaUtils.getSoonguriJsonUrl(dayOfWeek),
      timeout: 1500,
    }, (err, response, body) => {
      if (!err) {
        const ret = {
          kind: 'officer',
          dayOfWeek,
          date: cafeteriaUtils.getDate(dayOfWeek).toLocaleDateString(),
          menu: parser.parseOfficer(body, priceBody),
        };
        resolve(ret);
      } else {
        reject(new errors.SoongguriJsonConnectionError());
      }
    });
  }), (error) => error);
}

async function getStudent(dayOfWeek) {
  // params: dayOfWeek = 0~6
  return getPriceBody().then((priceBody) => new Promise((resolve, reject) => {
    request({
      uri: cafeteriaUtils.getSoonguriJsonUrl(dayOfWeek),
      timeout: 1500,
    }, (err, response, body) => {
      if (!err) {
        const ret = {
          kind: 'student',
          dayOfWeek,
          date: cafeteriaUtils.getDate(dayOfWeek).toLocaleDateString(),
          menu: parser.parseStudent(body, priceBody),
        };
        resolve(ret);
      } else {
        reject(new errors.SoongguriJsonConnectionError());
      }
    });
  }), (error) => error);
}

async function getFoodCourt(dayOfWeek) {
  return new Promise((resolve, reject) => {
    request({
      uri: cafeteriaUtils.getSoonguriJsonUrl(dayOfWeek),
      timeout: 1500,
    }, (err, response, body) => {
      if (!err) {
        const ret = {
          kind: 'foodCourt',
          dayOfWeek,
          date: cafeteriaUtils.getDate(dayOfWeek).toLocaleDateString(),
          menu: parser.parseFoodCourt(body),
        };
        resolve(ret);
      } else {
        reject(new errors.SoongguriJsonConnectionError());
      }
    });
  });
}

async function getSnackCorner(dayOfWeek) {
  return new Promise((resolve, reject) => {
    request({
      uri: cafeteriaUtils.getSoonguriJsonUrl(dayOfWeek),
      timeout: 1500,
    }, (err, response, body) => {
      if (!err) {
        const ret = {
          kind: 'snackCorner',
          dayOfWeek,
          date: cafeteriaUtils.getDate(dayOfWeek).toLocaleDateString(),
          menu: parser.parseSnackCorner(body),
        };
        resolve(ret);
      } else {
        reject(new errors.SoongguriJsonConnectionError());
      }
    });
  });
}

async function getResidence(option) {
  // params: option
  // date 나 dayOfWeek 중 하나만 받는다.
  let date = new Date();
  let correction = 1;
  if (option.date) {
    date = new Date(option.date);
  } else if (option) {
    date = cafeteriaUtils.getDate(option);
    correction = 0;
  }
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + correction;
  const day = date.getDate();
  return new Promise((resolve, reject) => {
    request({
      url: cafeteriaUtils.getSsuDormUrl(year, month, day),
      encoding: null,
      timeout: 1500,
    }, (err, response) => {
      if (!err) {
        const resEucKr = iConv.convert(response.body).toString();
        const ret = {
          kind: 'residence',
          dayOfWeek: date.getDay(),
          date: `${month}/${day}/${year}`,
          menu: parser.parseResidence(resEucKr)['일월화수목금토'[date.getDay()]],
        };
        resolve(ret);
      } else {
        reject(new errors.SsuDormConnectionError());
      }
    });
  });
}

const dispatcher = {
  학식: getStudent,
  교식: getOfficer,
  기식: getResidence,
  푸드코트: getFoodCourt,
  스넥코너: getSnackCorner,
  pupil: getStudent,
  officer: getOfficer,
  dorm: getResidence,
};

function isValidOption(option) {
  if (!('kind' in option)) return false;
  else if (!('dayOfWeek' in option) && !('date' in option)) {
    return false;
  }

  if (('dayOfWeek' in option) && ('date' in option)) {
    throw new Error('cannot have both option dayOfWeek and date');
  }
  return true;
}

async function cafeteria(option) {
  if (isValidOption(option)) {
    if ('date' in option) {
      return dispatcher[option.kind]({date: option.date});
    }
    const reformed = cafeteriaUtils.reformDayOfWeek(option.dayOfWeek);
    return dispatcher[option.kind](reformed);
  }
  throw new Error(`invalid option ${JSON.stringify(option)} read: https://github.com/ssumunity/sandcastle/readme.md#cafeteria-option`);
}

module.exports = {
  getOfficer,
  getStudent,
  getResidence,
  getFoodCourt,
  getSnackCorner,
  Kind,
  DayOfWeek,
  cafeteria,
};