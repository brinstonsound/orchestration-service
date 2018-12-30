'use esversion: 6';
/*
 * Sound categories are just a simple list of strings.  They will be stored in a single
 * file called ./data/soundCategories.json
 */

const config = require('../../../src/lib/config');
const logger = require('../../../src/lib/logger');
const log = logger(config.logger);
const soundCategoriesFile = './data/soundCategories.json';
const className = 'services/soundCategories'
let lstCategories
loadCategories()

function loadCategories () {
  log.debug('Loading Sound Categories from disk...')
  const fs = require('fs');
  if (fs.existsSync(soundCategoriesFile)) {
    lstCategories = JSON.parse(fs.readFileSync(soundCategoriesFile));
  } else {
    log.debug(`ERROR: Sound categories file not found at ${soundCategoriesFile}`)
  }
}

function saveCategories () {
  const fs = require('fs');
  fs.writeFileSync(soundCategoriesFile, JSON.stringify(lstCategories));
}

/**
 * @param {Object} options
 * @throws {Error}
 * @return {Promise}
 */
module.exports.findSoundCategories = async () => {
  try {
    return {
      status: 200,
      data: lstCategories
    };
  } catch (err) {
    log.error(`${className}:findSoundCategories: ${err.message}`)
    return {
      status: 500,
      data: err.message
    };
  }
};

/**
 * @param {Object} options
 * @param {} options.body
 * @throws {Error}
 * @return {Promise}
 */
module.exports.createSoundCategory = async options => {
  try {
    log.debug(options);
    const d = new Date();
    const newId = d.getTime();
    const newCat = {
      id: newId,
      name: options.body.name,
      parentId: options.body.parentId
    };
    lstCategories.push(newCat);
    saveCategories();
    return {
      status: 201,
      data: newCat
    };
  } catch (err) {
    log.error(`${className}:createSoundCategory: ${err.message}`)
    return {
      status: 500,
      data: err.message
    };
  }
};

/**
 * @param {Object} options
 * @throws {Error}
 * @return {Promise}
 */
module.exports.getSoundCategory = async options => {
  try {
    // Look for the category in the array
    const result = lstCategories.find(obj => {
      return obj.id == options.id;
    });
    let response;
    if (result) {
      response = {
        status: 200,
        data: result
      };
    } else {
      response = {
        status: 404,
        data: 'Item not found'
      };
    }
    return response;
  } catch (err) {
    log.error(`${className}:getSoundCategory: ${err.message}`)
    return {
      status: 500,
      data: err.message
    };
  }
};

/**
 * @param {Object} options
 * @throws {Error}
 * @return {Promise}
 */
module.exports.getSoundcategorySounds = async options => {
  try {
    // Look for the category in the array
    const cat = lstCategories.find(obj => {
      return obj.id == options.id;
    });
    let response
    let categorySounds = [];
    if (cat) {
      // Found the category. Now get its sounds
      const cSounds = require('./sounds')
      // Look for sounds with this categroy id in their list of categories
      categorySounds = cSounds.lstSounds.filter(obj => {
        return obj.soundCategories.find(obj2 => {
          log.debug(`Obj2: ${obj2} cat.id: ${cat.id} Match:${obj2 == cat.id}`)
          return obj2 == cat.id
        })
      });
      response = {
        status: 200,
        data: categorySounds
      };
    } else {
      response = {
        status: 404,
        data: 'Item not found'
      };
    }
    return response;
  } catch (err) {
    log.error(`${className}:getSoundcategorySounds: ${err.message}`)
    return {
      status: 500,
      data: err.message
    };
  }
};
/**
 * @param {Object} options
 * @param {} options.body
 * @throws {Error}
 * @return {Promise}
 */
module.exports.updateSoundCategory = async options => {
  try {
    // Look for the category in the array
    const category = lstCategories.find(obj => {
      return obj.id == options.id;
    });
    let response;
    if (category) {
      //  Update the object with new data
      category.name = options.body.name;
      category.parentId = options.body.parentId;
      // Save the array
      saveCategories();
      response = {
        status: 200,
        data: category
      };
    } else {
      response = {
        status: 404,
        data: 'Item not found'
      };
    }
    return response;
  } catch (err) {
    log.error(`${className}:updateSoundCategory: ${err.message}`)
    return {
      status: 500,
      data: err.message
    };
  }
};

/**
 * @param {Object} options
 * @throws {Error}
 * @return {Promise}
 */
module.exports.deleteSoundCategory = async options => {
  try {
    let response;
    const category = lstCategories.find(obj => {
      return obj.id == options.id;
    });
    if (category) {
      // Remove the item from lstCategories
      lstCategories = lstCategories.filter(item => item.id != options.id);
      saveCategories()
      response = {
        status: 200
      };
    } else {
      response = {
        status: 404
      };
    }
    return response;
  } catch (err) {
    log.error(`${className}:deleteSoundCategory: ${err.message}`)
    return {
      status: 500,
      data: err.message
    };
  }
};
