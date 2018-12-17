const express = require('express');
const actions = require('../services/actions');

const router = new express.Router();

/**
 * List Action
 */
router.get('/', async (req, res, next) => {
  const options = {
  };

  try {
    const result = await actions.findActions(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    return res.status(500).send({
      status: 500,
      error: 'Server Error'
    });
  }
});

/**
 * Create Action
 */
router.post('/', async (req, res, next) => {
  const options = {
    body: req.body.body
  };

  try {
    const result = await actions.createAction(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    return res.status(500).send({
      status: 500,
      error: 'Server Error'
    });
  }
});

/**
 * Get Action
 */
router.get('/:actionId', async (req, res, next) => {
  const options = {
  };

  try {
    const result = await actions.getAction(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    return res.status(500).send({
      status: 500,
      error: 'Server Error'
    });
  }
});

/**
 * Update Action
 */
router.put('/:actionId', async (req, res, next) => {
  const options = {
    body: req.body.body
  };

  try {
    const result = await actions.updateAction(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    return res.status(500).send({
      status: 500,
      error: 'Server Error'
    });
  }
});

/**
 * Delete Action
 */
router.delete('/:actionId', async (req, res, next) => {
  const options = {
  };

  try {
    const result = await actions.deleteAction(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    return res.status(500).send({
      status: 500,
      error: 'Server Error'
    });
  }
});

module.exports = router;
