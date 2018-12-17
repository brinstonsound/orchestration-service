const express = require('express');
const orchestrations = require('../services/orchestrations');

const router = new express.Router();

/**
 * List Orchestration
 */
router.get('/', async (req, res, next) => {
  const options = {
  };

  try {
    const result = await orchestrations.findOrchestrations(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    return res.status(500).send({
      status: 500,
      error: 'Server Error'
    });
  }
});

/**
 * Create Orchestration
 */
router.post('/', async (req, res, next) => {
  const options = {
    body: req.body.body
  };

  try {
    const result = await orchestrations.createOrchestration(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    return res.status(500).send({
      status: 500,
      error: 'Server Error'
    });
  }
});

/**
 * Get Orchestration
 */
router.get('/:orchestrationId', async (req, res, next) => {
  const options = {
  };

  try {
    const result = await orchestrations.getOrchestration(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    return res.status(500).send({
      status: 500,
      error: 'Server Error'
    });
  }
});

/**
 * Update Orchestration
 */
router.put('/:orchestrationId', async (req, res, next) => {
  const options = {
    body: req.body.body
  };

  try {
    const result = await orchestrations.updateOrchestration(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    return res.status(500).send({
      status: 500,
      error: 'Server Error'
    });
  }
});

/**
 * Delete Orchestration
 */
router.delete('/:orchestrationId', async (req, res, next) => {
  const options = {
  };

  try {
    const result = await orchestrations.deleteOrchestration(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    return res.status(500).send({
      status: 500,
      error: 'Server Error'
    });
  }
});

/**
 * Execute the orchestration
 */
router.post('/:orchestrationId/execute', async (req, res, next) => {
  const options = {
  };

  try {
    const result = await orchestrations.postOrchestrationsByOrchestrationIdExecute(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    return res.status(500).send({
      status: 500,
      error: 'Server Error'
    });
  }
});

module.exports = router;
