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
    return res.status(500).send({
      status: 500,
      error: 'Server Error'
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
    return res.status(500).send({
      status: 500,
      error: 'Server Error'
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
    return res.status(500).send({
      status: 500,
      error: 'Server Error'
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
    return res.status(500).send({
      status: 500,
      error: 'Server Error'
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
    return res.status(500).send({
      status: 500,
      error: 'Server Error'
    });
  }
});

module.exports = router;
