const formData = require('express-form-data');
const express = require('express');
const os = require('os');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const config = require('../lib/config');
const logger = require('../lib/logger');

/**
 * Start ambient orchestrations
 */
const orchestrationService = require('./services/orchestrations')
const appSettings = require('./services/appSettings')
if (appSettings.getSetting('playAmbientSounds') == true) {
  orchestrationService.startAmbient()
}

// Set up Express
const log = logger(config.logger);
const app = express();

/**
 * Options are the same as multiparty takes.
 * But there is a new option "autoClean" to clean all files in "uploadDir" folder after the response.
 * By default, it is "false".
 */
const options = {
  uploadDir: os.tmpdir(),
  autoClean: true
};
// parse data with connect-multiparty.
app.use(formData.parse(options));
// clear from the request and delete all empty files (size == 0)
app.use(formData.format());
// change file objects to stream.Readable
app.use(formData.stream());
// union body and files
app.use(formData.union());

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());

/*
 * Routes
 */
app.use('/orchestrations', require('./routes/orchestrations'));
app.use('/actions', require('./routes/actions'));
app.use('/symphonies', require('./routes/symphonies'));
app.use('/sounds', require('./routes/sounds'));
app.use('/triggers', require('./routes/triggers'));
app.use('/soundcategories', require('./routes/soundcategories'));
app.use('/players', require('./routes/players'));
app.use('/statusLogs', require('./routes/statusLogs'));
app.use('/settings', require('./routes/settings'));

// catch 404
app.use((req, res, next) => {
  log.error(`Error 404 on ${req.url}.`);
  res.status(404).send({
    status: 404,
    error: 'Not found'
  });
});

// catch errors
app.use((err, req, res, next) => {
  const status = err.status || 500;
  log.error(`Error ${status} (${err.message}) on ${req.method} ${req.url} with payload ${req.body}.`);
  res.status(status).send({
    status,
    error: 'Server error'
  });
});

module.exports = app;
