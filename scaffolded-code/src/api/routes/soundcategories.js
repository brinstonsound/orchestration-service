const express = require('express');
const soundcategories = require('../services/soundcategories');

const router = new express.Router();

/**
 * List all Sound Categories
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
 * Create Sound Category
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
 * Get a Sound Category
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
 * Update a Sound Category
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
 * Delete a Sound Category
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

/**
 * List a category's sounds
 */
router.get('/:soundCategoryId/sounds', async (req, res, next) => {
  const options = {
  };

  try {
    const result = await soundcategories.getSoundcategoriesBySoundCategoryIdSounds(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    return res.status(err.status).send({
      status: err.status,
      error: err.error
    });
  }
});

module.exports = router;
