const express = require('express');
const triggers = require('../services/triggers');

const router = new express.Router();

/**
 * List all Triggers
 */
router.get('/', async (req, res, next) => {
  try {
    const result = await triggers.findTriggers();
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    return res.status(err.status).send({
      status: err.status,
      error: err.error
    });
  }
});

/**
 * Create Trigger
 */
router.post('/', async (req, res, next) => {
  const options = {
    body: req.body
  };

  try {
    const result = await triggers.createTrigger(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    return res.status(err.status).send({
      status: err.status,
      error: err.error
    });
  }
});

/**
 * Get Trigger
 */
router.get('/:triggerId', async (req, res, next) => {
  const options = {
    id: req.params.triggerId
  };

  try {
    const result = await triggers.getTrigger(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    return res.status(err.status).send({
      status: err.status,
      error: err.error
    });
  }
});

/**
 * Update Trigger
 */
router.put('/:triggerId', async (req, res, next) => {
  const options = {
    id: req.params.triggerId,
    body: req.body
  };

  try {
    const result = await triggers.updateTrigger(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    return res.status(err.status).send({
      status: err.status,
      error: err.error
    });
  }
});

/**
 * Delete Trigger
 */
router.delete('/:triggerId', async (req, res, next) => {
  const options = {
    id: req.params.triggerId
  };

  try {
    const result = await triggers.deleteTrigger(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    return res.status(err.status).send({
      status: err.status,
      error: err.error
    });
  }
});

/**
 * When a trigger is fired, the orchestration API will look up
 * all orchestrations that are associated with it and execute
 * them.
 */
router.post('/:triggerId/fire', async (req, res, next) => {
  const options = {    id: req.params.triggerId
  };

  try {
    const result = await triggers.fire(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    return res.status(err.status).send({
      status: err.status,
      error: err.error
    });
  }
});

module.exports = router;
