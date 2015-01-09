# Build Light

Monitor the status of your continuous integration server with a Raspberry Pi
powered traffic light. Build Light will regularly poll your CI server to check
the status of yours jobs and update the color of the light accordingly:

- **Red** - One or more builds has failed.
- **Yellow** - One or more jobs is currently building.
- **Green** - All jobs have successful builds.



## Supported Environments

Build Light has been with the following software and hardware.

### Continuous Integration Servers 

- [Jenkins][jenkins]

### Hardware 

- [Raspberry Pi Model B][pi-b]
- [Raspberry Pi Model B+][pi-b-plus]

### Operating Systems

- [Arch Linux ARM][arch]
- [Raspbian][raspbian]


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

|      Variable      |               Description               |       Default Value       |
|--------------------|-----------------------------------------|---------------------------|
| `JENKINS_BASE_URL` | The base URL of your Jenkins CI server. | https://builds.apache.org |
| `CHECK_INTERVAL`   | The polling interval, in seconds.       | 900 *(15 minutes)*        |

In addition, the following variables may need to be adjusted based upon the
physical wiring of your Raspberry Pi:

|       Variable      |                         Description                         | Default Value |
|---------------------|-------------------------------------------------------------|---------------|
| `PIN_NUMBER_RED`    | The GPIO pin that will be used to control the red light.    | [17][gpio-17] |
| `PIN_NUMBER_YELLOW` | The GPIO pin that will be used to control the yellow light. | [27][gpio-27] |
| `PIN_NUMBER_GREEN`  | The GPIO pin that will be used to control the green light.  | [22][gpio-22] |


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

The build-light installation at [Toolhouse][th]:
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
