/*
 * tools/InputManager.js
 * A generic, flexible input handler that binds UI controls to scene-specific callbacks.
 */
export default class InputManager {
  /**
   * @param {object} config
   * @param {object} config.scene      The Phaser scene (optional, for context)
   * @param {object} config.buttons    Map of control names to element IDs
   * @param {function} config.onUp     Callback when Up is pressed/held
   * @param {function} config.onDown   Callback when Down is pressed/held
   * @param {function} config.onLeft   Callback when Left is pressed/held
   * @param {function} config.onRight  Callback when Right is pressed/held
   * @param {function} config.onEnter  Callback when Enter (button1) is tapped
   * @param {function} config.onBack   Callback when Back (button2) is tapped
   */
  constructor({ scene = null, buttons = {}, onUp, onDown, onLeft, onRight, onEnter, onBack } = {}) {
    this.scene = scene;
    this.buttons = Object.assign({
      up: 'btn-up',
      down: 'btn-down',
      left: 'btn-left',
      right: 'btn-right',
      enter: 'button1',
      back: 'button2'
    }, buttons);

    // Assign callbacks with no-ops fallback
    this.onUp = onUp || (() => { });
    this.onDown = onDown || (() => { });
    this.onLeft = onLeft || (() => { });
    this.onRight = onRight || (() => { });
    this.onEnter = onEnter || (() => { });
    this.onBack = onBack || (() => { });

    // Internal state for hold behaviour
    this._holdTimer = null;
    this._repeatInterval = null;
    this._listeners = [];

    // Wire up controls
    this._bindUI();
  }

  _bindUI() {
    // Directional buttons with press-and-hold repeat
    this._addHoldHandler(this.buttons.up, this.onUp);
    this._addHoldHandler(this.buttons.down, this.onDown);
    this._addHoldHandler(this.buttons.left, this.onLeft);
    this._addHoldHandler(this.buttons.right, this.onRight);

    // Enter and Back (tap only)
    this._addTapHandler(this.buttons.enter, this.onEnter);
    this._addTapHandler(this.buttons.back, this.onBack);
  }

  /**
   * Binds press-and-hold behavior to an element.
   */
  _addHoldHandler(elementId, callback) {
    const el = document.getElementById(elementId);
    if (!el) return;

    const start = (e) => {
      e.preventDefault();
      el.classList.add('active');
      callback();
      this._holdTimer = setTimeout(() => {
        this._repeatInterval = setInterval(callback, 220);
      }, 400);
    };
    const end = () => {
      el.classList.remove('active');
      clearTimeout(this._holdTimer);
      clearInterval(this._repeatInterval);
    };

    el.addEventListener('touchstart', start, { passive: false });
    el.addEventListener('touchend', end);
    el.addEventListener('touchcancel', end);

    this._listeners.push({ el, type: 'touchstart', handler: start });
    this._listeners.push({ el, type: 'touchend', handler: end });
    this._listeners.push({ el, type: 'touchcancel', handler: end });
  }

  /**
   * Binds a simple tap (no hold) to an element.
   */
  _addTapHandler(elementId, callback) {
    const el = document.getElementById(elementId);
    if (!el) return;

    const tapStart = (e) => {
      e.preventDefault();
      el.classList.add('active');
      callback();
    };
    const tapEnd = () => el.classList.remove('active');

    el.addEventListener('touchstart', tapStart, { passive: false });
    el.addEventListener('touchend', tapEnd);
    el.addEventListener('touchcancel', tapEnd);

    this._listeners.push({ el, type: 'touchstart', handler: tapStart });
    this._listeners.push({ el, type: 'touchend', handler: tapEnd });
    this._listeners.push({ el, type: 'touchcancel', handler: tapEnd });
  }

  /**
   * Remove all listeners and clear timers.
   */
  destroy() {
    this._listeners.forEach(({ el, type, handler }) => {
      el.removeEventListener(type, handler);
    });
    clearTimeout(this._holdTimer);
    clearInterval(this._repeatInterval);
  }
}
