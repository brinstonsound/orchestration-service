'use esversion: 6';
const triggersFolder = './data/triggers/';
const fs = require('fs');
const path = require('path');
const config = require('../../../src/lib/config');
const logger = require('../../../src/lib/logger');
const log = logger(config.logger);
const settings = require('./appSettings')
const symphonies = require('./symphonies')
const orchestrations = require('./orchestrations')
const className = 'services/triggers'

let lstTriggers;
loadTriggerList()

function loadTriggerList () {
  log.debug('Loading all Triggers from disk...')
  if (fs.existsSync(triggersFolder)) {
    const files = fs.readdirSync(triggersFolder);
    lstTriggers = [];
    files.forEach(file => {
      lstTriggers.push(JSON.parse(fs.readFileSync(path.resolve(triggersFolder, file))));
    });
  }
  // else {
  //   log.debug(`ERROR: No triggers found at ${triggersFolder}`)
  // }
}
module.exports.lstTriggers = lstTriggers

function validate (objTrigger) {
  // Check that the payload has all required elements
  if (objTrigger.name == undefined) return {
    status: 400,
    data: 'Required element <name> is missing.'
  };
  // type is required
  if (objTrigger.type == undefined) return {
    status: 400,
    data: 'Required element <type> is missing.'
  };
  // type must be in the Enum
  if (objTrigger.type != 'TIMER' && objTrigger.type != 'SWITCH') return {
    status: 400,
    data: `Element <type> is has an invalid value: ${objTrigger.type}. Must be either TIMER or SWITCH`
  };
  if (objTrigger.type == 'TIMER') {
    if (objTrigger.timerIntervalMin == undefined) return {
      status: 400,
      data: 'Required element <timerIntervalMin> is missing.'
    };
    if (objTrigger.timerIntervalMax == undefined) return {
      status: 400,
      data: 'Required element <timerIntervalMax> is missing.'
    };
  }
  if (objTrigger.type == 'SWITCH') {
    if (objTrigger.switchNumber == undefined) return {
      status: 400,
      data: 'Required element <switchNumber> is missing.'
    };
  }
}

/**
 * @param {Object} options
 * @throws {Error}
 * @return {Promise}
 */
module.exports.findTriggers = async () => {
  try {
    if (lstTriggers === undefined) loadTriggerList();
    return {
      status: 200,
      data: lstTriggers
    };
  } catch (err) {
    log.error(`${className}:findTriggers: ${err.message}`)
    return {
      status: 500,
      data: err.message
    };
  }
};

/**
 * @param {Object} options
 * @param {} objTrigger
 * @throws {Error}
 * @return {Promise}
 */
module.exports.createTrigger = async (options) => {
  // Example from API spec:
  // {
  //   "id": 9981399,
  //   "name": "quis anim",
  //   "type": "TIMER",
  //   "switchNumber": 10821952,
  //   "timerIntervalMin": 65093086,
  //   "timerIntervalMax": 71309504
  // }

  try {
    const validationResult = validate(options.body)
    if (validationResult) return validationResult

    // Build the new trigger object
    const d = new Date();
    const newId = d.getTime();
    const newTrigger = {
      id: newId,
      name: options.body.name,
      type: options.body.type
    }
    if (options.body.type == 'SWITCH') {
      newTrigger.switchNumber = options.body.switchNumber
    }
    if (options.body.type == 'TIMER') {
      newTrigger.timerIntervalMin = options.body.timerIntervalMin
      newTrigger.timerIntervalMax = options.body.timerIntervalMax
    }

    // Save the new trigger to disk
    fs.writeFileSync(path.resolve(triggersFolder, `${newId.toString()}.json`), JSON.stringify(newTrigger, null, 4));
    // Save the new sound to the collection
    lstTriggers.push(newTrigger);
    return {
      status: 201,
      data: newTrigger
    };
  } catch (err) {
    log.error(`${className}:createTrigger: ${err.message}`)
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
module.exports.getTrigger = async (options) => {
  try {
    // Look for the sound in the array
    const result = lstTriggers.find(obj => {
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
    log.error(`${className}:getTrigger: ${err.message}`)
    return {
      status: 500,
      data: err.message
    };
  }
};

/**
 * @param {Object} options
 * @param {} objTrigger
 * @throws {Error}
 * @return {Promise}
 */
module.exports.updateTrigger = async (options) => {
  try {
    const validationResult = validate(options.body)
    if (validationResult) return validationResult

    // Find the trigger in the collection
    let theTrigger = await this.getTrigger(options)
    if (theTrigger.data.id != undefined) {
      theTrigger = options.body
      theTrigger.id = options.id // Just to make sure we update the right object
      // Update the file
      fs.writeFileSync(path.resolve(triggersFolder, `${options.id.toString()}.json`), JSON.stringify(theTrigger, null, 4));
      // Update the collection
      const foundIndex = lstTriggers.findIndex(x => x.id == options.id)
      lstTriggers[foundIndex] = theTrigger
      return {
        status: 200,
        data: theTrigger
      };
    }
    return {
      status: 404,
      data: 'Item not found'
    };
  } catch (err) {
    log.error(`${className}:updateTrigger: ${err.message}`)
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
module.exports.deleteTrigger = async (options) => {
  try {
    const theTrigger = await this.getSound(options)
    if (theTrigger.data.id != undefined) {
      // Found it. Kill it.
      lstTriggers = lstTriggers.filter((obj) => {
        //log.debug(`Obj Id: ${obj.id} options.id: ${options.id} Match:${obj.id != options.id}`)
        return obj.id != options.id;
      });
      fs.unlinkSync(path.resolve(triggersFolder, `${options.id.toString()}.json`))
      return {
        status: 200
      };
    }
    return {
      status: 404,
      data: 'Item not found'
    };
  } catch (err) {
    log.error(`${className}:deleteTrigger: ${err.message}`)
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
module.exports.fire = async (options) => {
  try {
    const theTrigger = await this.getTrigger(options)
    if (theTrigger.data.id != undefined) {
      // Found it. Fire it.
      const orchestrationsExecuted = []
      // Get the active symphony
      const activeSymphonyId = settings.getSetting('activeSymphony')
      const symphony = await symphonies.getSymphony({id:activeSymphonyId})
      // Look for this trigger in all orchestrations
      symphony.data.orchestrations.forEach(orch => {
        if (orch.triggers) {
          const match = orch.triggers.find(obj => {
          //log.debug(`Obj Id: ${obj} options.id: ${options.id} Match:${obj == options.id}`)
            return obj == options.id;
          });
          if (match) {
            orchestrations.execute({
              id: orch.id
            })
            orchestrationsExecuted.push({id: orch.id, name: orch.name})
          }
        }
      })
      return {
        status: 200,
        data: orchestrationsExecuted
      };
    }
    return {
      status: 404,
      data: 'Item not found'
    };
  } catch (err) {
    log.error(`${className}:fire: ${err.message}`)
    return {
      status: 500,
      data: err.message
    };
  }
};
