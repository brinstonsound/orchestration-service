'use esversion: 6';
const soundsFolder = './data/sounds/';
const fs = require('fs');
const path = require('path');
const config = require('../../../src/lib/config');
const logger = require('../../../src/lib/logger');
const log = logger(config.logger);
const settings = require('./appSettings')
const className = 'services/sounds'
let lstSounds;
loadSoundList()

function loadSoundList () {
  log.debug('Loading all Sounds from disk...')
  if (fs.existsSync(soundsFolder)) {
    const soundFiles = fs.readdirSync(soundsFolder);
    lstSounds = [];
    soundFiles.forEach(file => {
      lstSounds.push(JSON.parse(fs.readFileSync(path.resolve(soundsFolder, file))));
    });
  } else {
    log.error(`ERROR: No sounds found at ${soundsFolder}`)
  }
}
module.exports.lstSounds = (reload) => {
  if (reload) {
    loadSoundList()
  }
  return lstSounds
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
    log.error(`${className}:findSounds: ${err.message}`)
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
    //log.debug(JSON.stringify(options.body))
    // Check that the payload has all required elements
    if (options.body.name == undefined) return {
      status: 400,
      data: 'Required element <name> is missing.'
    };
    if (options.body.file == undefined) return {
      status: 400,
      data: 'Sound file is missing.'
    };
    const d = new Date();
    const newId = d.getTime();
    const soundFilePath = `${settings.mediaFolder}/${newId}${path.extname(options.body.file.path)}`
    const newSound = {
      id: newId,
      name: options.body.name,
      description: options.body.description,
      soundCategories: options.body.soundCategories.split(','),
      fileName: soundFilePath
    }
    // Save the new sound to disk
    fs.writeFileSync(path.resolve(soundsFolder, `${newId.toString()}.json`), JSON.stringify(newSound, null, 4));
    // Save the new sound to the collection
    lstSounds.push(newSound);

    // Save the wav file to the airhorn media folder
    const tmpFile = options.body.file.path
    fs.readFile(tmpFile, (err, data) => {
      //log.debug('Reading tmp file...')
      fs.writeFile(soundFilePath, data, (err) => {
        //log.debug('Writing new file...')
        fs.unlink(tmpFile, () => {
          //log.debug('Deleting tmp file...')
          if (err) throw err;
        })
      })
      if (err) throw err;
    })
    log.info(`Created new sound: ${soundFilePath}`)
    // Reload sounds array
    loadSoundList()

    return {
      status: 201,
      data: newSound
    };
  } catch (err) {
    log.error(`${className}:createSound: ${err.message}`)
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
      //log.debug(`Obj Id: ${obj.id} options.id: ${options.id} Match:${obj.id == options.id}`)
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
    log.error(`${className}:getSound: ${err.message}`)
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
    log.error(`${className}:updateSound: ${err.message}`)
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
  log.debug(`${className}:deleteSound: Deleting sound ${options.id}`)
  try {
    const theSound = await this.getSound(options)
    if (theSound.data.id != undefined) {
      // Found it. Kill it.
      // lstSounds = lstSounds.filter((obj) => {
      //   //log.debug(`Obj Id: ${obj.id} options.id: ${options.id} Match:${obj.id != options.id}`)
      //   return obj.id != options.id;
      // });
      fs.unlinkSync(path.resolve(soundsFolder, `${options.id.toString()}.json`))
      fs.unlinkSync(path.resolve(settings.getSetting('mediaFolder'), `${options.id.toString()}.wav`))
      log.debug(`${className}:deleteSound: Sound ${options.id} deleted`)
      loadSoundList()
      return {
        status: 200
      };
    }
    log.debug(`${className}:deleteSound: Sound ${options.id} not found`)
    return {
      status: 404,
      data: 'Item not found'
    };
  } catch (err) {
    log.error(`${className}:deleteSound: Error deleting sound ${options.id} - ${err.message}`)
    return {
      status: 500,
      data: err.message
    };
  }
};
