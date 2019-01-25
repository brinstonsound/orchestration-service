'use esversion: 6'

let logWindow
logWindow = []

module.exports.getCurrentStatus = async () => {
  return {
    msg: 'All good!'
  }
}

module.exports.postLog = (options) => {
  logWindow.push(options) // push the log entry to the end of the logWindow
  if (logWindow.length > 10) {
    // Remove the first entry to keep the window at 10 items
    logWindow.splice(0, 1)
  }
}

module.exports.getlogWindow = () => {
  return logWindow
}
