'use esversion: 6';
const settingsFile = './data/appSettings.json';
const fs = require('fs');

const lstSettings = JSON.parse(fs.readFileSync(settingsFile))

module.exports.getSetting = (settingName) => {
  const result = lstSettings.find(obj => {
    return obj.name == settingName;
  });
  if (result) {
    return result.value
  }
  return undefined
}

module.exports.updateSetting = (settingName, newValue) => {
  // Look for the category in the array
  const setting = lstSettings.find(obj => {
    return obj.name == settingName;
  });
  if (setting) {
    //  Update the object with new data
    setting.value = newValue;
    // Update the collection
    const foundIndex = lstSettings.findIndex(x => x.name === settingName)
    lstSettings[foundIndex] = setting
    const fs = require('fs');
    fs.writeFileSync(settingsFile, JSON.stringify(lstSettings));
  }
}
