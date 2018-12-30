'use esversion: 6';
const actionsFolder = './data/actions/';
const fs = require('fs');
const path = require('path');
const config = require('../../../src/lib/config');
const logger = require('../../../src/lib/logger');
const log = logger(config.logger);
const className = 'services/actions'

let lstActions;
loadActionList()

function loadActionList () {
  log.debug('Loading all Actions from disk...')
  if (fs.existsSync(actionsFolder)) {
    const files = fs.readdirSync(actionsFolder);
    lstActions = [];
    files.forEach(file => {
      lstActions.push(JSON.parse(fs.readFileSync(path.resolve(actionsFolder, file))));
    });
  }
}
module.exports.lstActions = lstActions

/**
 * @param {Object} options
 * @throws {Error}
 * @return {Promise}
 */
module.exports.findActions = async () => {
  // List all actions.
  try {
    if (lstActions === undefined) loadActionList();

    return {
      status: 200,
      data: lstActions
    };
  } catch (err) {
    log.error(`${className}:findActions: ${err.message}`)
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
module.exports.createAction = async (options) => {
  try {
    // Check that the payload has all required elements
    if (options.body.name == undefined) return {
      status: 400,
      data: 'Required element <name> is missing.'
    };
    if (options.body.sound == undefined) return {
      status: 400,
      data: 'Required element <sound> is missing.'
    };
    if (options.body.orchestrationId == undefined) return {
      status: 400,
      data: 'Required element <orchestrationId> is missing.'
    };
    if (options.body.type == undefined) return {
      status: 400,
      data: 'Required element <type> is missing.'
    };
    switch (options.body.type) {
    case 'SOUND':
      if (options.body.sound.soundId == undefined) return {
        status: 400,
        data: 'Required element <sound.soundId> is missing.'
      };
      if (options.body.sound.volume == undefined) return {
        status: 400,
        data: 'Required element <sound.volume> is missing.'
      };
      if (options.body.sound.speakers == undefined) return {
        status: 400,
        data: 'Required element <sound.speakers> is missing.'
      };
      break
    case 'ORCHESTRATION':
      if (options.body.nextOrchestrationId == undefined) return {
        status: 400,
        data: 'Required element <nextOrchestrationId> is missing.'
      };
      break
    }

    const d = new Date();
    const newId = d.getTime();
    const newAction = {
      id: newId,
      name: options.body.name,
      orchestrationId: options.body.orchestrationId
    }
    switch (options.body.type) {
    case 'SOUND':
      newAction.sound = {
        soundId: options.body.sound.soundId,
        volume: options.body.sound.volume,
        speakers: options.body.sound.speakers
      }
      break
    case 'ORCHESTRATION':
      newAction.nextOrchestrationId = options.body.nextOrchestrationId
      break
    }
    // Save the new action to disk
    fs.writeFileSync(path.resolve(actionsFolder, `${newId.toString()}.json`), JSON.stringify(newAction, null, 2));
    // Save the new action to the collection
    lstActions.push(newAction);
    return {
      status: 201,
      data: newAction
    };
  } catch (err) {
    log.error(`${className}:createAction: ${err.message}`)
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
module.exports.getAction = async (options) => {
  try {
    // Look for the sound in the array
    const result = lstActions.find(obj => {
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
    log.error(`${className}:getAction: ${err.message}`)
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
module.exports.updateAction = async (options) => {
  try {
    // Check that the payload has all required elements
    if (options.body.name == undefined) return {
      status: 400,
      data: 'Required element <name> is missing.'
    };
    if (options.body.sound == undefined) return {
      status: 400,
      data: 'Required element <sound> is missing.'
    };
    if (options.body.orchestrationId == undefined) return {
      status: 400,
      data: 'Required element <orchestrationId> is missing.'
    };
    if (options.body.sound.soundId == undefined) return {
      status: 400,
      data: 'Required element <sound.soundId> is missing.'
    };
    if (options.body.sound.volume == undefined) return {
      status: 400,
      data: 'Required element <sound.volume> is missing.'
    };
    if (options.body.sound.speakers == undefined) return {
      status: 400,
      data: 'Required element <sound.speakers> is missing.'
    };
    // Find the item in the collection
    let theAction = await this.getAction(options)
    if (theAction.data.id != undefined) {
      theAction = options.body
      theAction.id = options.id // Just to make sure we update the right object
      // Update the file
      fs.writeFileSync(path.resolve(actionsFolder, `${options.id.toString()}.json`), JSON.stringify(theAction, null, 2));
      // Update the collection
      const foundIndex = lstActions.findIndex(x => x.id == options.id)
      lstActions[foundIndex] = theAction
      return {
        status: 200,
        data: theAction
      };
    }
    return {
      status: 404,
      data: 'Item not found'
    };
  } catch (err) {
    log.error(`${className}:updateAction: ${err.message}`)
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
module.exports.deleteAction = async (options) => {
  try {
    const theAction = await this.getAction(options)
    if (theAction.data.id != undefined) {
      // Found it. Kill it.
      lstActions = lstActions.filter((obj) => {
        return obj.id != options.id;
      });
      fs.unlinkSync(path.resolve(actionsFolder, `${options.id.toString()}.json`))
      return {
        status: 200
      };
    }
    return {
      status: 404,
      data: 'Item not found'
    };
  } catch (err) {
    log.error(`${className}:deleteAction: ${err.message}`)
    return {
      status: 500,
      data: err.message
    };
  }
};
