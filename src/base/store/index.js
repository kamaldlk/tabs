const stores = {};
class Store {
  state = {};
  listeners = {};
  constructor(state) {
    this.state = state;
  }

  _isEqual(key, val) {
    let oldVal = this.state[key];
    return oldVal === val;
  }

  _notify(key) {
    let listeners = this.listeners[key] || [];
    listeners.forEach(listener => {
      listener(this.state[key]);
    });
  }

  update(key, val) {
    if (this._isEqual(key, val)) {
      console.log('values are equal so skipping change');
      return;
    }
    this.state[key] = val;
    this._notify(key);
  }

  get(key) {
    return this.state[key];
  }

  observe(key, cb) {
    let listeners = this.listeners[key] || [];
    listeners.push(cb);
    this.listeners[key] = listeners;
  }

  destroy(key, cb) {
    let listeners = this.listeners[key];
    let index = cb ? listeners.indexOf(cb) : listeners = [];
    if (index !== -1) {
      listeners.splice(index, 1);
    }
  }
}


export const StoreProvider = {
  createStore(name, state) {
    let store = stores[name] || new Store(state);
    stores[name] = store;
    return store;
  },
  getStore(name) {
    return stores[name];
  },
  destroy(name) {
    stores[name] = null;
  }
};