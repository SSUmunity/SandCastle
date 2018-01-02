const util = require('util');

const myLogger = (res) => {
  console.log(util.inspect(res, {showHidden: false, depth: null}));
};

exports.myLogger = myLogger;
