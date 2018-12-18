const express = require('express');
const soundcategories = require('../services/soundcategories');

const router = new express.Router();

/**
 * List SoundCategory
 */
router.get('/', async (req, res, next) => {
  const options = {
  };

  try {
    const result = await soundcategories.findSoundCategories(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    return res.status(err.status).send({
      status: err.status,
      error: err.error
    });
  }
});

/**
 * Create SoundCategory
 */
router.post('/', async (req, res, next) => {
  const options = {
    body: req.body.body
  };

  try {
    const result = await soundcategories.createSoundCategory(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    return res.status(err.status).send({
      status: err.status,
      error: err.error
    });
  }
});

/**
 * Get SoundCategory
 */
router.get('/:soundCategoryId', async (req, res, next) => {
  const options = {
  };

  try {
    const result = await soundcategories.getSoundCategory(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    return res.status(err.status).send({
      status: err.status,
      error: err.error
    });
  }
});

/**
 * Update SoundCategory
 */
router.put('/:soundCategoryId', async (req, res, next) => {
  const options = {
    body: req.body.body
  };

  try {
    const result = await soundcategories.updateSoundCategory(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    return res.status(err.status).send({
      status: err.status,
      error: err.error
    });
  }
});

/**
 * Delete SoundCategory
 */
router.delete('/:soundCategoryId', async (req, res, next) => {
  const options = {
  };

  try {
    const result = await soundcategories.deleteSoundCategory(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    return res.status(err.status).send({
      status: err.status,
      error: err.error
    });
  }
});

module.exports = router;
