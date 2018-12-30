'use esversion: 6';
const symphoniesFolder = './data/symphonies/';
const fs = require('fs');
const path = require('path');
const settings = require('../../lib/appSettings')
const config = require('../../../src/lib/config');
const logger = require('../../../src/lib/logger');
const log = logger(config.logger);
const className = 'services/symphonies'

let lstSymphonies;
loadSymphoniesList()

function loadSymphoniesList () {
  log.debug('Loading all Symphonies from disk...')
  if (fs.existsSync(symphoniesFolder)) {
    const files = fs.readdirSync(symphoniesFolder);
    lstSymphonies = [];
    files.forEach(file => {
      lstSymphonies.push(JSON.parse(fs.readFileSync(path.resolve(symphoniesFolder, file))));
    });
  }
}
module.exports.lstSymphonies = lstSymphonies

/**
 * @param {Object} options
 * @throws {Error}
 * @return {Promise}
 */
module.exports.findSymphonies = async (options) => {
  try {
    if (lstSymphonies === undefined) loadSymphoniesList();
    if (options != undefined) {
      if (options.active == 'true') {
        const activeSymphonyId = settings.getSetting('activeSymphony')
        const result = await this.getSymphony({
          id: activeSymphonyId
        })
        return {
          status: 200,
          data: result.data
        };
      }
    }
    return {
      status: 200,
      data: lstSymphonies
    };
  } catch (err) {
    log.error(`${className}:findSymphonies: ${err.message}`)
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
module.exports.createSymphony = async (options) => {
  try {
    // Check that the payload has all required elements
    if (options.body.name == undefined) return {
      status: 400,
      data: 'Required element <name> is missing.'
    };
    if (options.body.isActive == undefined) return {
      status: 400,
      data: 'Required element <isActive> is missing.'
    };
    const d = new Date();
    const newId = d.getTime();
    const newSymphony = {
      id: newId,
      name: options.body.name,
      isActive: options.body.isActive
    }
    // Save the new sound to disk
    fs.writeFileSync(path.resolve(symphoniesFolder, `${newId.toString()}.json`), JSON.stringify(newSymphony, null, 2));
    // Save the new sound to the collection
    lstSymphonies.push(newSymphony);

    if (newSymphony.isActive) {
      const settings = require('./src/lib/appSettings')
      settings.updateSetting('activeSymphony', newId)
    }

    return {
      status: 201,
      data: newSymphony
    };
  } catch (err) {
    log.error(`${className}:createSymphony: ${err.message}`)
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
module.exports.getSymphony = async (options) => {
  try {
    // Look for the item in the array
    const result = lstSymphonies.find(obj => {
      //log.debug(`Obj Id: ${obj.id} options.id: ${options.id} Match:${obj.id == options.id}`)
      return obj.id == options.id;
    });
    let response;
    if (result) {
      // Load up this symphony's orchestrations
      const orchestrations = require('./orchestrations')
      const myOrchestrations = orchestrations.lstOrchestrations.filter((obj) => {
        //log.debug(`Obj symphonyId: ${obj.symphonyId} options.id: ${options.id} Match:${obj.symphonyId == options.id}`)
        return obj.symphonyId == options.id;
      });
      result.orchestrations = myOrchestrations
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
    log.error(`${className}:getSymphony: ${err.message}`)
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
module.exports.updateSymphony = async (options) => {
  try {
    // Check that the payload has all required elements
    if (options.body.name == undefined) return {
      status: 400,
      data: 'Required element <name> is missing.'
    };
    // Find the item in the collection
    let theSymphony = await this.getSymphony(options)
    if (theSymphony.data.id != undefined) {
      theSymphony = options.body
      theSymphony.id = options.id // Just to make sure we update the right object
      // Update the file
      fs.writeFileSync(path.resolve(symphoniesFolder, `${options.id.toString()}.json`), JSON.stringify(theSymphony, null, 2));
      // Update the collection
      const foundIndex = lstSymphonies.findIndex(x => x.id == options.id)
      lstSymphonies[foundIndex] = theSymphony

      if (theSymphony.isActive) {
        const settings = require('./src/lib/appSettings')
        settings.updateSetting('activeSymphony', options.id)
      }

      return {
        status: 200,
        data: theSymphony
      };
    }
    return {
      status: 404,
      data: 'Item not found'
    };
  } catch (err) {
    log.error(`${className}:updateSymphony: ${err.message}`)
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
module.exports.deleteSymphony = async (options) => {
  try {
    const theSymphony = await this.getSymphony(options)
    if (theSymphony.data.id != undefined) {
      // Found it.
      if (theSymphony.data.id != settings.getSetting('activeSymphony')) {
        // Delete all orchestrations in this symphony (gulp!)
        const orchestrations = require('./orchestrations')
        const orchs = orchestrations.lstOrchestrations.filter((obj) => {
          return obj.symphonyId == theSymphony.data.id;
        })
        orchs.forEach(orch => {
          orchestrations.deleteOrchestration({
            id: orch.id
          })
        })
        // Remove this symphony from the collection
        lstSymphonies = lstSymphonies.filter((obj) => {
          return obj.id != options.id;
        });
        fs.unlinkSync(path.resolve(symphoniesFolder, `${options.id.toString()}.json`))
        return {
          status: 200
        }
      }
      return {
        status: 400,
        data: 'Cannot delete the active symphony.'
      }
    }
    return {
      status: 404,
      data: 'Item not found'
    };
  } catch (err) {
    log.error(`${className}:deleteSymphony: ${err.message}`)
    return {
      status: 500,
      data: err.message
    };
  }
};
