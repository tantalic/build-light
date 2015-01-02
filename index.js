#!/usr/bin/env node

/*
 * Configuration Variables
 * Configuration is controlled through environmental variables following the
 * twelve-factor methodology. (http://12factor.net/config)
 */
var CONFIG = {
    // Jenkins CI Server
    'JENKINS_BASE_URL': process.env.JENKINS_BASE_URL || 'https://builds.apache.org',
    'CHECK_INTERVAL':   process.env.CHECK_INTERVAL   || 15 * 60, // Every 15 minutes

    // GPIO Pins
    'PIN_NUMBER_RED': process.env.PIN_NUMBER_RED       || 17,
    'PIN_NUMBER_YELLOW': process.env.PIN_NUMBER_YELLOW || 27,
    'PIN_NUMBER_GREEN': process.env.PIN_NUMBER_GREEN   || 15,
};


/*
 * Modules
 */
var jenkins = require('jenkins-api').init(CONFIG.JENKINS_BASE_URL),
    gpio    = require("./gpio"),
    program = require('commander'),
    path    = require('path'),
    package = require( path.join(__dirname, 'package.json') );


/*
 * Command Line Interface
 */
program
    .version(package.version)
    .option('-v, --verbose', 'output light color')
    .parse(process.argv);


/*
 * Main Function
 */
function main () {
    jenkins.all_jobs(function (error, jobs) {
        // Set the color of the light
        var color = color_for_jobs(jobs);
        set_light_color(color);

        // Check again after CONFIG.CHECK_INTERVAL
        setTimeout(main, CONFIG.CHECK_INTERVAL*1000);
    });
}
main();


/*
 * Private Variables
 */
var redLight    = gpio.pin(CONFIG.PIN_NUMBER_RED),
    yellowLight = gpio.pin(CONFIG.PIN_NUMBER_YELLOW),
    greenLight  = gpio.pin(CONFIG.PIN_NUMBER_GREEN);


/*
 * Private Functions
 */

function job_is_building (job) {
    return job.color.endsWith('_anime');
}

function job_last_build_failed (job) {
    return ['red','yellow'].includes(job.color);
}

function color_for_jobs (jobs) {
    // Glass is half full, assume everything works until proven otherwise
    var color = 'green';

    for (var i = jobs.length - 1; i >= 0; i--) {
        var job = jobs[i];

        // if the job is currently building the light should be yellow
        // yellow trumps all other statuses so we stop processing
        if ( job_is_building(job) ) {
            color = 'yellow';
            break;
        };

        // if the job has failed the light should be red unless jobs are
        // currently building (so keep processing the jobs)
        if ( job_last_build_failed(job) ) {
            var color = 'red';
        };
    };

    return color;
}

function set_light_color (color) {
    ('red'===color)    ? redLight.turnOn()    : redLight.turnOff();
    ('yellow'===color) ? yellowLight.turnOn() : yellowLight.turnOff();
    ('green'===color)  ? greenLight.turnOn()  : greenLight.turnOff();

    if ( program.verbose === true ) {
        console.log(color);
    }
}


/*
 * Polyfills
 */

// String.prototype.endsWith()
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith
if (!String.prototype.endsWith) {
  Object.defineProperty(String.prototype, 'endsWith', {
    value: function(searchString, position) {
      var subjectString = this.toString();
      if (position === undefined || position > subjectString.length) {
        position = subjectString.length;
      }
      position -= searchString.length;
      var lastIndex = subjectString.indexOf(searchString, position);
      return lastIndex !== -1 && lastIndex === position;
    }
  });
}


// Array.prototype.includes()
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes
if (![].includes) {
  Array.prototype.includes = function(searchElement /*, fromIndex*/ ) {'use strict';
    if (this === undefined || this === null) {
      throw new TypeError('Cannot convert this value to object');
    }
    var O = Object(this);
    var len = parseInt(O.length) || 0;
    if (len === 0) {
      return false;
    }
    var n = parseInt(arguments[1]) || 0;
    var k;
    if (n >= 0) {
      k = n;
    } else {
      k = len + n;
      if (k < 0) {k = 0;}
    }
    var currentElement;
    while (k < len) {
      currentElement = O[k];
      if (searchElement === currentElement ||
         (searchElement !== searchElement && currentElement !== currentElement)) {
        return true;
      }
      k++;
    }
    return false;
  };
}
