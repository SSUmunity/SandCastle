'use strict';

function formatUnicorn(...args) {
  // Python3 의 str.format() 메소드와 유사한 기능을 하는 메소드를 추가한다
  /*
   usage example: "Hello, {name}, are you feeling {adjective}?"
   .formatUnicorn({name:"Gabriel", adjective: "OK"});
   */
  let str = this.toString();
  if (args.length) {
    const t = typeof args[0];
    const localArgs = (t === 'string' || t === 'number') ?
      Array.prototype.slice.call(args)
      : args[0];

    Object.keys(localArgs).forEach((key) => {
      str = str.replace(new RegExp(`\\{${key}\\}`, 'gi'), localArgs[key]);
    });
  }

  return str;
}

function loadFormatUnicorn() {
  if (!String.prototype.formatUnicorn) {
    String.prototype.formatUnicorn = String.prototype.formatUnicorn ||
      formatUnicorn;
  }
}

module.exports = {
  formatUnicorn,
  loadFormatUnicorn,
};

