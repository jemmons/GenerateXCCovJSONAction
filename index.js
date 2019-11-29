const core = require('@actions/core');
const exec = require('@actions/exec');
const fs = require('fs').promises;


async function run() {
  try { 
    const resultFile = core.getInput('resultfile', {required: true});
    const outputPath = core.getInput('outputpath', {required: true});
    const targets = core.getInput('targets').split(' ').filter(Boolean)
    
    core.startGroup('Generate Coverage Report');
    let rawJSON = '';
    await exec.exec('xcrun', ['xccov', 'view', '--report', '--json', resultFile], {
      listeners: {
        stdout: (data) => {
          rawJSON += data.toString()
        }
      }
    });
    core.endGroup();

    core.startGroup('Filter Targets');
    let json = JSON.parse(rawJSON);
    let newJSON = json;
    if (targets != []) {
      newJSON["targets"] = json["targets"].filter((it) => targets.includes(it.name))
    } 
    json = {};
    core.endGroup();

    core.startGroup('Write coverage JSON');
    await fs.writeFile(outputPath, JSON.stringify(newJSON));
    core.endGroup();
  } 
  catch (error) {
    core.setFailed(error.message);
  }
}

run()
