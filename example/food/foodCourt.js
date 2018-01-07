const sandCastle = require('../../index');
const {myLogger} = require('./myUtils');

(function test() {
  // BUG!!!
  const option = {
    dayOfWeek: sandCastle.Cafeteria.DayOfWeek.TUE,
    kind: sandCastle.Cafeteria.Kind.FOOD_COURT,
  };
  sandCastle.cafeteria(option)
    .then(myLogger)
    .catch(myLogger);
}());
