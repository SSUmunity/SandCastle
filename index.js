'use strict';

const notice = require('./lib/notice');
const food = require('./lib/food');

exports.notice = (option) => notice.getNoticeList(option);
exports.Notice = {
  Kind: notice.Kind,
  Main: notice.MainConstant,
};

exports.food = food;
