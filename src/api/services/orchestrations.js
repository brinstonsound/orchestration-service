'use esversion: 6';
const orchestrationsFolder = './data/orchestrations/';
const fs = require('fs');
const path = require('path');

let lstOrchestrations;
loadOrchestrations()

function loadOrchestrations () {
  console.log('Loading all Orchestrations from disk...')
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
      actions: [], // Actions will be attached by the actions object
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
    const result = lstOrchestrations.find(obj => {
      //console.log(`Obj Id: ${obj.id} options.id: ${options.id} Match:${obj.id == options.id}`)
      return obj.id == options.id;
    });
    let response;
    if (result) {
      // TODO:Look up the actions for this orchestration.  Attach them in the result.actions array.

      // TODO:Look up the triggers for this orchestration.  Attach them in the result.triggers array.

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
      // Found it. Kill it.
      lstOrchestrations = lstOrchestrations.filter((obj) => {
        //console.log(`Obj Id: ${obj.id} options.id: ${options.id} Match:${obj.id != options.id}`)
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
    if (theOrch.data.id != undefined) {
      // Found it. Check for any actions.
      if (theOrch.actions == undefined || theOrch.actions.length == 0) {
        return {
          status: 400,
          data: 'No actions to execute.'
        }
      }
      if (theOrch.startDelay == undefined) theOrch.startDelay = 0 // Set a default start delay of 0 ms.
      setTimeout(() => {
        // Timeout has expired.
        // TODO: Execute all actions now.

      }, theOrch.startDelay * 1000);
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
