class SimpleWeatherClock extends HTMLElement {
  set hass(hass) {
    if (!this.cDiv) {
      const styles = `
        <style>
        ha-card {
          display: flex;
          height: 100vh;
          border-width: 0px;
          border-radius: 0px;
          padding: 0px;
          background-color: ${this.config.background};
          justify-content: center;
        }
        
        .card-content {
          width: ${this.config.displaywidth}px;
          height: ${this.config.displayheight}px;
          background-color: ${this.config.background};
          font-family: ${this.config.font}, serif;
          font-weight: ${this.config.fontweight};
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          grid-template-rows: 1fr 1fr;
          gap: 0px 0px;
          grid-auto-flow: row;
          grid-template-areas:
            "clock clock clock"
            "info info info";
          padding-top: ${this.config.offset}px;
        }

        .clock {
          grid-area: clock;
          justify-self: center;
          align-self: baseline;
          color: ${this.config.clockcolor};
          font-size: ${this.config.clockfontsize}px;
          height: 160px;
          padding-top: ${this.config.clockpadding}px;
        }
        
        .info {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          grid-template-rows: 1fr 1fr;
          gap: 0px 0px;
          grid-auto-flow: row;
          grid-template-areas:
            "info-top info-top info-top"
            "info-bottom info-bottom info-bottom";
          grid-area: info;
          padding-left: ${this.config.infopadding}px;
          padding-right: ${this.config.infopadding}px;
          margin-top: ${this.config.infoadjust}px;
        }
        
        .info-top {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          grid-template-rows: 1fr;
          gap: 0px 0px;
          grid-auto-flow: row;
          grid-template-areas:
            "info-top-left info-top-center info-top-right";
          grid-area: info-top;
          margin-top: ${0 + this.config.clockspacing}px;
        }
        
        .info-top-left {
          grid-area: info-top-left;
          justify-self: start;
          align-self: start;
          color: ${this.config.topleftcolor};
          font-size: ${this.config.infofontsize}px;
          padding-top: 30px;
          height: 55px;
        }
        
        .info-top-center {
          grid-area: info-top-center;
          justify-self: center;
          align-self: start;
          color: ${this.config.topcentercolor};
          font-size: ${this.config.infofontsize}px;
          padding-top: 30px;
          height: 55px;
        }
        
        .info-top-right {
          grid-area: info-top-right;
          justify-self: end;
          align-self: start;
          color: ${this.config.toprightcolor};
          font-size: ${this.config.infofontsize}px;
          padding-top: 30px;
          height: 55px;
        }
        
        .info-bottom {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          grid-template-rows: 1fr;
          gap: 0px 0px;
          grid-auto-flow: row;
          grid-template-areas:
            "info-bottom-left info-bottom-center info-bottom-right";
          grid-area: info-bottom;
          margin-top: ${this.config.infobottommargin}px;
        }
        
        .info-bottom-left {
          grid-area: info-bottom-left;
          justify-self: start;
          align-self: start;
          color: ${this.config.bottomleftcolor};
          font-size: ${this.config.infofontsize}px;
          padding-top: 30px;
          height: 55px;
        }
        
        .info-bottom-center {
          grid-area: info-bottom-center;
          justify-self: center;
          align-self: start;
          color: ${this.config.bottomcentercolor};
          font-size: ${this.config.infofontsize}px;
          padding-top: 30px;
          height: 55px;
        }
        
        .info-bottom-right {
          grid-area: info-bottom-right;
          justify-self: end;
          align-self: start;
          color: ${this.config.bottomrightcolor};
          font-size: ${this.config.infofontsize}px;
          padding-top: 30px;
          height: 55px;
        }
        
        small {
          opacity: ${this.config.opacity};
        }
        </style>
        `;
      this.innerHTML = `
         ${styles}
        <ha-card>
          <div class="card-content">
            <div class="clock"></div>
            <div class="info">
              <div class="info-top">
                <div class="info-top-left"></div>
                <div class="info-top-center"></div>
                <div class="info-top-right"></div>
              </div>
              <div class="info-bottom">
                <div class="info-bottom-left"></div>
                <div class="info-bottom-center"></div>
                <div class="info-bottom-right"></div>
              </div>
            </div>
        </ha-card>
      `;
      this.cDiv = this.querySelector('.clock');
      this.tlDiv = this.querySelector('.info-top-left');
      this.tcDiv = this.querySelector('.info-top-center');
      this.trDiv = this.querySelector('.info-top-right');
      this.blDiv = this.querySelector('.info-bottom-left');
      this.bcDiv = this.querySelector('.info-bottom-center');
      this.brDiv = this.querySelector('.info-bottom-right');
    }

    const c = hass.states[this.config.clock].state;
    const tl = this.setStateText(this.config.topleft, hass)
    const tc = this.setStateText(this.config.topcenter, hass);
    const tr = this.setStateText(this.config.topright, hass);
    const bl = this.setStateText(this.config.bottomleft, hass);
    const bc = this.setStateText(this.config.bottomcenter, hass);
    const br = this.setStateText(this.config.bottomright, hass);
    
    this.cDiv.innerHTML = `${c}`;
    this.tlDiv.innerHTML = `${tl}`;
    this.tcDiv.innerHTML = `${tc}`;
    this.trDiv.innerHTML = `${tr}`;
    this.blDiv.innerHTML = `${bl}`;
    this.bcDiv.innerHTML = `${bc}`;
    this.brDiv.innerHTML = `${br}`;
  }
  
