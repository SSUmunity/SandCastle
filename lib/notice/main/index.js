'use strict';

const request = require('request');
const {URL} = require('url');
const baseUrl = require('../../common/baseUrl');
const listParsing = require('./listParser');
const detailParsing = require('./detailParser');

const Category = {
  all: '',
  notice: '학사',
  scholarship: '장학',
  international: '국제교류',
  foreign: '외국인유학생',
  recruit: '모집·채용',
  events: '교내행사',
  external: '교외행사',
  volunteer: '봉사',
  getKeyByValue: (value) => Object.keys(Category).find(key => Category[key] === value),
};

const IncreaseMode = {
  PAGE: 'PAGE',
  COUNT: 'COUNT',
};

exports.Constant = {
  Category,
  IncreaseMode,
};

exports.getNoticeList = async (option) => {
  function getPageCount(inputOption) {
    if (inputOption.increaseMode === IncreaseMode.PAGE) {
      return inputOption.endPage;
    } else if (inputOption.increaseMode === IncreaseMode.COUNT) {
      return inputOption.startPage + inputOption.count;
    }
    return inputOption.startPage;
  }

  function getResponseBody(header) {
    return new Promise((resolve, reject) => {
      request(header, (error, response, body) => {
        if (error) {
          reject(error);
        } else {
          resolve(body);
        }
      });
    });
  }

  function getNoticeList(header, category) {
    const getDetailData = (inputList) => new Promise(async (resolve, reject) => {
      const list = inputList;
      /* eslint no-restricted-syntax:0 */
      for (const [index, item] of list.entries()) {
        try {
          const detailHtmlString = await getResponseBody({
            url: item.notice.url,
          });
          const detail = detailParsing(detailHtmlString, header.url.origin);
          list[index].notice.contents = detail.contents;
          list[index].notice.category = category;
          list[index].notice.kind = 'main';
          list[index].attachedFiles = detail.attachedFiles;
          if (index === list.length - 1) {
            resolve(list);
          }
        } catch (error) {
          reject(error);
        }
      }
    });

    return new Promise(async (resolve, reject) => {
      try {
        const listHtmlString = await getResponseBody(header);
        let detailData = await getDetailData(listParsing(listHtmlString, header.url.origin));
        detailData = detailData.filter(item => item !== undefined);
        resolve(detailData);
      } catch (error) {
        reject(error);
      }
    });
  }

  const requestUrl = new URL(baseUrl.NOTICE_LIST);
  const pageCount = getPageCount(option);

  let noticeList = [];
  for (const category of option.category) {
    try {
      requestUrl.searchParams.set('sCategory', category);
      for (let page = option.startPage; page < pageCount; page += 1) {
        requestUrl.searchParams.set('curPage', page);
        /* eslint no-await-in-loop:0 */
        noticeList = noticeList.concat(await getNoticeList({
          url: requestUrl,
        }, Category.getKeyByValue(category)));
      }
    } catch (error) {
      noticeList = undefined;
      break;
    }
  }
  return noticeList;
};
