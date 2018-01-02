const sandCastle = require('../../index');
const {myLogger} = require('./myUtils');

(function test() {
  const option = {
    dayOfWeek: sandCastle.Cafeteria.DayOfWeek.THU,
    kind: sandCastle.Cafeteria.Kind.OFFICER,
  };
  sandCastle.cafeteria(option)
    .then(myLogger)
    .catch(myLogger);
}());

