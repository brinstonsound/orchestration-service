const express = require('express');
const players = require('../services/players');

const router = new express.Router();

/**
 * List Player
 */
router.get('/', async (req, res, next) => {
  const options = {
  };

  try {
    const result = await players.findPlayers(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    return res.status(err.status).send({
      status: err.status,
      error: err.error
    });
  }
});

/**
 * Create Player
 */
router.post('/', async (req, res, next) => {
  const options = {
    body: req.body.body
  };

  try {
    const result = await players.createPlayer(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    return res.status(err.status).send({
      status: err.status,
      error: err.error
    });
  }
});

/**
 * Get Player
 */
router.get('/:playerId', async (req, res, next) => {
  const options = {
  };

  try {
    const result = await players.getPlayer(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    return res.status(err.status).send({
      status: err.status,
      error: err.error
    });
  }
});

/**
 * This operation is called by the sound server when it 
 * finishes playing a sound.
 */
router.delete('/:playerId', async (req, res, next) => {
  const options = {
  };

  try {
    const result = await players.deletePlayer(options);
    res.status(result.status || 200).send(result.data);
  } catch (err) {
    return res.status(err.status).send({
      status: err.status,
      error: err.error
    });
  }
});

module.exports = router;
