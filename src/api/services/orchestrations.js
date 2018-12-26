'use esversion: 6';
const orchestrationsFolder = './data/orchestrations/';
const fs = require('fs');
const path = require('path');
const config = require('../../../src/lib/config');
const logger = require('../../../src/lib/logger');
const log = logger(config.logger);

let lstOrchestrations;
loadOrchestrations()

function loadOrchestrations () {
  log.debug('Loading all Orchestrations from disk...')
  if (fs.existsSync(orchestrationsFolder)) {
    const files = fs.readdirSync(orchestrationsFolder);
    lstOrchestrations = [];
    files.forEach(file => {
      lstOrchestrations.push(JSON.parse(fs.readFileSync(path.resolve(orchestrationsFolder, file))));
    });
  }
}
module.exports.lstOrchestrations = lstOrchestrations

/**
 * @param {Object} options
 * @throws {Error}
 * @return {Promise}
 */
module.exports.findOrchestrations = async () => {
  // List all Orchestrations.
  try {
    if (lstOrchestrations === undefined) loadOrchestrations();

    return {
      status: 200,
      data: lstOrchestrations
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
module.exports.createOrchestration = async (options) => {
  try {
    // Check that the payload has all required elements
    if (options.body.name == undefined) return {
      status: 400,
      data: 'Required element <name> is missing.'
    };
    if (options.body.symphonyId == undefined) return {
      status: 400,
      data: 'Required element <symphonyId> is missing.'
    };
    if (!Number.isInteger(options.body.symphonyId)) return {
      status: 400,
      data: 'Element <symphonyId> must be an integer.'
    };

    const d = new Date();
    const newId = d.getTime();
    const newOrch = {
      id: newId,
      name: options.body.name,
      symphonyId: options.body.symphonyId,
      triggers: [] // Triggers will be attached by the triggers object
    }
    // Save the new sound to disk
    fs.writeFileSync(path.resolve(orchestrationsFolder, `${newId.toString()}.json`), JSON.stringify(newOrch, null, 4));
    // Save the new sound to the collection
    lstOrchestrations.push(newOrch);
    return {
      status: 201,
      data: newOrch
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
module.exports.getOrchestration = async (options) => {
  try {
    // Look for the item in the array
    const myOrchestration = lstOrchestrations.find(obj => {
      //log.debug(`Obj Id: ${obj.id} options.id: ${options.id} Match:${obj.id == options.id}`)
      return obj.id == options.id;
    });
    let response;
    if (myOrchestration) {
      //Look up the actions for this orchestration.  Attach them in the result.actions array.
      const actions = require('./actions')
      const lstActions = actions.lstActions
      myOrchestration.actions = lstActions.filter(obj => {
        return obj.orchestrationId == myOrchestration.id
      })
      if (options.resolveTriggers) {
        //Look up the triggers for this orchestration.  Attach them in the result.triggers array.
        const triggers = require('./triggers')
        const lstTriggers = triggers.lstTriggers
        const triggerIds = myOrchestration.triggers
        myOrchestration.triggers = []
        triggerIds.forEach(element => {
          myOrchestration.triggers.push(lstTriggers.find(obj => {
            return obj.id == element
          }))
        });
      }
      response = {
        status: 200,
        data: myOrchestration
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
module.exports.updateOrchestration = async (options) => {
  try {
    // Check that the payload has all required elements
    if (options.body.name == undefined) return {
      status: 400,
      data: 'Required element <name> is missing.'
    };
    if (options.body.symphonyId == undefined) return {
      status: 400,
      data: 'Required element <symphonyId> is missing.'
    };
    if (!Number.isInteger(options.body.symphonyId)) return {
      status: 400,
      data: 'Element <symphonyId> must be an integer.'
    };
    // Find the orch in the collection
    let theOrch = await this.getOrchestration(options)
    if (theOrch.data.id != undefined) {
      theOrch = options.body
      theOrch.id = options.id // Just to make sure we update the right object
      // Update the file
      fs.writeFileSync(path.resolve(orchestrationsFolder, `${options.id.toString()}.json`), JSON.stringify(theOrch, null, 4));
      // Update the collection
      const foundIndex = lstOrchestrations.findIndex(x => x.id == options.id)
      lstOrchestrations[foundIndex] = theOrch
      return {
        status: 200,
        data: theOrch
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
module.exports.deleteOrchestration = async (options) => {
  try {
    const theOrch = await this.getOrchestration(options)
    if (theOrch.data.id != undefined) {
      // Found it.
      // Delete all actions associate with this orchestration
      const actions = require('./actions')
      const lstActions = actions.lstactions.filter((obj) => {
        return obj.orchestrationId == theOrch.data.id;
      })
      lstActions.forEach(a => {
        actions.deleteAction({
          id: a.id
        })
      })
      // Remove the orchestration from the collection
      lstOrchestrations = lstOrchestrations.filter((obj) => {
        return obj.id != options.id;
      });
      fs.unlinkSync(path.resolve(orchestrationsFolder, `${options.id.toString()}.json`))
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

/**
 * @param {Object} options
 * @throws {Error}
 * @return {Promise}
 */
module.exports.execute = async (options) => {
  // Find the orchestration
  try {
    const theOrch = await this.getOrchestration(options)
    if (theOrch.status == 200) {
      // Found it. Check for any actions.
      log.debug(`Executing orchestration ${theOrch.data.id} - ${theOrch.data.name} now...`)
      if (theOrch.data.actions == undefined || theOrch.data.actions.length == 0) {
        log.debug(`Orchestration ${theOrch.data.id} - ${theOrch.data.name}: No actions to execute.`)
        return {
          status: 400,
          data: 'No actions to execute.'
        }
      }
      if (theOrch.data.startDelay == undefined) theOrch.data.startDelay = 0 // Set a default start delay of 0 ms.
      if (theOrch.data.startDelay > 0) {
        log.debug(`Pausing for ${theOrch.data.startDelay} milliseconds...`)
      }
      setTimeout(() => {
        // Timeout has expired.  Execute all actions now.
        theOrch.data.actions.forEach(action => {
          log.debug(`Action: ${action.name}`)
          switch (action.type) {
          case 'SOUND':
            // Call the sound server
            log.debug(`Calling the Sound Server with Sound ${JSON.stringify(action.sound)} *** NOT IMPLEMENTED YET ***`)
            break
          case 'ORCHESTRATION':
            // Call another orchestration
            log.debug(`Chaining to orchestration ${action.nextOrchestrationId}`)
            this.execute({
              id: action.nextOrchestrationId
            })
            break
          }
        })
      }, theOrch.data.startDelay);
      return {
        status: 200
      };
    }
    return {
      status: 404,
      data: 'Item not found'
    };
  } catch (err) {
    log.debug(`ORCH-EXECUTE Error: ${err.message}`)
    return {
      status: 500,
      data: err.message
    };
  }
};

// /**
//  * @param {Object} options
//  * @throws {Error}
//  * @return {Promise}
//  */
// module.exports.addTrigger = async (options) => {
//   /* Expects:
//     options.body.orchestrationId,
//     options.body.triggerId
//   */
//   try {
//     // Get the orchestration
//     const orch = await this.getOrchestration({
//       id: options.body.orchestrationId
//     }, true)
//     if (!orch.triggers.find(obj => {return obj == options.body.triggerId})) orch.triggers.push(options.body.triggerId)
//     await this.updateOrchestration({id: options.body.orchestrationId, body:orch})
//     return {
//       status: 201,
//       data: orch
//     };
//   } catch (err) {
//     log.debug(`addTrigger Error: ${err.message}`)
//     return {
//       status: 500,
//       data: err.message
//     };
//   }
// }

// /**
//  * @param {Object} options
//  * @throws {Error}
//  * @return {Promise}
//  */
// module.exports.removeTrigger = async (options) => {
//   /* Expects:
//     options.body.orchestrationId,
//     options.body.triggerId
//   */
//   try {
//     // Get the orchestration
//     const orch = await this.getOrchestration({
//       id: options.body.orchestrationId
//     }, true)
//     orch.triggers.filter(obj => {return obj != options.body.triggerId})
//     await this.updateOrchestration({id: options.body.orchestrationId, body:orch})
//     return {
//       status: 200,
//       data: orch
//     };
//   } catch (err) {
//     log.debug(`addTrigger Error: ${err.message}`)
//     return {
//       status: 500,
//       data: err.message
//     };
//   }
// }