  setStateText(entity, hass) {
    if (!entity) {
      return ``
    }
    const pe = hass.states[entity]
    const es = parseFloat(pe.state).toFixed(0);
    const m = pe.attributes.unit_of_measurement || "";
    return `${es}<small>${m}</small>`
  }

  setConfig(config) {
    if (!config.clock) {
      throw new Error('Please define clock entity');
    }

    const dcfs = 260;
    const difs = 85;
    const cp = 100;
    const ip = 15;
    const ibmt = -20;
    var eba = 0;
    const cardConfig = Object.assign({}, config);

    if (!cardConfig.background) cardConfig.background = "#000000";
    if (!cardConfig.font) cardConfig.font = "IBM Plex Mono";
    if (!cardConfig.fontweight) cardConfig.fontweight = 700;
    if (!cardConfig.opacity) cardConfig.opacity = 0.7;
    if (!cardConfig.clockcolor) cardConfig.clockcolor = "#dddddd";
    if (!cardConfig.topleftcolor) cardConfig.topleftcolor = "#008001";
    if (!cardConfig.topcentercolor) cardConfig.topcentercolor = "#fe0000";
    if (!cardConfig.toprightcolor) cardConfig.toprightcolor = "#bdb76b";
    if (!cardConfig.bottomleftcolor) cardConfig.bottomleftcolor = "#008001";
    if (!cardConfig.bottomcentercolor) cardConfig.bottomcentercolor = "#1f90ff";
    if (!cardConfig.bottomrightcolor) cardConfig.bottomrightcolor = "#bdb76b";
    if (!cardConfig.displaywidth) cardConfig.displaywidth = 800;
    if (!cardConfig.displayheight) cardConfig.displayheight = 480;
    if (!cardConfig.offset) cardConfig.offset = 0;
    if (!cardConfig.clockspacing) cardConfig.clockspacing = 0;
    if (!cardConfig.infospacing) cardConfig.infospacing = 0;
    if (!cardConfig.infoedge) {
      cardConfig.infopadding = ip;
    } else {
      cardConfig.infopadding = ip + cardConfig.infoedge
    }
    if (!cardConfig.clockfontsize) {
      cardConfig.clockfontsize = dcfs;
      cardConfig.clockpadding = cp;
    } else {
      const ca = Math.round((cardConfig.clockfontsize - dcfs) / 3.0)
      cardConfig.clockpadding = cp + ca
    }
    if (!cardConfig.infofontsize) {
      cardConfig.infofontsize = difs;
      cardConfig.infoadjust = 0;
    } else {
      cardConfig.infoadjust = Math.round((cardConfig.infofontsize - difs) / 2.0);
      eba = cardConfig.infofontsize - difs;
    }
    cardConfig.infobottommargin = ibmt - eba + cardConfig.infospacing + cardConfig.clockspacing
    
    this.config = cardConfig;
  }

  getCardSize() {
    return 1;
  }
}

customElements.define('simple-weather-clock', SimpleWeatherClock);
window.customCards = window.customCards || [];
window.customCards.push({
  type: "simple-weather-clock",
  name: "Simple Weather Clock",
  description: "Displays a simple weather clock with six slots below it for environmental sensors."
});

