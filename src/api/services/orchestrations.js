'use esversion: 6'
const orchestrationsFolder = './data/orchestrations/'
const fs = require('fs')
const path = require('path')
//const config = require('../../../src/lib/config')
const log = require('../../../src/lib/airhornLogger')
const appSettings = require('./appSettings')
//const log = logger(config.logger)
const className = 'services/orchestrations'

let lstOrchestrations
loadOrchestrations()

function loadOrchestrations () {
  log.debug('Loading all Orchestrations from disk...')
  if (fs.existsSync(orchestrationsFolder)) {
    const files = fs.readdirSync(orchestrationsFolder)
    lstOrchestrations = []
    files.forEach(file => {
      lstOrchestrations.push(JSON.parse(fs.readFileSync(path.resolve(orchestrationsFolder, file))))
    })
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
    if (lstOrchestrations === undefined) loadOrchestrations()

    return {
      status: 200,
      data: lstOrchestrations
    }
  } catch (err) {
    log.error(`${className}:findOrchestrations: ${err.message}`)
    return {
      status: 500,
      data: err.message
    }
  }
}

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
    }
    if (options.body.symphonyId == undefined) return {
      status: 400,
      data: 'Required element <symphonyId> is missing.'
    }
    if (!Number.isInteger(options.body.symphonyId)) return {
      status: 400,
      data: 'Element <symphonyId> must be an integer.'
    }
    if (options.body.startDelayMin == undefined) options.body.startDelayMin = 0
    if (!Number.isInteger(options.body.startDelayMin)) return {
      status: 400,
      data: 'Element <startDelayMin> must be an integer.'
    }
    if (options.body.startDelayMax == undefined) options.body.startDelayMax = 0
    if (!Number.isInteger(options.body.startDelayMax)) return {
      status: 400,
      data: 'Element <startDelayMax> must be an integer.'
    }
    if (options.body.autoStart == undefined) options.body.autoStart = false
    const d = new Date()
    const newId = d.getTime()
    const newOrch = {
      id: newId,
      name: options.body.name,
      symphonyId: options.body.symphonyId,
      startDelayMin: options.body.startDelayMin,
      startDelayMax: options.body.startDelayMax,
      autoStart: options.body.autoStart,
      triggers: [] // Triggers will be attached by the triggers object
    }
    // Save the new sound to disk
    fs.writeFileSync(path.resolve(orchestrationsFolder, `${newId.toString()}.json`), JSON.stringify(newOrch, null, 4))
    // Save the new sound to the collection
    lstOrchestrations.push(newOrch)
    return {
      status: 201,
      data: newOrch
    }
  } catch (err) {
    log.error(`${className}:createOrchestration: ${err.message}`)
    return {
      status: 500,
      data: err.message
    }
  }
}

/**
 * @param {Object} options
 * @throws {Error}
 * @return {Promise}
 */
module.exports.getOrchestration = async (options) => {
  log.debug(`${className}:getOrchestration: Retrieving orchestration ${options.id}`)
  try {
    // Look for the item in the array
    const myOrchestration = lstOrchestrations.find(obj => {
      //log.debug(`Obj Id: ${obj.id} options.id: ${options.id} Match:${obj.id == options.id}`)
      return obj.id == options.id
    })
    let response
    if (myOrchestration) {
      // //Look up the actions for this orchestration.  Attach them in the result.actions array.
      // const actions = require('./actions')
      // const lstActions = actions.lstActions
      // myOrchestration.actions = lstActions.filter(obj => {
      //   return obj.orchestrationId == myOrchestration.id
      // })
      // if (options.resolveTriggers) {
      //   //Look up the triggers for this orchestration.  Attach them in the result.triggers array.
      //   const triggers = require('./triggers')
      //   const lstTriggers = triggers.lstTriggers
      //   const triggerIds = myOrchestration.triggers
      //   myOrchestration.triggers = []
      //   triggerIds.forEach(element => {
      //     myOrchestration.triggers.push(lstTriggers.find(obj => {
      //       return obj.id == element
      //     }))
      //   })
      // }
      response = {
        status: 200,
        data: myOrchestration
      }
    } else {
      response = {
        status: 404,
        data: 'Item not found'
      }
    }
    return response
  } catch (err) {
    log.error(`${className}:getOrchestration: ${err.message}`)
    return {
      status: 500,
      data: err.message
    }
  }
}

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
    }
    if (options.body.symphonyId == undefined) return {
      status: 400,
      data: 'Required element <symphonyId> is missing.'
    }
    if (!Number.isInteger(options.body.symphonyId)) return {
      status: 400,
      data: 'Element <symphonyId> must be an integer.'
    }
    // Find the orch in the collection
    let theOrch = await this.getOrchestration(options)
    if (theOrch.data.id != undefined) {
      theOrch = options.body
      theOrch.id = Number.parseInt(options.id, 10) // Just to make sure we update the right object
      // Update the file
      fs.writeFileSync(path.resolve(orchestrationsFolder, `${options.id.toString()}.json`), JSON.stringify(theOrch, null, 4))
      // Update the collection
      const foundIndex = lstOrchestrations.findIndex(x => x.id == options.id)
      lstOrchestrations[foundIndex] = theOrch
      return {
        status: 200,
        data: theOrch
      }
    }
    return {
      status: 404,
      data: 'Item not found'
    }
  } catch (err) {
    log.error(`${className}:updateOrchestration: ${err.message}`)
    return {
      status: 500,
      data: err.message
    }
  }
}

