const express = require('express');
const orchestrations = require('../services/orchestrations');

const router = new express.Router();

/**
 * List Orchestration
 */
router.get('/', async (req, res, next) => {
  try {
    const result = await orchestrations.findOrchestrations();
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    return res.status(err.status).send({
      status: err.status,
      error: err.error
    });
  }
});

/**
 * Create Orchestration
 */
router.post('/', async (req, res, next) => {
  const options = {
    body: req.body
  };

  try {
    const result = await orchestrations.createOrchestration(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    return res.status(err.status).send({
      status: err.status,
      error: err.error
    });
  }
});

/**
 * Get Orchestration
 */
router.get('/:orchestrationId', async (req, res, next) => {
  const options = {
    id: req.params.orchestrationId
  };

  try {
    const result = await orchestrations.getOrchestration(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    return res.status(err.status).send({
      status: err.status,
      error: err.error
    });
  }
});

/**
 * Update Orchestration
 */
router.put('/:orchestrationId', async (req, res, next) => {
  const options = {
    id: req.params.orchestrationId,
    body: req.body
  };

  try {
    const result = await orchestrations.updateOrchestration(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    return res.status(err.status).send({
      status: err.status,
      error: err.error
    });
  }
});

/**
 * Delete Orchestration
 */
router.delete('/:orchestrationId', async (req, res, next) => {
  const options = {
    id: req.params.orchestrationId
  };

  try {
    const result = await orchestrations.deleteOrchestration(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    return res.status(err.status).send({
      status: err.status,
      error: err.error
    });
  }
});

/**
 * Execute the orchestration
 */
router.post('/:orchestrationId/execute', async (req, res, next) => {
  const options = {
    id: req.params.orchestrationId
  };

  try {
    const result = await orchestrations.execute(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    return res.status(err.status).send({
      status: err.status,
      error: err.error
    });
  }
});

module.exports = router;
