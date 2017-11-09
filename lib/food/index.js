'use strict';

const request = require('request');
const haksik = require('./haksik');
const iconv = require('iconv');
const errors = require('./errors');

const iConv = new iconv.Iconv('euc-kr', 'utf-8//translit//ignore');

async function getOfficer(dayOfWeek) {
  // params: dayOfWeek = 0~6
  return new Promise((resolve, reject) => {
    request(haksik.getSoonguriJsonUrl(dayOfWeek), (err, response, body) => {
      if (!err) {
        resolve(haksik.parseOfficer(body));
      } else {
        reject(new errors.SoongguriJsonConnectionError());
      }
    });
  });
}

async function getPupil(dayOfWeek) {
  // params: dayOfWeek = 0~6
  return new Promise((resolve, reject) => {
    request(haksik.getSoonguriJsonUrl(dayOfWeek), (err, response, body) => {
      if (!err) {
        resolve(haksik.parsePupil(body));
      } else {
        reject(new errors.SoongguriJsonConnectionError());
      }
    });
  });
}

async function getDorm(option) {
  // params: option
  // date 나 dayOfWeek 중 하나만 받는다.
  let date = new Date();
  if (option.date) {
    date = new Date(option.date);
  } else if (option) {
    date = haksik.getDate(option);
  }
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getDay();
  console.log(`${year} ${month} ${day}`);
  return new Promise((resolve, reject) => {
    request({
      url: haksik.getSsuDormUrl(year, month, day),
      encoding: null,
    }, (err, response) => {
      if (!err) {
        const resEucKr = iConv.convert(response.body).toString();
        resolve(haksik.parseDorm(resEucKr));
      } else {
        reject(new errors.SsuDormConnectionError());
      }
    });
  });
}

async function getPrice(menuList) {
  // !not implemented
  // TODO: complete function
  return new Promise((resolve, reject) => {
    request(haksik.getSsuDesktopUrl(), (err, response) => {
      if (!err) {
        resolve(haksik.parsePrice(response.body, menuList));
      } else {
        reject(new errors.SoongguriDesktopConnectionError());
      }
    });
  });
}

const dispatcher = {
  학식: getPupil,
  교식: getOfficer,
  기식: getDorm,
  pupil: getPupil,
  officer: getOfficer,
  dorm: getDorm,
};

function isValidOption(option) {
  if (!('kind' in option)) return false;
  else if (!('dayOfWeek' in option) && !('date' in option)) {
    return false;
  }

  if (option.kind === 'dorm') {
    if (('dayOfWeek' in option) && ('date' in option)) {
      throw new Error('cannot have both option dayOfWeek and date');
    }
  }
  return true;
}

function cafeteria(option) {
  if (isValidOption(option)) {
    if ('date' in option) {
      const dow = haksik.getDayOfWeek(option.date);
      return dispatcher[option.kind]({date: dow});
    }
    const reformed = haksik.reformDayOfWeek(option.dayOfWeek);
    return dispatcher[option.kind](reformed);
  }
}

module.exports = {
  getOfficer,
  getPupil,
  getDorm,
  cafeteria,
  getPrice,
};
