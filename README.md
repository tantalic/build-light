# Build Light [![Build Status](https://travis-ci.org/tantalic/build-light.svg?branch=master)](https://travis-ci.org/tantalic/build-light) [![npm Dependencies](https://david-dm.org/tantalic/build-light.png)](https://david-dm.org/tantalic/build-light)

Build Light is a daemon, designed to run on single-board/development-board 
computers, that regularly polls your continuous integration server and reports 
build status through GPIO connected devices. It is primarily intended to control
a modified traffic light through a relay module although it can also control
LEDs connected directly to your board.

- **Red** - One or more builds has failed.
- **Yellow** - One or more jobs is currently building.
- **Green** - All jobs have successful builds.



## Supported Environments

Build Light is known to work with the following software and hardware:

### Continuous Integration Servers 

- [Jenkins][jenkins]

### Hardware 

- [Raspberry Pi Model B][pi-b]
- [Raspberry Pi Model B+][pi-b-plus]
- [BeagleBone Black][beagle-black]

### Operating Systems

- [Arch Linux ARM][arch]
- [Raspbian][raspbian]
- [Angstrom distribution][angstrom]


## Installation & Usage

### Installation

Installation is managed through [npm][npm]:

```sh
npm install build-light -g
```

### Configuration

Configuration is controlled through environment variables (following the
[twelve-factor methodology][12-factor-config]). You should adjust the following
environment variables to meet your needs:

#### Continuous Integration Server

|      Variable      |               Description               |       Default Value       |
|--------------------|-----------------------------------------|---------------------------|
| `JENKINS_BASE_URL` | The base URL of your Jenkins CI server. | https://builds.apache.org |
| `CHECK_INTERVAL`   | The polling interval, in seconds.       | 900 *(15 minutes)*        |

#### GPIO Pin Wiring
You can configure which GPIO pins control each color light for your setup. (The
default values have been selected for easy wiring on a Raspberry Pi Rev. 2.)

|       Variable      |                         Description                         | Default Value |
|---------------------|-------------------------------------------------------------|---------------|
| `PIN_NUMBER_RED`    | The GPIO pin that will be used to control the red light.    | [17][gpio-17] |
| `PIN_NUMBER_YELLOW` | The GPIO pin that will be used to control the yellow light. | [27][gpio-27] |
| `PIN_NUMBER_GREEN`  | The GPIO pin that will be used to control the green light.  | [22][gpio-22] |

#### Pin On/Off Values
The default configuration for GPIO pin on/off values is designed to work with 
an active low relay card. If you are using LEDs or an active high relay you may
wish to change these values:

|     Variable    |                           Description                           | Default Value |
|-----------------|-----------------------------------------------------------------|---------------|
| `PIN_VALUE_ON`  | The value that will be output to GPIO pins to turn a light on.  |             0 |
| `PIN_VALUE_OFF` | The value that will be output to GPIO pins to turn a light off. |             1 |


### Usage

Once installed and configured, build-light can be run as follows:

```sh
build-light
```

If you would like to run without global environment variables (or to override 
global variables) you can use [env][env] to run with a modified environment:

```sh
env JENKINS_BASE_URL=https://ci.example.com CHECK_INTERVAL=5 build-light
```

On supported operating systems, you can use the [systemd][systemd] service 
manager to setup the environment, manage when the application is started, and 
monitor the process to keep it running. This can be done with a system file
like the one below:

```ini
[Unit]
Description=Toolhouse Build Light

[Service]
ExecStart=/usr/bin/build-light
Restart=always
User=root
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=build-light
Environment=JENKINS_BASE_URL=https://ci.example.com
Environment=CHECK_INTERVAL=5

[Install]
WantedBy=multi-user.target
```


## In the wild

The following build-light installation at [Toolhouse][th] is used to monitor
approximately 30 different projects at any given time:
![][th-light]

[jenkins]: https://jenkins-ci.org
[npm]: https://www.npmjs.com
[12-factor-config]: http://12factor.net/config
[gpio-17]: http://pi.gadgetoid.com/pinout/pin11_gpio17
[gpio-27]: http://pi.gadgetoid.com/pinout/pin13_gpio21
[gpio-22]: http://pi.gadgetoid.com/pinout/pin15_gpio22
[env]: https://www.gnu.org/software/coreutils/manual/coreutils.html#env-invocation
[systemd]: http://freedesktop.org/wiki/Software/systemd/
[th-light]: https://farm3.staticflickr.com/2876/9917676435_2168767722_b_d.jpg
[th]: http://www.toolhouse.com/?utm_source=Kevin&utm_medium=GitHub&utm_campaign=build-light
[arch]: http://archlinuxarm.org/platforms/armv6/raspberry-pi
[raspbian]: http://www.raspbian.org/RaspbianImages
[pi-b]: http://www.raspberrypi.org/products/model-b/
[pi-b-plus]: http://www.raspberrypi.org/products/model-b-plus/
[beagle-black]: http://beagleboard.org/black
[angstrom]: http://www.angstrom-distribution.org
