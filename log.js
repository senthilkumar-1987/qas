const { createLogger, format, transports } = require('winston');

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.errors({ stack: false }),
    format.splat(),
    format.json()
  ),
  defaultMeta: { service: 'SIRIM' },
  transports: [
    //
    // - Write to all logs with level `info` and below to `quick-start-combined.log`.
    // - Write all logs error (and below) to `quick-start-error.log`.
    //
    new transports.File({ filename: 'log/error.log', level: 'error' }),
    new transports.File({ filename: 'log/combined.log' })
  ]
});

//
// If we're not in production then **ALSO** log to the `console`
// with the colorized simple format.
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: format.combine(
      format.colorize(),
      format.simple()
    )
  }));
}

function logError(message){  // thisLine() + ' Error as info'
    logger.error(new Error(message));
}

function logInfo(message, additional){  // 'Use a helper method if you want'
    logger.info({
        message: message,
        additional: additional
    });
}

function thisLine() {
  let e = new Error();
  let regex = /\d+:\d+/i;
  let regex2 = /\((.*):\d+:\d+\)$/
  let match = regex.exec(e.stack.split("\n")[2]);
  let match2 = regex2.exec(e.stack.split("\n")[2]);
  // let filename = match2[1].split('\\')[match2[1].split('\\').length - 1];
  let filename = match2[1].split('/')[match2[1].split('/').length - 1];

  return filename + ':' + match[0].split(':')[0];
}

function thisLine2() {
  let er = new Error();
  let match = er.stack.split("\n")[2];
  let match2 = match.split('at ')[1];
  let filename = match2.split('/')[match2.split('/').length - 1];

  return filename;
}

function thisLineTryCatch(err) {
  // let e = new Error();
  let regex = /\d+:\d+/i;
  let regex2 = /\((.*):\d+:\d+\)$/
  let match = regex.exec(err.stack.split("\n")[1]);
  let match2 = regex2.exec(err.stack.split("\n")[1]);
  // let filename = match2[1].split('\\')[match2[1].split('\\').length - 1];
  let filename = match2[1].split('/')[match2[1].split('/').length - 1];

  return filename + ':' + match[0].split(':')[0];
}

module.exports = {
    logError,
    logInfo,
    thisLine,
    thisLine2,
    thisLineTryCatch
}