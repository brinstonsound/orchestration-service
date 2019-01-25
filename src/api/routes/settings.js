const express = require('express');
const appSettings = require('../services/appSettings');

const router = new express.Router();

/**
 * Get a setting value
 */
router.get ('/:setting', async (req, res, next) => {
  try {
    const result = await appSettings.getSetting(req.params.setting);
    res.status(200).send(result);
  } catch (err) {
    return res.status(err.status).send({
      status: err.status,
      error: err.error
    });
  }
});

/**
 * Post a log entry to the 'log window'
 */
router.put ('/:setting', async (req, res, next) => {
  try {
    appSettings.updateSetting(req.body.settingName, req.body.newValue);
    res.status(200).send();
  } catch (err) {
    return res.status(err.status).send({
      status: err.status,
      error: err.error
    });
  }
});

module.exports = router;
