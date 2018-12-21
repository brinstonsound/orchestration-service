'use esversion: 6';
/*
 * Sound categories are just a simple list of strings.  They will be stored in a single
 * file called ./data/soundCategories.json
 */

const soundCategoriesFile = "./data/soundCategories.json";
let lstCategories
loadCategories()

function loadCategories() {
  console.log('Loading Sound Categories from disk...')
  const fs = require("fs");
  lstCategories = JSON.parse(fs.readFileSync(soundCategoriesFile));
}

function saveCategories() {
  const fs = require("fs");
  fs.writeFileSync(soundCategoriesFile, JSON.stringify(lstCategories));
}

/**
 * @param {Object} options
 * @throws {Error}
 * @return {Promise}
 */
module.exports.findSoundCategories = async options => {
  try {
    return {
      status: 200,
      data: lstCategories
    };
  } catch (err) {
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
    console.log(options);
    let d = new Date();
    let newId = d.getTime();
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
      categorySounds = cSounds.lstSounds.filter(obj => {
        console.log(`Obj soundCategoryId: ${obj.soundCategoryId} cat.id: ${cat.id} Match:${obj.soundCategoryId == cat.id}`)
        return obj.soundCategoryId == cat.id;
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
    return {
      status: 500,
      data: err.message
    };
  }
};
