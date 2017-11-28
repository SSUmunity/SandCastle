'use strict';

const sandCastle = require('../index');
const util = require('util');

const myLogger = (res) => {
  console.log(util.inspect(res, {showHidden: false, depth: null}));
};

function test() {
  let option = {
    dayOfWeek: sandCastle.Cafeteria.DayOfWeek.TUE,
    kind: sandCastle.Cafeteria.Kind.STUDENT,
  };
  sandCastle.cafeteria(option)
    .then(myLogger);

  option = {
    dayOfWeek: 2,
    kind: sandCastle.Cafeteria.Kind.STUDENT,
  };
  sandCastle.cafeteria(option)
    .then(myLogger);

  option = {
    dayOfWeek: sandCastle.Cafeteria.DayOfWeek.TUE,
    kind: sandCastle.Cafeteria.Kind.SNACK_CORNER,
  };
  sandCastle.cafeteria(option)
    .then(myLogger);

  option = {
    dayOfWeek: sandCastle.Cafeteria.DayOfWeek.TUE,
    kind: sandCastle.Cafeteria.Kind.FOOD_COURT,
  };
  sandCastle.cafeteria(option)
    .then(myLogger);

  // option = {
  //   dayOfWeek: sandCastle.Cafeteria.DayOfWeek.TUE,
  //   kind: sandCastle.Cafeteria.Kind.OFFICER,
  // };
  // sandCastle.cafeteria(option)
  //   .then(myLogger);
  //
  // option = {
  //   date: '2017-11-14',
  //   kind: sandCastle.Cafeteria.Kind.RESIDENCE,
  // };
  // sandCastle.cafeteria(option)
  //   .then(myLogger);
  //
  // option = {
  //   dayOfWeek: sandCastle.Cafeteria.DayOfWeek.TUE,
  //   kind: sandCastle.Cafeteria.Kind.RESIDENCE,
  // };
  // sandCastle.cafeteria(option)
  //   .then(myLogger);
  //
  // option = {
  //   dayOfWeek: sandCastle.Cafeteria.DayOfWeek.TUE,
  //   kind: sandCastle.Cafeteria.Kind.RESIDENCE,
  // };
  // sandCastle.cafeteria(option)
  //   .then(myLogger);
  //
  // option = {
  //   dayOfWeek: '2016-00', // 작동안함
  //   kind: sandCastle.Cafeteria.Kind.RESIDENCE,
  // };
  // sandCastle.cafeteria(option)
  //   .then(myLogger)
  //   .catch(myLogger);
}

test();
