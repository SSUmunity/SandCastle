'use strict';

const notice = require('./lib/notice');

exports.notice = (option) => notice.getNoticeList(option);
exports.Notice = {
  Kind: notice.Kind,
  Main: notice.MainConstant,
};
