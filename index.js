class EventEmitter {
  constructor() {
    this._listeningTo = new Map();
    this._listeners = new Map();
  }

  listenTo(obj, evt, listener, ctx) {
    let sym = this._listeningTo.get(obj) || Symbol();
    let listenerMap = obj._listeners || (obj._listeners = new Map());
    let events = listenerMap.get(sym);
    if (!events) {
      events = {};
      listenerMap.set(sym, events);
    }

    let listenerObj = {
      fn: listener,
      ctx: ctx
    };

    /*jshint expr: true*/
    (events[evt] && events[evt].listeners.push(listenerObj)) || (events[evt] = {
      listeners: [listenerObj]
    });

    this._listeningTo.set(obj, sym);

    return this;
  }

  _removeListener(events, evt, listener) {
    if (events && events[evt]) {
      let i = events[evt].listeners.findIndex(listener);
      if (i !== -1) events[evt].listeners.splice(i, 1);
    }
  }

  stopListening(obj, evt, listener) {
    if (listener) {
      let events = this._listeningTo.get(obj).events;
      this._removeListener(events, evt, listener);

      return this;
    }

    if (evt) {
      let sym = this._listeningTo.get(obj);
      if (sym) {
        let events = obj._listeners.get(sym);
        if (events && events[evt]) delete events[evt];
      }

      return this;
    }

    if (obj) {
      let sym = this._listeningTo.get(obj);
      if (sym) obj._listeners.delete(sym);
      this._listeningTo.delete(obj);

      return this;
    }

    this._listeningTo.forEach((sym, obj) => {
      if (obj._listeners.delete(sym));
    });
    this._listeningTo = new Map();

    return this;
  }

  trigger(evt, ...args) {
    for (let eventMap of this._listeners.values()) {
      let ev = eventMap[evt];
      if (ev) ev.listeners.forEach(listener => {
        listener.fn.call(listener.ctx || null, ...args);
      });
    }

    return this;
  }

  listenToOnce(obj, evt, listener, ctx) {
    this.listenTo(obj, evt, (...args) => {
      listener.call(ctx || null, ...args);
      this.stopListening(obj, evt);
    }, ctx);
  }
}

module.exports = EventEmitter;