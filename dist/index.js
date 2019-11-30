module.exports =
/******/ (function(modules, runtime) { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	__webpack_require__.ab = __dirname + "/";
/******/
/******/ 	// the startup function
/******/ 	function startup() {
/******/ 		// Load entry module and return exports
/******/ 		return __webpack_require__(104);
/******/ 	};
/******/
/******/ 	// run startup
/******/ 	return startup();
/******/ })
/************************************************************************/
/******/ ({

/***/ 104:
/***/ (function(__unusedmodule, __unusedexports, __webpack_require__) {

const core = __webpack_require__(990);
const exec = __webpack_require__(952);
const fs = __webpack_require__(747).promises;


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


/***/ }),

/***/ 747:
/***/ (function(module) {

module.exports = require("fs");

/***/ }),

/***/ 952:
/***/ (function() {

eval("require")("@actions/exec");


/***/ }),

/***/ 990:
/***/ (function() {

eval("require")("@actions/core");


/***/ })

/******/ });