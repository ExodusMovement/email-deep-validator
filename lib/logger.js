const logger = require('loglevel');

let logLevel = logger.levels.INFO;

if (process.env.LOGGER_LEVEL) {
  const logLevelMap = {
    "trace": logger.levels.TRACE,
    "debug": logger.levels.DEBUG,
    "info": logger.levels.INFO,
    "warn": logger.levels.WARN,
    "error": logger.levels.ERROR,
  };
  logLevel = logLevelMap[process.env.LOGGER_LEVEL.toLowerCase()];
}

logger.setDefaultLevel(logLevel);

module.exports = logger;
