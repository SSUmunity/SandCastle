'use strict';

const mainNotice = require('./main/index');

const Kind = {
  MAIN: 'Main',
};

function isOptionValid(option) {
  if (typeof option !== 'object') return false;
  if (!('kind' in option)) return false;
  if (!('increaseMode' in option)) return false;
  if (!('startPage' in option)) return false;
  if (!('category' in option)) return false;
  if (option.increaseMode === mainNotice.Constant.IncreaseMode.PAGE) {
    if (!('endPage' in option)) return false;
    if (typeof option.endPage !== 'number') return false;
    if (option.startPage >= option.endPage) return false;
  }
  if (option.increaseMode === mainNotice.Constant.IncreaseMode.COUNT) {
    if (!('count' in option)) return false;
    if (typeof option.count !== 'number') return false;
    if (option.count < 1) return false;
  }
  if (option.startPage < 1) return false;
  if (typeof option.kind !== 'string') return false;
  if (typeof option.increaseMode !== 'string') return false;
  if (typeof option.category !== 'object') return false;
  return typeof option.startPage === 'number';
}

exports.MainConstant = mainNotice.Constant;

exports.Kind = Kind;

exports.getNoticeList = (option) => {
  if (!isOptionValid(option)) return undefined;

  let noticeList;
  switch (option.kind) {
    case Kind.MAIN:
      noticeList = mainNotice.getNoticeList(option);
      break;
    default:
      noticeList = undefined;
      break;
  }
  return noticeList;
};
