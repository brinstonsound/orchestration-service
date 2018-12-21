'use esversion: 6';
let lstSounds;
const soundsFolder = './data/sounds/';
const fs = require('fs');
const path = require('path');

function loadSoundList() {
  console.log('Loading all sounds from disk...')
  const soundFiles = fs.readdirSync(soundsFolder);
  lstSounds = [];
  soundFiles.forEach(file => {
    lstSounds.push(JSON.parse(fs.readFileSync(path.resolve(soundsFolder, file))));
  });
}

/**
 * @throws {Error}
 * @return {Promise}
 */
module.exports.findSounds = async () => {
  // List all sounds.
  try {
    if (lstSounds === undefined) loadSoundList();

    return {
      status: 200,
      data: lstSounds
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
module.exports.createSound = async (options) => {
  try {
    if (lstSounds === undefined) loadSoundList();
    // Check that the payload has all required elements
    if (options.body.name == undefined) return {
      status: 400,
      data: 'Required element <name> is missing.'
    };
    if (options.body.fileName == undefined) return {
      status: 400,
      data: 'Required element <fileName> is missing.'
    };
    const d = new Date();
    const newId = d.getTime();
    const newSound = {
      id: newId,
      name: options.body.name,
      soundCategoryId: options.body.soundCategoryId,
      fileName: options.body.fileName
    }
    // Save the new sound to disk
    fs.writeFileSync(path.resolve(soundsFolder, `${newId.toString()}.json`), JSON.stringify(newSound, null, 4));
    // Save the new sound to the collection
    lstSounds.push(newSound);
    return {
      status: 201,
      data: newSound
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
module.exports.getSound = async (options) => {
  try {
    if (lstSounds === undefined) loadSoundList();
    // Look for the category in the array
    const result = lstSounds.find(obj => {
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
module.exports.updateSound = async (options) => {
  try {
    if (lstSounds === undefined) loadSoundList();
    // Check that the payload has all required elements
    if (options.body.name == undefined) return {
      status: 400,
      data: 'Required element <name> is missing.'
    };
    if (options.body.fileName == undefined) return {
      status: 400,
      data: 'Required element <fileName> is missing.'
    };
    // Find the sound in the collection
    let theSound = this.getSound(options.id)
    if (theSound) {
      theSound = options.body
      console.log(JSON.stringify(theSound, null, 4))
      fs.writeFileSync(path.resolve(soundsFolder, `${options.id.toString()}.json`), JSON.stringify(theSound, null, 4));
      return {
        status: 200,
        data: theSound
      };
    }
    return {
      status: 404,
      data: 'Item not found'
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
module.exports.deleteSound = async (options) => {
  try {
    if (lstSounds === undefined) loadSoundList();
    const theSound = this.getSound(options.id)
    if (theSound) {
      // Found it. Kill it.
      throw new Error('This filter function is not working.')
      fs.unlinkSync(path.resolve(soundsFolder, `${options.id.toString()}.json`))
      lstSounds = lstSounds.filter((obj) => {
        return obj.id !== options.id;
      });
      return {
        status: 200
      };
    }
    return {
      status: 404,
      data: 'Item not found'
    };
  } catch (err) {
    return {
      status: 500,
      data: err.message
    };
  }
};
