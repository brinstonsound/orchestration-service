const express = require('express');
const actions = require('../services/actions');

const router = new express.Router();

/**
 * List Action
 */
router.get('/', async (req, res, next) => {
  const options = {};

  try {
    const result = await actions.findActions(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    return res.status(err.status).send({
      status: err.status,
      error: err.error
    });
  }
});

/**
 * Create Action
 */
router.post('/', async (req, res, next) => {
  const options = {
    body: req.body
  };

  try {
    const result = await actions.createAction(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    return res.status(err.status).send({
      status: err.status,
      error: err.error
    });
  }
});

/**
 * Get Action
 */
router.get('/:actionId', async (req, res, next) => {
  const options = {
    id: req.params.actionId,
  };

  try {
    const result = await actions.getAction(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    return res.status(err.status).send({
      status: err.status,
      error: err.error
    });
  }
});

/**
 * Update Action
 */
router.put('/:actionId', async (req, res, next) => {
  const options = {
    id: req.params.actionId,
    body: req.body
  };

  try {
    const result = await actions.updateAction(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    return res.status(err.status).send({
      status: err.status,
      error: err.error
    });
  }
});

/**
 * Delete Action
 */
router.delete('/:actionId', async (req, res, next) => {
  const options = {
    id: req.params.actionId,
  };

  try {
    const result = await actions.deleteAction(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    return res.status(err.status).send({
      status: err.status,
      error: err.error
    });
  }
});

module.exports = router;
