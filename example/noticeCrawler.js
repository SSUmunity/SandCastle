'use strict';

const sandCastle = require('../index');

/**
 * kind : 공지사항 종류
 * startPage : 크롤링 시작하는 페이지
 * endPage : 크롤링 끝나는 페이지
 * count : startPage 부터 count 페이지만큼 크롤링
 * increaseMode: 모드에 따라 endPage값을 사용할지 count값을 사용할지 결정한다.
 * category : 카테고리, 배열이며, 안에 있는 카테고리들을 가져온다.  ex) all, notice...
 */
const option = {
  kind: sandCastle.Notice.Kind.MAIN,
  startPage: 1,
  endPage: 2,
  count: '',
  increaseMode: sandCastle.Notice.Main.IncreaseMode.PAGE,
  category: [sandCastle.Notice.Main.Category.notice],
};

const noticeList = sandCastle.notice(option);
noticeList
  .then(console.log)
  .catch(console.log);
