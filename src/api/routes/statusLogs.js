const express = require('express');
const status = require('../services/statusLogs');

const router = new express.Router();

/**
 * Get current status
 */
router.get ('/', async (req, res, next) => {
  try {
    const result = await status.getCurrentStatus();
    res.status(result.status || 200).send(result.data);
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
router.post ('/logs', async (req, res, next) => {
  const options = {
    body: req.body
  };
  try {
    const result = await status.postLog(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    return res.status(err.status).send({
      status: err.status,
      error: err.error
    });
  }
});

/**
 * Retrieve the 'log window'
 */
router.get ('/logs', async (req, res, next) => {
  try {
    const result = await status.getlogWindow();
    res.status(result.status || 200).send(result);
  } catch (err) {
    return res.status(err.status).send({
      status: err.status,
      error: err.error
    });
  }
});

module.exports = router;
