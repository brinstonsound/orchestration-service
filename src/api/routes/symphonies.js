const express = require('express');
const symphonies = require('../services/symphonies');

const router = new express.Router();

/**
 * List all Symphonies
 */
router.get('/', async (req, res, next) => {
  try {
    const options = {
      active: req.query.active
    }
    const result = await symphonies.findSymphonies(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    return res.status(err.status).send({
      status: err.status,
      error: err.error
    });
  }
});

/**
 * Create Symphony
 */
router.post('/', async (req, res, next) => {
  const options = {
    body: req.body
  };

  try {
    const result = await symphonies.createSymphony(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    return res.status(err.status).send({
      status: err.status,
      error: err.error
    });
  }
});

/**
 * Get Symphony
 */
router.get('/:symphonyId', async (req, res, next) => {
  const options = {
    id: req.params.symphonyId
  };

  try {
    const result = await symphonies.getSymphony(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    return res.status(err.status).send({
      status: err.status,
      error: err.error
    });
  }
});

/**
 * Update Symphony
 */
router.put('/:symphonyId', async (req, res, next) => {
  const options = {
    id: req.params.symphonyId,
    body: req.body
  };

  try {
    const result = await symphonies.updateSymphony(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    return res.status(err.status).send({
      status: err.status,
      error: err.error
    });
  }
});

/**
 * Delete Symphony
 */
router.delete('/:symphonyId', async (req, res, next) => {
  const options = {
    id: req.params.symphonyId
  };

  try {
    const result = await symphonies.deleteSymphony(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    return res.status(err.status).send({
      status: err.status,
      error: err.error
    });
  }
});

module.exports = router;
