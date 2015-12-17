class EventEmitter {
  constructor() {
    this._listeningTo = new Map();
    this._listeners = new Map();
  }

  /**
   * Listens to events on an obj with optional ctx.
   * @param  {object} obj      The object to listen to.
   * @param  {string} evt      The name of the event.
   * @param  {function} listener The callback function.
   * @param  {object} ctx      Optional. Object to use as context for the listener.
   * @return {EventEmitter}
   * @api public
   */
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
    (events[evt] && events[evt].push(listenerObj)) || (events[evt] = [listenerObj]);

    this._listeningTo.set(obj, sym);

    return this;
  }

  /**
   * Internal method to find and remove a listener.
   * @param  {object} events   A hash of events and their listener
   * @param  {string} evt      Name of the event who's listeners we're looking up.
   * @param  {function} listener The listener function to remove.@constructor
   */
  _removeListener(events, evt, listener) {
    if (events && events[evt]) {
      let i = -1;
      events[evt].forEach((l, index) => {
        if (Object.is(listener, l.fn)) i = index;
      });
      if (i !== -1) events[evt].splice(i, 1);
    }
  }

  /**
   * Remove all listeners, all listeners from single object, single event
   * or just one listener.
   * @param  {object} obj      The object to remove listeners from.
   * @param  {string} evt      The name of the event.
   * @param  {function} listener The listener function to remove.
   * @return {EventEmitter}
   */
  stopListening(obj, evt, listener) {
    let sym = this._listeningTo.get(obj);

    if (sym) {
      if (listener || evt) {
        let events = obj._listeners.get(sym);
        if (listener) {
          this._removeListener(events, evt, listener);
        } else {
          if (events && events[evt]) delete events[evt];
        }
        return this;
      }

      if (obj) {
        obj._listeners.delete(sym);
        this._listeningTo.delete(obj);

        return this;
      }
    }

    this._listeningTo.forEach((sym, obj) => {
      if (obj._listeners.delete(sym));
    });
    this._listeningTo = new Map();

    return this;
  }

  /**
   * Trigger an event on the current object.
   * @param  {string}    evt  The name of the event.
   * @param  {...Array} args Any arguments to forward to the listeners.
   * @return {EventEmitter}
   */
  trigger(evt, ...args) {
    for (let eventMap of this._listeners.values()) {
      let ev = eventMap[evt];
      if (ev) ev.forEach(listener => {
        listener.fn.call(listener.ctx || null, ...args);
      });
    }

    return this;
  }

  /**
   * Like listenTo, but will unbind the listener once the callback has been
   * invoked once.
   * @param  {object} obj      The object to listen to.
   * @param  {string} evt      The name of the event.
   * @param  {function} listener The callback function.
   * @param  {object} ctx      Optional. Object to use as context for the callback.
   * @return {EventEmitter}
   */
  listenToOnce(obj, evt, listener, ctx) {
    return this.listenTo(obj, evt, (...args) => {
      listener.call(ctx, ...args);
      this.stopListening(obj, evt);
    }, ctx);
  }
}

module.exports = EventEmitter;