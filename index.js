const core = require('@actions/core');
const exec = require('@actions/exec');


async function run() {
  try { 
    const packageName = core.getInput('package');

    core.startGroup('Generate Project');
    await exec.exec('swift package generate-xcodeproj --enable-code-coverage');
    core.endGroup();
    
    core.startGroup('Build and Run Tests');
    await exec.exec('xcodebuild test -scheme ' + packageName + '-Package -resultBundleVersion 3 -resultBundlePath ./build.xcresult');
    core.endGroup();
    
    core.startGroup('Parse Coverage');
    await exec.exec('xcrun xccov view --report --json ./build.xcresult > coverage.json');
    core.endGroup();

    core.setOutput('path', './coverage.json');
  } 
  catch (error) {
    core.setFailed(error.message);
  }
}

run()
