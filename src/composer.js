
function hasOwn (who, prop) {
  return Object.hasOwnProperty.call(who, prop);
}

class Composer {

  constructor (config) {
    this.config = config;
    this.events = {};
  }

  on (type, handler) {
    if (!hasOwn(this.events, type)) {
      this.events[type] = [];
    }
    this.events[type].push(handler);
    return this;
  }

  has (type) {
    return hasOwn(this.events, type)
      && this.events[type].length > 0;
  }

  off (type, handler) {
    if (hasOwn(this.events, type)) {
      if (handler) {
        this.events[type] = this.events[type].filter((boundHandler) => {
          return boundHandler !== handler;
        });
      }
      else {
        this.events[type] = [];
      }
    }
    return this;
  }

  emit (type, props) {
    if (hasOwn(this.events, type)) {
      this.events[type].forEach((handler) => {
        handler(props);
      });
    }
    return this;
  }
}

module.exports = Composer;
