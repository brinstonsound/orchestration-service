const express = require('express');
const sounds = require('../services/sounds');

const router = new express.Router();

/**
 * List all Sounds
 */
router.get('/', async (req, res, next) => {
  const options = {
  };

  try {
    const result = await sounds.findSounds(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    return res.status(500).send({
      status: 500,
      error: 'Server Error'
    });
  }
});

/**
 * Create Sound
 */
router.post('/', async (req, res, next) => {
  const options = {
    body: req.body.body
  };

  try {
    const result = await sounds.createSound(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    return res.status(500).send({
      status: 500,
      error: 'Server Error'
    });
  }
});

/**
 * Get Sound
 */
router.get('/:soundId', async (req, res, next) => {
  const options = {
  };

  try {
    const result = await sounds.getSound(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    return res.status(500).send({
      status: 500,
      error: 'Server Error'
    });
  }
});

/**
 * Update Sound
 */
router.put('/:soundId', async (req, res, next) => {
  const options = {
    body: req.body.body
  };

  try {
    const result = await sounds.updateSound(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    return res.status(500).send({
      status: 500,
      error: 'Server Error'
    });
  }
});

/**
 * Delete Sound
 */
router.delete('/:soundId', async (req, res, next) => {
  const options = {
  };

  try {
    const result = await sounds.deleteSound(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    return res.status(500).send({
      status: 500,
      error: 'Server Error'
    });
  }
});

module.exports = router;
