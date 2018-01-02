const sandCastle = require('../../index');
const {myLogger} = require('./myUtils');

(function test() {
  const option = {
    dayOfWeek: sandCastle.Cafeteria.DayOfWeek.TUE,
    kind: sandCastle.Cafeteria.Kind.STUDENT,
  };
  sandCastle.cafeteria(option)
    .then(myLogger)
    .catch(myLogger);
}());

