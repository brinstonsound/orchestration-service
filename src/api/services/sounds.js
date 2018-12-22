'use esversion: 6';
const soundsFolder = './data/sounds/';
const fs = require('fs');
const path = require('path');

let lstSounds;
loadSoundList()

function loadSoundList () {
  console.log('Loading all Sounds from disk...')
  const soundFiles = fs.readdirSync(soundsFolder);
  lstSounds = [];
  soundFiles.forEach(file => {
    lstSounds.push(JSON.parse(fs.readFileSync(path.resolve(soundsFolder, file))));
  });
}
module.exports.lstSounds = lstSounds

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
    // Look for the sound in the array
    const result = lstSounds.find(obj => {
      //console.log(`Obj Id: ${obj.id} options.id: ${options.id} Match:${obj.id == options.id}`)
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
    let theSound = await this.getSound(options)
    if (theSound.data.id != undefined) {
      theSound = options.body
      theSound.id = options.id // Just to make sure we update the right object
      // Update the file
      fs.writeFileSync(path.resolve(soundsFolder, `${options.id.toString()}.json`), JSON.stringify(theSound, null, 4));
      // Update the collection
      const foundIndex = lstSounds.findIndex(x => x.id == options.id)
      lstSounds[foundIndex] = theSound
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
    const theSound = await this.getSound(options)
    if (theSound.data.id != undefined) {
      // Found it. Kill it.
      lstSounds = lstSounds.filter((obj) => {
        //console.log(`Obj Id: ${obj.id} options.id: ${options.id} Match:${obj.id != options.id}`)
        return obj.id != options.id;
      });
      fs.unlinkSync(path.resolve(soundsFolder, `${options.id.toString()}.json`))
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
