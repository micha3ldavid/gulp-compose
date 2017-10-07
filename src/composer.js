
class Composer {

  constructor (config) {
    this.config = config;
    this.events = {};
  }

  on (event, handler) {
    if (!Object.hasOwnProperty(this.events, event)) {
      this.events[event] = [];
    }
    this.events[event].push(handler);
    return this;
  }

  emit (event, ...props) {
    if (Object.hasOwnProperty(this.events, event)) {
      this.events[event].forEach((handler) => {
        handler(...props);
      });
    }
    return this;
  }
}

module.exports = Composer;
