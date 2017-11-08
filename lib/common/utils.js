'use strict';

function formatUnicorn() {
  // Python3 의 str.format() 메소드와 유사한 기능을 하는 메소드를 추가한다
  /*
   usage example: "Hello, {name}, are you feeling {adjective}?"
   .formatUnicorn({name:"Gabriel", adjective: "OK"});
   */
  let str = this.toString();
  if (arguments.length) {
    const t = typeof arguments[0];
    let key;
    const args = (t === 'string' || t === 'number') ?
      Array.prototype.slice.call(arguments)
      : arguments[0];

    for (key in args) {
      str = str.replace(new RegExp('\\{' + key + '\\}', 'gi'), args[key]);
    }
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

