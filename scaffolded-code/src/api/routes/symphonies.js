const express = require('express');
const symphonies = require('../services/symphonies');

const router = new express.Router();

/**
 * List all Symphonies
 */
router.get('/', async (req, res, next) => {
  const options = {
  };

  try {
    const result = await symphonies.findSymphonies(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    return res.status(500).send({
      status: 500,
      error: 'Server Error'
    });
  }
});

/**
 * Create Symphony
 */
router.post('/', async (req, res, next) => {
  const options = {
    body: req.body.body
  };

  try {
    const result = await symphonies.createSymphony(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    return res.status(500).send({
      status: 500,
      error: 'Server Error'
    });
  }
});

/**
 * Get Symphony
 */
router.get('/:symphonyId', async (req, res, next) => {
  const options = {
  };

  try {
    const result = await symphonies.getSymphony(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    return res.status(500).send({
      status: 500,
      error: 'Server Error'
    });
  }
});

/**
 * Update Symphony
 */
router.put('/:symphonyId', async (req, res, next) => {
  const options = {
    body: req.body.body
  };

  try {
    const result = await symphonies.updateSymphony(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    return res.status(500).send({
      status: 500,
      error: 'Server Error'
    });
  }
});

/**
 * Delete Symphony
 */
router.delete('/:symphonyId', async (req, res, next) => {
  const options = {
  };

  try {
    const result = await symphonies.deleteSymphony(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    return res.status(500).send({
      status: 500,
      error: 'Server Error'
    });
  }
});

module.exports = router;
