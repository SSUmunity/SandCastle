'use strict';

const urls = require('../common/baseUrl');

class BaseError extends Error {
  constructor(message, status) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
    this.status = status || 500;
  }
}

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
    super(`date parameter must looks like '2017-05-05' but ${message} token`);
  }
}

module.exports = {
  SsuDormConnectionError,
  SoongguriJsonConnectionError,
  SoongguriDesktopConnectionError,
  UnexpectedParameterDayOfWeek,
  UnexpectedParameterDate,
};
