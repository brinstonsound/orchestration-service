const bunyanLogger = require('./logger')
const config = require('./config')
const appSettings = require('../api/services/appSettings')
const statusLogs = require('../api/services/statusLogs')
const axios = require('axios')

const log = bunyanLogger(config.logger)
// module.exports = config => {
//   return bunyanLogger(config)
// }

module.exports.trace = message => {

  // Post the log entry to the logwindow
  statusLogs.postLog(message)

  log.trace(message)
}
module.exports.debug = message => {
  //log.debug(`Intercepted! ${message}`)

  // Post the log entry to the logwindow
  statusLogs.postLog(message)

  log.debug(message)
}
module.exports.info = message => {
  //log.info(`Intercepted! ${message}`)

  // Post the log entry to the logwindow
  statusLogs.postLog(message)

  log.info(message)
}
module.exports.warn = message => {
  //log.warn(`Intercepted! ${message}`)

  // Post the log entry to the logwindow
  statusLogs.postLog(message)

  log.warn(message)
}
module.exports.error = message => {
  //log.error(`Intercepted! ${message}`)
  // Say the error
  axios.post(
    `${appSettings.getSetting('soundServerURL')}/say`, {
      text: message
    }
  )
  // Post the log entry to the logwindow
  statusLogs.postLog(message)

  // Pass the message along to the bunyan logger
  log.error(message)
}
module.exports.fatal = message => {
  //log.fatal(`Intercepted! ${message}`)
  log.fatal(message)
}
