"use strict";

/*
 * Configuration Variables
 * Configuration is controlled through environmental variables following the
 * twelve-factor methodology. (http://12factor.net/config)
 */
var CONFIG = {
    // GPIO Values
    'PIN_VALUE_ON':    process.env.PIN_VALUE_ON   || 0,
    'PIN_VALUE_OFF':   process.env.PIN_VALUE_OFF  || 1,
    'GPIO_BASE_PATH': (process.env.GPIO_BASE_PATH || '/sys/class/gpio').trim(),
};

/*
 * Modules
 */
var fs = require("fs"),
    path = require("path");


/*
 * Private Functions
 */
function openPin (pinNumber) {
    var pinPath = getPinPath(pinNumber);

    // Open pin
    if (! fs.existsSync(pinPath) ) {
        var exportPath = getExportPath();
        fs.writeFileSync(exportPath, pinNumber);
    }

    // Set pin direction to 'out'
    var pinDirectionPath = path.join(pinPath, 'direction');
    fs.writeFileSync(pinDirectionPath, 'out');
}

function writeToPin (pinNumber, value) {
    var pinValuePath = getPinValuePath(pinNumber);
    fs.writeFileSync(pinValuePath, value);
}

function getExportPath () {
    return path.join(CONFIG.GPIO_BASE_PATH, 'export');
}

function getPinPath (pinNumber) {
    return path.join(CONFIG.GPIO_BASE_PATH, 'gpio'+pinNumber);
}

function getPinDirectionPath (pinNumber) {
    var pinPath = getPinPath(pinNumber);
    return path.join(pinPath, 'direction');
}

function getPinValuePath (pinNumber) {
    var pinPath = getPinPath(pinNumber);
    return path.join(pinPath, 'value');
}


/*
 * Public Interface
 */
module.exports = {
    pin: function (pinNumber) {
        var pinNumber = parseInt(pinNumber, 10),
            onValue   = parseInt(CONFIG.PIN_VALUE_ON, 10),
            offValue  = parseInt(CONFIG.PIN_VALUE_OFF, 10);

        openPin(pinNumber);
        writeToPin(pinNumber, CONFIG.PIN_VALUE_OFF);

        return {
            turnOn: function () {
                writeToPin(pinNumber, onValue);
            },
            turnOff: function () {
                writeToPin(pinNumber, offValue);
            }
        }
    }
};
