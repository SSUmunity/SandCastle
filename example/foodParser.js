'use strict';

const sandCastle = require('../index');

const foodParser = sandCastle.food;
(function test() {
  foodParser.getFacultyJson()
    .then(console.log)
    .catch(console.log);
  foodParser.getPupilJson()
    .then(console.log)
    .catch(console.log);
  foodParser.getDormJson()
    .then(console.log)
    .catch(console.log);
})();
