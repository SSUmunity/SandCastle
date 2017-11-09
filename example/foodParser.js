'use strict';

const sandCastle = require('../index');

const foodParser = sandCastle.food;


function test() {
  let option = {
    dayOfWeek: 'thu',
    kind: '학식',
  };
  foodParser.cafeteria(option)
    .then(console.log);

  option = {
    dayOfWeek: 4,
    kind: '학식',
  };
  foodParser.cafeteria(option)
    .then(console.log);

  option = {
    dayOfWeek: 'thu',
    kind: '교식',
  };
  foodParser.cafeteria(option)
    .then(console.log);

  option = {
    date: '2017-11-04',
    kind: '기식',
  };
  foodParser.cafeteria(option)
    .then(console.log);

  option = {
    dayOfWeek: 'thu', // 작동안함
    kind: '기식',
  };
  foodParser.cafeteria(option)
    .then(console.log);
}

test();
