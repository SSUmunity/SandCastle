'use strict';

const cheerio = require('cheerio');

module.exports = (htmlString, urlOrigin) => {
  const $ = cheerio.load(htmlString);
  const files = [];
  $('.file a').each((i, elements) => {
    const file = {
      url: urlOrigin + $(elements).attr('href'),
      name: $(elements).text(),
    };
    files.push(file);
  });
  return {
    contents: $('.contents').html().trim(),
    attachedFiles: files,
  };
};
