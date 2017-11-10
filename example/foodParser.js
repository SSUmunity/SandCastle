'use strict';

const sandCastle = require('../index');

function test() {
  let option = {
    dayOfWeek: 'thu',
    kind: sandCastle.Cafeteria.Kind.STUDENT,
  };
  sandCastle.cafeteria(option)
    .then(console.log);

  option = {
    dayOfWeek: 4,
    kind: sandCastle.Cafeteria.Kind.STUDENT,
  };
  sandCastle.cafeteria(option)
    .then(console.log);

  option = {
    dayOfWeek: sandCastle.Cafeteria.DayOfWeek.THU,
    kind: sandCastle.Cafeteria.Kind.OFFICER,
  };
  sandCastle.cafeteria(option)
    .then(console.log);

  option = {
    date: '2017-11-04',
    kind: sandCastle.Cafeteria.Kind.RESIDENCE,
  };
  sandCastle.cafeteria(option)
    .then(console.log);

  option = {
    dayOfWeek: sandCastle.Cafeteria.DayOfWeek.THU,
    kind: sandCastle.Cafeteria.Kind.RESIDENCE,
  };
  sandCastle.cafeteria(option)
    .then(console.log);

  option = {
    dayOfWeek: sandCastle.Cafeteria.DayOfWeek.THU,
    kind: sandCastle.Cafeteria.Kind.RESIDENCE,
  };
  sandCastle.cafeteria(option)
    .then(console.log);

  option = {
    dayOfWeek: '2016-00', // 작동안함
    kind: sandCastle.Cafeteria.Kind.RESIDENCE,
  };
  sandCastle.cafeteria(option)
    .then(console.log)
    .catch(console.log);
}

test();
