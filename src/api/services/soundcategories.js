'use esversion: 6';
/*
 * Sound categories are just a simple list of strings.  They will be stored in a single
 * file called ./data/soundCategories.json
 */

let lstCategories;

const soundCategoriesFile = "./data/soundCategories.json";

function loadCategories() {
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
    if (lstCategories === undefined) {
      // lstCategories is not initialized.  Load up the list from the file.
      loadCategories();
    }
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
    if (lstCategories === undefined) {
      // lstCategories is not initialized.  Load up the list from the file.
      loadCategories();
    }
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
    if (lstCategories === undefined) {
      // lstCategories is not initialized.  Load up the list from the file.
      loadCategories();
    }
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
 * @param {} options.body
 * @throws {Error}
 * @return {Promise}
 */
module.exports.updateSoundCategory = async options => {
  try {
    if (lstCategories === undefined) {
      // lstCategories is not initialized.  Load up the list from the file.
      loadCategories();
    }
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
    if (lstCategories === undefined) {
      // lstCategories is not initialized.  Load up the list from the file.
      loadCategories();
    }
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
