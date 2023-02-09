# Simple Weather Clock
A card for Home Assistant designed to display a digital clock with six slots below for various numeric environmental sensor data.  This card is meant to be used on a dashboard configured as a panel.

**Installation**
You should install this card using HACS.

**Options**

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| type | string | **Required** | `custom:simple-weather-clock`
| clock | string | **Required** | sensor with the time
| topleft | string |  | sensor to show in top left slot
| topcenter | string |  | sensor to show in top center slot
| topright | string |  | sensor to show in top right slot
| bottomleft | string |  | sensor to show in bottom left slot
| bottomcenter | string |  | sensor to show in bottom center slot
| bottomright | string |  | sensor to show in bottom right slot
| background | string | #000000 | CSS color for background
| font | string | IBM Plex Mono | font to use (must be installed as a resource, otherwise generic serif font is used)
| fontweight | integer | 700 | CSS font-weight for clock and slots
| opacity | float | 0.7 | opacity for measurement display in the slots
| clockcolor | string | #dddddd | CSS color for clock digits
| topleftcolor | string | #008001 | CSS color for top left slot
| topcentercolor | string | #fe0000 | CSS color for top center slot
| toprightcolor | string | #bdb76b | CSS color for top center slot
| bottomleftcolor | string | #008001 | CSS color for bottom left slot
| bottomcentercolor | string | #1f90ff | CSS color for bottom center slot
| bottomrightcolor | string | #bdb76b | CSS color for bottom center slot
| displaywidth | string | 800px | width of display on which this will be displayed
| displayheight | string | 480px | height of display on which this will be displayed
| offset | string | 0px | change vertical position of card
| clockspacing | string | 0px | change space between clock and info slots
| infospacing | string | 0px | change space between info rows
| infoedge | string | 0px | change space between edge of display and edge of info slots

The defaults are set for a RaspberryPi 7" touch display.  If you change the display width and height, you'll want to adjust the font sizes to fit.  The card will do some amount of automatic respacing based on font size, but you can also manually fine tune it as needed with the other options.

**Example**

```yaml
- type: custom:simple-weather-clock
  clock: sensor.normaltime
  topleft: sensor.temp_outdoor
  bottomleft: sensor.humidity_outdoor
  topcenter: sensor.openweathermap_forecast_temperature
  bottomcenter: sensor.openweathermap_forecast_temperature_low
  topright: sensor.temp_livingroom
  bottomright: sensor.humidity_livingroom
```

**Advaned Example**
You can use something like the [config-template-card](https://github.com/iantrich/config-template-card) to have one clock card for multiple clocks showing slightly different information.

```yaml
type: custom:config-template-card
variables:
  currentUser: user.name
  whichSensor: |
    theuser => {
      if (theuser == 'Bedroom Clock') {
        return ['sensor.temp_bedroom', 'sensor.humidity_bedroom']
      }
      else if (theuser == 'Study Clock') {
        return ['sensor.temp_study', 'sensor.humidity_study']
      }
      return ['sensor.temp_livingroom', 'sensor.humidity_livingroom']
    }
entities:
  - sensor.normaltime
  - sensor.temp_outdoor
  - sensor.humidity_outdoor
  - sensor.openweathermap_forecast_temperature
  - sensor.openweathermap_forecast_temperature_low
  - ${ whichSensor(currentUser)[0] }
  - ${ whichSensor(currentUser)[1] }
card:
  type: custom:simple-weather-clock
  clock: sensor.normaltime
  topleft: sensor.temp_outdoor
  bottomleft: sensor.humidity_outdoor
  topcenter: sensor.openweathermap_forecast_temperature
  bottomcenter: sensor.openweathermap_forecast_temperature_low
  topright: ${ whichSensor(currentUser)[0] }
  bottomright: ${whichSensor(currentUser)[1] }
```