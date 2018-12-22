'use esversion: 6';
const symphoniesFolder = './data/symphonies/';
const fs = require('fs');
const path = require('path');

let lstSymphonies;
loadSymphoniesList()

function loadSymphoniesList() {
  console.log('Loading all Symphonies from disk...')
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
        const result = lstSymphonies.find(obj => {
          //console.log(`Obj Id: ${obj.id} options.id: ${options.id} Match:${obj.id == options.id}`)
          return obj.isActive == true;
        });
        return {
          status: 200,
          data: result
        };
      }
    }
    return {
      status: 200,
      data: lstSymphonies
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
      //Resolve Active Symphony (there can be only one!)'
      lstSymphonies.forEach(symphony => {
        if (symphony.isActive && symphony != newSymphony) {
          // Deactivate this symphony
          symphony.isActive = false
          fs.writeFileSync(path.resolve(symphoniesFolder, `${symphony.id.toString()}.json`), JSON.stringify(symphony, null, 2));
          // Update the collection
          const foundIndex = lstSymphonies.findIndex(x => x.id == symphony.id)
          lstSymphonies[foundIndex] = symphony
        }
      })
    }
    return {
      status: 201,
      data: newSymphony
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
module.exports.getSymphony = async (options) => {
  try {
    // Look for the item in the array
    const result = lstSymphonies.find(obj => {
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
        //Resolve Active Symphony (there can be only one!)'
        lstSymphonies.forEach(symphony => {
          if (symphony.isActive && symphony != theSymphony) {
            // Deactivate this symphony
            symphony.isActive = false
            fs.writeFileSync(path.resolve(symphoniesFolder, `${symphony.id.toString()}.json`), JSON.stringify(symphony, null, 2));
            // Update the collection
            const foundIndex = lstSymphonies.findIndex(x => x.id == symphony.id)
            lstSymphonies[foundIndex] = symphony
          }
        })
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
      // Found it. Kill it.
      lstSymphonies = lstSymphonies.filter((obj) => {
        //console.log(`Obj Id: ${obj.id} options.id: ${options.id} Match:${obj.id != options.id}`)
        return obj.id != options.id;
      });
      fs.unlinkSync(path.resolve(symphoniesFolder, `${options.id.toString()}.json`))
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
