'use strict';

const request = require('request');
const haksik = require('./haksik');
const Iconv = require('iconv').Iconv;
const exceptions = require('./exceptions');

const iConv = new Iconv('euc-kr', 'utf-8//translit//ignore');

async function getFacultyJson(dayOfWeek) {
  // params: dayOfWeek = 0~6
  return new Promise((resolve, reject) => {
    request(haksik.getSoonguriJsonUrl(dayOfWeek), (err, response) => {
      if (!err) {
        resolve(haksik.parseFaculty(response));
      } else {
        reject(new exceptions.SoongguriJsonConnectionException());
      }
    });
  });
}

async function getPupilJson(dayOfWeek) {
  // params: dayOfWeek = 0~6
  return new Promise((resolve, reject) => {
    request(haksik.getSoonguriJsonUrl(dayOfWeek), (err, response) => {
      if (!err) {
        resolve(haksik.parsePupil(response));
      } else {
        reject(new exceptions.SoongguriJsonConnectionException());
      }
    });
  });
}

async function getDormJson(year, month, day) {
  // params: year, month, day
  // 인자가 없으면 오늘 날짜로 작동한다.
  return new Promise((resolve, reject) => {
    request({
      url: haksik.getSsuDormUrl(year, month, day),
      encoding: null,
    }, (err, response) => {
      if (!err) {
        const resEucKr = iConv.convert(response.body).toString();
        resolve(haksik.parseDorm(resEucKr));
      } else {
        reject(new exceptions.SsuDormConnectionException());
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
        reject(new exceptions.SoongguriJsonConnectionException());
      }
    });
  });
}

module.exports = {
  getFacultyJson,
  getPupilJson,
  getDormJson,
  getPrice,
};
