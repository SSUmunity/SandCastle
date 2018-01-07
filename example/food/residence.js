const sandCastle = require('../../index');
const {myLogger} = require('./myUtils');

(function test() {
  const option = {
    date: '2017-11-30',
    kind: sandCastle.Cafeteria.Kind.RESIDENCE,
  };
  sandCastle.cafeteria(option)
    .then(myLogger)
    .catch(myLogger);
}());

(function test() {
  const option = {
    dayOfWeek: sandCastle.Cafeteria.DayOfWeek.TUE,
    kind: sandCastle.Cafeteria.Kind.RESIDENCE,
  };
  sandCastle.cafeteria(option)
    .then(myLogger)
    .catch(myLogger);
}());
