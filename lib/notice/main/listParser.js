'use strict';

const cheerio = require('cheerio');
const {URL} = require('url');

function getMessageId(url) {
  const messageUrl = new URL(url);
  return messageUrl.searchParams.get('messageId');
}

module.exports = (htmlString, urlOrigin) => {
  const $ = cheerio.load(htmlString);
  const list = [];
  $('li.first-child').each((i, elements) => {
    const aTag = cheerio('.subject', $(elements).html());
    const spanTag = cheerio('.date', $(elements).html());
    const href = urlOrigin + aTag.attr('href');

    const notice = {
      notice: {
        title: aTag.text(),
        date: spanTag.text(),
        url: href,
        messageId: getMessageId(href),
      },
    };
    list.push(notice);
  });
  return list;
};