/**
 * @param {Object} options
 * @throws {Error}
 * @return {Promise}
 */
module.exports.deleteOrchestration = async (options) => {
  try {
    log.debug(`${className}:deleteOrchestration: Deleting orchestration ${options.id}`)

    const theOrch = await this.getOrchestration(options.id)
    log.debug(`${className} - Found orchestration ${JSON.stringify(theOrch)}`)
    if (theOrch.data.id != undefined) {
      // Found it.
      // Delete all actions associated with this orchestration
      const actions = require('./actions')
      const lstActions = actions.lstactions.filter((obj) => {
        return obj.orchestrationId == theOrch.data.id
      })
      lstActions.forEach(a => {
        actions.deleteAction({
          id: a.id
        })
      })
      // Delete the orchestration file itself
      fs.unlinkSync(path.resolve(orchestrationsFolder, `${options.id.toString()}.json`))
      // Reload orchestration list
      loadOrchestrations()
      return {
        status: 200
      }
    }
    log.error(`${className}:deleteOrchestration: Orchestration ${options.id} not found.`)
    return {
      status: 404,
      data: 'Item not found'
    }
  } catch (err) {
    log.error(`${className}:deleteOrchestration: ${err.message}`)
    return {
      status: 500,
      data: err.message
    }
  }
}

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
      log.info(`Executing orchestration ${theOrch.data.id} - ${theOrch.data.name} now...`)
      log.debug(JSON.stringify(theOrch))
      if (theOrch.data.actions == undefined || theOrch.data.actions.length == 0) {
        log.warn(`Orchestration ${theOrch.data.id} - ${theOrch.data.name}: No actions to execute.`)
        return {
          status: 400,
          data: 'No actions to execute.'
        }
      }
      let startDelay = 0
      if (theOrch.data.startDelayMin && theOrch.data.startDelayMin > 0) {
        // Calculate a random start delay within the bound of the min and max configured.
        startDelay = Math.floor(Math.random() * (theOrch.data.startDelayMax - theOrch.data.startDelayMin + 1)) + theOrch.data.startDelayMin
      }
      if (startDelay > 0) {
        log.info(`Pausing for ${startDelay} seconds...`)
      }
      setTimeout(() => {
        // Timeout has expired.  Execute all actions now.
        theOrch.data.actions.forEach(action => {
          log.debug(`Action: ${JSON.stringify(action)}`)
          switch (action.type) {
          case 'SOUND':
            // Call the sound server
            log.info(`Calling the Sound Server with Sound ${JSON.stringify(action.sound)} *** NOT IMPLEMENTED YET ***`)
            break
          case 'ORCHESTRATION':
            // Check to see if this is a self-referencing orchestration.
            // If it is, then it's an 'ambient sound'.  Ambient sounds are
            // controlled by a master switch, so check it before chaining back
            // to yourself.
            if (action.nextOrchestrationId == theOrch.data.id && appSettings.getSetting('playAmbientSounds') == false) {
              break
            }
            // Call another orchestration
            log.debug(`Chaining to orchestration ${action.nextOrchestrationId}`)
            this.execute({
              id: action.nextOrchestrationId
            })
            break
          }
        })
      }, startDelay * 1000)
      return {
        status: 200
      }
    }
    return {
      status: 404,
      data: 'Item not found'
    }
  } catch (err) {
    log.error(`${className}:execute: ${err.message}`)
    return {
      status: 500,
      data: err.message
    }
  }
}

/**
 * @throws {Error}
 * @return {Promise}
 */
module.exports.startAmbient = async () => {
  log.info(`${className}:startAmbient: Starting all ambient sounds...`)
  try {
    // Set ambient sounds switch to true
    appSettings.updateSetting('playAmbientSounds', true)

    // Find all ambient (auto-start) orchestrations in the active symphony
    const symphonies = require('./symphonies')
    const symphonyResp = await symphonies.findSymphonies({
      active: true
    })
    const symphony = await symphonies.getSymphony({
      id: symphonyResp.data.id
    })
    symphony.data.orchestrations.forEach(orchestration => {
      if (orchestration.autoStart) {
        log.debug(`${className}:startAmbient: Starting orchestration ${orchestration.id}`)
        this.execute({
          id: orchestration.id
        })
      }
    })
    return {
      status: 200
    }
  } catch (err) {
    log.error(`${className}:startAmbient: ${err.message}`)
    return {
      status: 500,
      data: err.message
    }
  }
}

/**
 * @throws {Error}
 * @return {Promise}
 */
module.exports.stopAmbient = async () => {
  log.info(`${className}:stopAmbient: Stopping all ambient sounds...`)
  try {
    // Set ambient sounds switch to false.
    // The currently playing sounds should drain out on their own.
    appSettings.updateSetting('playAmbientSounds', false)
    return {
      status: 200
    }
  } catch (err) {
    log.error(`${className}:stopAmbient: ${err.message}`)
    return {
      status: 500,
      data: err.message
    }
  }
}
