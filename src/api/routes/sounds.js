const express = require('express');
const sounds = require('../services/sounds');
// const config = require('../../../src/lib/config');
// const logger = require('../../../src/lib/logger');
// const log = logger(config.logger);

const router = new express.Router();

/**
 * List all Sounds
 */
router.get ('/', async (req, res, next) => {
  try {
    const result = await sounds.findSounds();
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    return res.status(err.status).send({
      status: err.status,
      error: err.error
    });
  }
});

/**
 * Create Sound
 */
router.post('/', async (req, res, next) => {
  const options = {
    body: req.body
  };

  try {
    const result = await sounds.createSound(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    return res.status(err.status).send({
      status: err.status,
      error: err.error
    });
  }
});

/**
 * Get Sound
 */
router.get('/:soundId', async (req, res, next) => {
  const options = {
    id: req.params.soundId
  };

  try {
    const result = await sounds.getSound(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    return res.status(err.status).send({
      status: err.status,
      error: err.error
    });
  }
});

/**
 * Update Sound
 */
router.put('/:soundId', async (req, res, next) => {
  const options = {
    id: req.params.soundId,
    body: req.body
  };

  try {
    const result = await sounds.updateSound(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    return res.status(err.status).send({
      status: err.status,
      error: err.error
    });
  }
});

/**
 * Delete Sound
 */
router.delete('/:soundId', async (req, res, next) => {
  const options = {
    id: req.params.soundId
  };

  try {
    const result = await sounds.deleteSound(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    return res.status(err.status).send({
      status: err.status,
      error: err.error
    });
  }
});

module.exports = router;
