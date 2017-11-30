'use strict';

const urls = require('../common/baseUrl');
const {BaseError} = require('../common/errors.js');

class SsuDormConnectionError extends BaseError {
  constructor(message) {
    super(message || `Cannot Connect to Server ${urls.SSU_DORM_URL}`);
  }
}

class SoongguriJsonConnectionError extends BaseError {
  constructor(message) {
    super(message || `Cannot Connect to Server ${urls.SOONGGURI_JSON}`);
  }
}

class SoongguriDesktopConnectionError extends BaseError {
  constructor(message) {
    super(message || `Cannot Connect to Server ${urls.SOONGGURI_DESKTOP_URL}`);
  }
}

class UnexpectedParameterDayOfWeek extends BaseError {
  constructor(message) {
    super(`dayOfWeek parameter must be [sun, mon, ..., sat] or [0, 1, ... 6] but ${message} token`);
  }
}

class UnexpectedParameterDate extends BaseError {
  constructor(message) {
    super(`date parameter must satisfy 'YEAR-MONTH-DATE' or 'MONTH/DATE/YEAR' form but ${message} token`);
  }
}

module.exports = {
  SsuDormConnectionError,
  SoongguriJsonConnectionError,
  SoongguriDesktopConnectionError,
  UnexpectedParameterDayOfWeek,
  UnexpectedParameterDate,
};
