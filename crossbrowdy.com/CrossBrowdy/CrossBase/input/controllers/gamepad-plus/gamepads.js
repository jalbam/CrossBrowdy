(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Gamepads = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _libGamepadsJs = require('./lib/gamepads.js');

var _libGamepadsJs2 = _interopRequireDefault(_libGamepadsJs);

exports['default'] = _libGamepadsJs2['default'];
module.exports = exports['default'];

},{"./lib/gamepads.js":3}],2:[function(require,module,exports){
/**
 * A simple event-emitter class. Like Node's but much simpler.
 */

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EventEmitter = (function () {
  function EventEmitter() {
    _classCallCheck(this, EventEmitter);

    this._listeners = {};
  }

  _createClass(EventEmitter, [{
    key: "emit",
    value: function emit(name) {
      var _this = this;

      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      // console.log('emit', name, args, this._listeners);
      (this._listeners[name] || []).forEach(function (func) {
        return func.apply(_this, args);
      });
      return this;
    }
  }, {
    key: "on",
    value: function on(name, func) {
      if (name in this._listeners) {
        this._listeners[name].push(func);
      } else {
        this._listeners[name] = [func];
      }
      return this;
    }
  }, {
    key: "off",
    value: function off(name) {
      if (name) {
        this._listeners[name] = [];
      } else {
        this._listeners = {};
      }
      return this;
    }
  }]);

  return EventEmitter;
})();

exports["default"] = EventEmitter;
module.exports = exports["default"];

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _event_emitterJs = require('./event_emitter.js');

var _event_emitterJs2 = _interopRequireDefault(_event_emitterJs);

var _utilsJs = require('./utils.js');

var _utilsJs2 = _interopRequireDefault(_utilsJs);

var utils = new _utilsJs2['default']();

var DEFAULT_CONFIG = {
  'axisThreshold': 0.15,
  'gamepadAttributesEnabled': true,
  'gamepadIndicesEnabled': true,
  'keyEventsEnabled': true,
  'nonstandardEventsEnabled': true,
  'indices': undefined,
  'keyEvents': undefined
};

var DEFAULT_STATE = {
  // The standard gamepad has 4 axes and 17 buttons.
  // Some gamepads have 5-6 axes and 18-20 buttons.
  buttons: new Array(20),
  axes: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
};

for (var i = 0; i < 20; i++) {
  DEFAULT_STATE.buttons[i] = {
    pressed: false,
    value: 0.0
  };
}

var Gamepads = (function (_EventEmitter) {
  _inherits(Gamepads, _EventEmitter);

  function Gamepads(config) {
    var _this = this;

    _classCallCheck(this, Gamepads);

    _get(Object.getPrototypeOf(Gamepads.prototype), 'constructor', this).call(this);

    this.polyfill();

    //this._gamepadApis = ['getGamepads', 'webkitGetGamepads', 'webkitGamepads'];
    this._gamepadDOMEvents = ['gamepadconnected', 'gamepaddisconnected'];
    this._gamepadInternalEvents = ['gamepadconnected', 'gamepaddisconnected', 'gamepadbuttondown', 'gamepadbuttonup', 'gamepadaxismove'];
    this._seenEvents = {};

    this.dataSource = this.getGamepadDataSource();
    this.gamepadsSupported = this._hasGamepads();
    this.indices = {};
    this.keyEvents = {};
    this.previousState = {};
    this.state = {};

    // Mark the events we see (keyed off gamepad index)
    // so we don't fire the same event twice.
    this._gamepadDOMEvents.forEach(function (eventName) {
      window.addEventListener(eventName, function (e) {
        _this.addSeenEvent(e.gamepad, eventName, 'dom');

        // Let the events fire again, if they've been disconnected/reconnected.
        if (eventName === 'gamepaddisconnected') {
          _this.removeSeenEvent(e.gamepad, 'gamepadconnected', 'dom');
        } else if (eventName === 'gamepadconnected') {
          _this.removeSeenEvent(e.gamepad, 'gamepaddisconnected', 'dom');
        }
      });
    });
    this._gamepadInternalEvents.forEach(function (eventName) {
      _this.on(eventName, function (gamepad) {
        _this.addSeenEvent(gamepad, eventName, 'internal');

        if (eventName === 'gamepaddisconnected') {
          _this.removeSeenEvent(gamepad, 'gamepadconnected', 'internal');
        } else {
          _this.removeSeenEvent(gamepad, 'gamepaddisconnected', 'internal');
        }
      });
    });

    config = config || {};
    Object.keys(DEFAULT_CONFIG).forEach(function (key) {
      _this[key] = typeof config[key] === 'undefined' ? DEFAULT_CONFIG[key] : utils.clone(config[key]);
    });

    if (this.gamepadIndicesEnabled) {
      this.on('gamepadconnected', this._onGamepadConnected.bind(this));
      this.on('gamepaddisconnected', this._onGamepadDisconnected.bind(this));
      this.on('gamepadbuttondown', this._onGamepadButtonDown.bind(this));
      this.on('gamepadbuttonup', this._onGamepadButtonUp.bind(this));
      this.on('gamepadaxismove', this._onGamepadAxisMove.bind(this));
    }
  }

  /**
   * Make gamepads API support check static
   * @returns {string[]}
   */

  _createClass(Gamepads, [{
    key: 'polyfill',
    value: function polyfill() {
      if (this._polyfilled) {
        return;
      }

      if (!('performance' in window)) {
        window.performance = {};
      }

      if (!('now' in window.performance)) {
        window.performance.now = function () {
          return +new Date();
        };
      }

      if (!('GamepadButton' in window)) {
        var GamepadButton = window.GamepadButton = function (obj) {
          return {
            pressed: obj.pressed,
            value: obj.value
          };
        };
      }

      this._polyfilled = true;
    }
  }, {
    key: '_getVendorProductIds',
    value: function _getVendorProductIds(gamepad) {
      var bits = gamepad.id.split('-');
      var match;

      if (bits.length < 2) {
        match = gamepad.id.match(/vendor: (\w+) product: (\w+)/i);
        if (match) {
          return match.slice(1).map(utils.stripLeadingZeros);
        }
      }

      match = gamepad.id.match(/(\w+)-(\w+)/);
      if (match) {
        return match.slice(1).map(utils.stripLeadingZeros);
      }

      return bits.slice(0, 2).map(utils.stripLeadingZeros);
    }

    /**
     * Make gamepads API support static
     * @returns {boolean}
     */
  }, {
    key: '_hasGamepads',
    value: function _hasGamepads() {
      return Gamepads.hasGamepads();
    }
  }, {
    key: '_getGamepads',
    value: function _getGamepads() {
      return Gamepads.getGamepads();
    }
  }, {
    key: 'updateGamepad',
    value: function updateGamepad(gamepad) {
      this.previousState[gamepad.index] = utils.clone(this.state[gamepad.index] || DEFAULT_STATE);
      this.state[gamepad.index] = gamepad ? utils.clone(gamepad) : DEFAULT_STATE;

      // Fire connection event, if gamepad was actually connected.
      this.fireConnectionEvent(this.state[gamepad.index], true);
    }
  }, {
    key: 'removeGamepad',
    value: function removeGamepad(gamepad) {
      delete this.state[gamepad.index];

      // Fire disconnection event.
      this.fireConnectionEvent(gamepad, false);
    }
  }, {
    key: 'observeButtonChanges',
    value: function observeButtonChanges(gamepad) {
      var _this2 = this;

      var previousPad = this.previousState[gamepad.index];
      var currentPad = this.state[gamepad.index];

      if (!previousPad || !Object.keys(previousPad).length || !currentPad || !Object.keys(currentPad).length) {
        return;
      }

      currentPad.buttons.forEach(function (button, buttonIdx) {
        if (button.value !== previousPad.buttons[buttonIdx].value) {
          // Fire button events.
          _this2.fireButtonEvent(currentPad, buttonIdx, button.value);

          // Fire synthetic keyboard events, if needed.
          _this2.fireKeyEvent(currentPad, buttonIdx, button.value);
        }
      });
    }
  }, {
    key: 'observeAxisChanges',
    value: function observeAxisChanges(gamepad) {
      var _this3 = this;

      var previousPad = this.previousState[gamepad.index];
      var currentPad = this.state[gamepad.index];

      if (!previousPad || !Object.keys(previousPad).length || !currentPad || !Object.keys(currentPad).length) {
        return;
      }

      currentPad.axes.forEach(function (axis, axisIdx) {
        // Fire axis events.
        if (axis !== previousPad.axes[axisIdx]) {
          _this3.fireAxisMoveEvent(currentPad, axisIdx, axis);
        }
      });
    }

    /**
     * @function
     * @name Gamepads#update
     * @description
     *   Update the current and previous states of the gamepads.
     *   This must be called every frame for events to work.
     */
  }, {
    key: 'update',
    value: function update() {
      var _this4 = this;

      var activePads = {};

      this.poll().forEach(function (pad) {
        // Keep track of which gamepads are still active (not disconnected).
        activePads[pad.index] = true;

        // Add/update connected gamepads
        // (and fire internal events + polyfilled events, if needed).
        _this4.updateGamepad(pad);

        // Never seen this actually be the case, but if a pad is still in the
        // `navigator.getGamepads()` list and it's disconnected, emit the event.
        if (!pad.connected) {
          _this4.removeGamepad(_this4.state[padIdx]);
        }

        // Fire internal events + polyfilled non-standard events, if needed.
        _this4.observeButtonChanges(pad);
        _this4.observeAxisChanges(pad);
      });

      Object.keys(this.state).forEach(function (padIdx) {
        if (!(padIdx in activePads)) {
          // Remove disconnected gamepads
          // (and fire internal events + polyfilled events, if needed).
          _this4.removeGamepad(_this4.state[padIdx]);
        }
      });
    }

    /**
     * @function
     * @name Gamepads#getGamepadDataSource
     * @description Get gamepad data source (e.g., linuxjoy, hid, dinput, xinput).
     * @returns {String} A string of gamepad data source.
     */
  }, {
    key: 'getGamepadDataSource',
    value: function getGamepadDataSource() {
      var dataSource;
      if (navigator.platform.match(/^Linux/)) {
        dataSource = 'linuxjoy';
      } else if (navigator.platform.match(/^Mac/)) {
        dataSource = 'hid';
      } else if (navigator.platform.match(/^Win/)) {
        var m = navigator.userAgent.match('Gecko/(..)');
        if (m && parseInt(m[1]) < 32) {
          dataSource = 'dinput';
        } else {
          dataSource = 'hid';
        }
      }
      return dataSource;
    }

    /**
     * @function
     * @name Gamepads#poll
     * @description Poll for the latest data from the gamepad API.
     * @returns {Array} An array of gamepads and mappings for the model of the connected gamepad.
     * @example
     *   var gamepads = new Gamepads();
     *   var pads = gamepads.poll();
     */
  }, {
    key: 'poll',
    value: function poll() {
      var pads = [];

      if (this.gamepadsSupported) {
        var padsRaw = this._getGamepads();
        var pad;

        for (var i = 0, len = padsRaw.length; i < len; i++) {
          pad = padsRaw[i];

          if (!pad) {
            continue;
          }

          pad = this.extend(pad);

          pads.push(pad);
        }
      }

      return pads;
    }

    /**
     * @function
     * @name Gamepads#extend
     * @description Set new properties on a gamepad object.
     * @param {Object} gamepad The original gamepad object.
     * @returns {Object} An extended copy of the gamepad.
     */
  }, {
    key: 'extend',
    value: function extend(gamepad) {
      if (gamepad._extended) {
        return gamepad;
      }

      var pad = utils.clone(gamepad);

      pad._extended = true;

      if (this.gamepadAttributesEnabled) {
        pad.attributes = this._getAttributes(pad);
      }

      if (!pad.timestamp) {
        pad.timestamp = window.performance.now();
      }

      if (this.gamepadIndicesEnabled) {
        pad.indices = this._getIndices(pad);
      }

      return pad;
    }

    /**
     * @function
     * @name Gamepads#_getAttributes
     * @description Generate and return the attributes of a gamepad.
     * @param {Object} gamepad The gamepad object.
     * @returns {Object} The attributes for this gamepad.
     */
  }, {
    key: '_getAttributes',
    value: function _getAttributes(gamepad) {
      var padIds = this._getVendorProductIds(gamepad);
      return {
        vendorId: padIds[0],
        productId: padIds[1],
        name: gamepad.id,
        dataSource: this.dataSource
      };
    }

    /**
     * @function
     * @name Gamepads#_getIndices
     * @description Return the named indices of a gamepad.
     * @param {Object} gamepad The gamepad object.
     * @returns {Object} The named indices for this gamepad.
     */
  }, {
    key: '_getIndices',
    value: function _getIndices(gamepad) {
      return this.indices[gamepad.id] || this.indices.standard || {};
    }

    /**
     * @function
     * @name Gamepads#_mapAxis
     * @description Set the value for one of the analogue axes of the pad.
     * @param {Number} axis The button to get the value of.
     * @returns {Number} The value of the axis between -1 and 1.
     */
  }, {
    key: '_mapAxis',
    value: function _mapAxis(axis) {
      if (Math.abs(axis) < this.axisThreshold) {
        return 0;
      }

      return axis;
    }

    /**
     * @function
     * @name Gamepads#_mapButton
     * @description Set the value for one of the buttons of the pad.
     * @param {Number} button The button to get the value of.
     * @returns {Object} An object resembling a `GamepadButton` object.
     */
  }, {
    key: '_mapButton',
    value: function _mapButton(button) {
      if (typeof button === 'number') {
        // Old versions of the API used to return just numbers instead
        // of `GamepadButton` objects.
        button = new GamepadButton({
          pressed: button === 1,
          value: button
        });
      }

      return button;
    }
  }, {
    key: 'setIndices',
    value: function setIndices(indices) {
      this.indices = utils.clone(indices);
    }
  }, {
    key: 'fireConnectionEvent',
    value: function fireConnectionEvent(gamepad, connected) {
      var name = connected ? 'gamepadconnected' : 'gamepaddisconnected';

      if (!this.hasSeenEvent(gamepad, name, 'internal')) {
        // Fire internal event.
        this.emit(name, gamepad);
      }

      // Don't fire the 'gamepadconnected'/'gamepaddisconnected' events if the
      // browser has already fired them. (Unfortunately, we can't feature detect
      // if they'll get fired.)
      if (!this.hasSeenEvent(gamepad, name, 'dom')) {
        var data = {
          bubbles: false,
          cancelable: false,
          detail: {
            gamepad: gamepad
          }
        };

        utils.triggerEvent(window, name, data);
      }
    }
  }, {
    key: 'fireButtonEvent',
    value: function fireButtonEvent(gamepad, button, value) {
      var name = value === 1 ? 'gamepadbuttondown' : 'gamepadbuttonup';

      // Fire internal event.
      this.emit(name, gamepad, button, value);

      if (this.nonstandardEventsEnabled && !('GamepadButtonEvent' in window)) {
        var data = {
          bubbles: false,
          cancelable: false,
          detail: {
            button: button,
            gamepad: gamepad
          }
        };
        utils.triggerEvent(window, name, data);
      }
    }
  }, {
    key: 'fireAxisMoveEvent',
    value: function fireAxisMoveEvent(gamepad, axis, value) {
      var name = 'gamepadaxismove';

      // Fire internal event.
      this.emit(name, gamepad, axis, value);

      if (!this.nonstandardEventsEnabled || 'GamepadAxisMoveEvent' in window) {
        return;
      }

      if (Math.abs(value) < this.axisThreshold) {
        return;
      }

      var data = {
        bubbles: false,
        cancelable: false,
        detail: {
          axis: axis,
          gamepad: gamepad,
          value: value
        }
      };
      utils.triggerEvent(window, name, data);
    }
  }, {
    key: 'fireKeyEvent',
    value: function fireKeyEvent(gamepad, button, value) {
      if (!this.keyEventsEnabled || !this.keyEvents) {
        return;
      }

      var buttonName = utils.swap(gamepad.indices)[button];

      if (typeof buttonName === 'undefined') {
        return;
      }

      var names = value === 1 ? ['keydown', 'keypress'] : ['keyup'];
      var data = this.keyEvents[buttonName];

      if (!data) {
        return;
      }

      if (!('bubbles' in data)) {
        data.bubbles = true;
      }
      if (!data.detail) {
        data.detail = {};
      }
      data.detail.button = button;
      data.detail.gamepad = gamepad;

      names.forEach(function (name) {
        utils.triggerEvent(data.target || document.activeElement, name, data);
      });
    }
  }, {
    key: 'addSeenEvent',
    value: function addSeenEvent(gamepad, eventType, namespace) {
      var key = [gamepad.index, eventType, namespace].join('.');

      this._seenEvents[key] = true;
    }
  }, {
    key: 'hasSeenEvent',
    value: function hasSeenEvent(gamepad, eventType, namespace) {
      var key = [gamepad.index, eventType, namespace].join('.');

      return !!this._seenEvents[key];
    }
  }, {
    key: 'removeSeenEvent',
    value: function removeSeenEvent(gamepad, eventType, namespace) {
      var key = [gamepad.index, eventType, namespace].join('.');

      delete this._seenEvents[key];
    }
  }, {
    key: 'buttonEvent2axisEvent',
    value: function buttonEvent2axisEvent(e) {
      if (e.type === 'gamepadbuttondown') {
        e.axis = e.button;
        e.value = 1.0;
      } else if (e.type === 'gamepadbuttonup') {
        e.axis = e.button;
        e.value = 0.0;
      }
      return e;
    }

    /**
     * Returns whether a `button` index equals the supplied `key`.
     *
     * Useful for determining whether ``navigator.getGamepads()[0].buttons[`$button`]``
     * has any bindings defined (in `FrameManager`).
     *
     * @param {Number} button Index of gamepad button (e.g., `4`).
     * @param {String} key Human-readable format for button binding (e.g., 'b4').
     */
  }, {
    key: '_buttonDownEqualsKey',
    value: function _buttonDownEqualsKey(button, key) {
      return 'b' + button + '.down' === key.trim().toLowerCase();
    }
  }, {
    key: '_buttonUpEqualsKey',
    value: function _buttonUpEqualsKey(button, key) {
      var keyClean = key.trim().toLowerCase();
      return 'b' + button + '.up' === keyClean || 'b' + button === keyClean;
    }

    /**
     * Returns whether an `axis` index equals the supplied `key`.
     *
     * Useful for determining whether ``navigator.getGamepads()[0].axes[`$button`]``
     * has any bindings defined (in `FrameManager`).
     *
     * @param {Number} button Index of gamepad axis (e.g., `1`).
     * @param {String} key Human-readable format for button binding (e.g., 'a1').
     */
  }, {
    key: '_axisMoveEqualsKey',
    value: function _axisMoveEqualsKey(axis, key) {
      return 'a' + axis === key.trim().toLowerCase();
    }

    /**
     * Calls any bindings defined for 'connected' (in `FrameManager`).
     *
     * (Called by event listener for `gamepadconnected`.)
     *
     * @param {Gamepad} gamepad Gamepad object (after it's been wrapped by gamepad-plus).
     */
  }, {
    key: '_onGamepadConnected',
    value: function _onGamepadConnected(gamepad) {
      if ('connected' in gamepad.indices) {
        gamepad.indices.connected(gamepad);
      }
    }

    /**
     * Calls any bindings defined for 'disconnected' (in `FrameManager`).
     *
     * (Called by event listener for `gamepadconnected`.)
     *
     * @param {Gamepad} gamepad Gamepad object (after it's been wrapped by gamepad-plus).
     */
  }, {
    key: '_onGamepadDisconnected',
    value: function _onGamepadDisconnected(gamepad) {
      if ('disconnected' in gamepad.indices) {
        gamepad.indices.disconnected(gamepad);
      }
    }

    /**
     * Calls any bindings defined for buttons (e.g., 'b4.up' in `FrameManager`).
     *
     * (Called by event listener for `gamepadconnected`.)
     *
     * @param {Gamepad} gamepad Gamepad object (after it's been wrapped by gamepad-plus).
     * @param {Number} button Index of gamepad button (integer) being pressed
     *                        (per `gamepadbuttondown` event).
     */
  }, {
    key: '_onGamepadButtonDown',
    value: function _onGamepadButtonDown(gamepad, button) {
      for (var key in gamepad.indices) {
        if (this._buttonDownEqualsKey(button, key)) {
          gamepad.indices[key](gamepad, button);
        }
      }
    }

    /**
     * Calls any bindings defined for buttons (e.g., 'b4.down' in `FrameManager`).
     *
     * (Called by event listener for `gamepadconnected`.)
     *
     * @param {Gamepad} gamepad Gamepad object (after it's been wrapped by gamepad-plus).
     * @param {Number} button Index of gamepad button (integer) being released
     *                        (per `gamepadbuttonup` event).
     */
  }, {
    key: '_onGamepadButtonUp',
    value: function _onGamepadButtonUp(gamepad, button) {
      for (var key in gamepad.indices) {
        if (this._buttonUpEqualsKey(button, key)) {
          gamepad.indices[key](gamepad, button);
        }
      }
    }

    /**
     * Calls any bindings defined for axes (e.g., 'a1' in `FrameManager`).
     *
     * (Called by event listener for `gamepadaxismove`.)
     *
     * @param {Gamepad} gamepad Gamepad object (after it's been wrapped by gamepad-plus).
     * @param {Number} axis Index of gamepad axis (integer) being changed
     *                      (per `gamepadaxismove` event).
     * @param {Number} value Value of gamepad axis (from -1.0 to 1.0) being
     *                       changed (per `gamepadaxismove` event).
     */
  }, {
    key: '_onGamepadAxisMove',
    value: function _onGamepadAxisMove(gamepad, axis, value) {
      for (var key in gamepad.indices) {
        if (this._axisMoveEqualsKey(axis, key)) {
          gamepad.indices[key](gamepad, axis, value);
        }
      }
    }
  }], [{
    key: 'hasGamepads',
    value: function hasGamepads() {
      for (var i = 0, len = Gamepads.gamepadApis.length; i < len; i++) {
        if (Gamepads.gamepadApis[i] in navigator) {
          return true;
        }
      }
      return false;
    }

    /**
     * Make gamepads API support static
     * @returns {*}
     */
  }, {
    key: 'getGamepads',
    value: function getGamepads() {
      for (var i = 0, len = Gamepads.gamepadApis.length; i < len; i++) {
        if (Gamepads.gamepadApis[i] in navigator) {
          return navigator[Gamepads.gamepadApis[i]]();
        }
      }
      return [];
    }
  }, {
    key: 'gamepadApis',
    get: function get() {
      return ['getGamepads', 'webkitGetGamepads', 'webkitGamepads'];
    }
  }]);

  return Gamepads;
})(_event_emitterJs2['default']);

exports['default'] = Gamepads;

Gamepads.utils = utils;
module.exports = exports['default'];

},{"./event_emitter.js":2,"./utils.js":4}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Utils = (function () {
  function Utils() {
    _classCallCheck(this, Utils);

    this.browser = this.getBrowser();
    this.engine = this.getEngine(this.browser);
  }

  _createClass(Utils, [{
    key: 'clone',
    value: function clone(obj) {
      if (obj === null || typeof obj === 'function' || !(obj instanceof Object)) {
        return obj;
      }

      var ret = '';

      if (obj instanceof Date) {
        ret = new Date();
        ret.setTime(obj.getTime());
        return ret;
      }

      if (obj instanceof Array) {
        ret = [];
        for (var i = 0, len = obj.length; i < len; i++) {
          ret[i] = this.clone(obj[i]);
        }
        return ret;
      }

      if (obj instanceof Object) {
        ret = {};
        for (var attr in obj) {
          if (attr in obj) {
            ret[attr] = this.clone(obj[attr]);
          }
        }
        return ret;
      }

      throw new Error('Unable to clone object of unexpected type!');
    }
  }, {
    key: 'swap',
    value: function swap(obj) {
      var ret = {};
      for (var attr in obj) {
        if (attr in obj) {
          ret[obj[attr]] = attr;
        }
      }
      return ret;
    }
  }, {
    key: 'getBrowser',
    value: function getBrowser() {
      if (typeof window === 'undefined') {
        return;
      }

      if (!!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0) {
        // Opera 8.0+ (UA detection to detect Blink/v8-powered Opera).
        return 'opera';
      } else if ('chrome' in window) {
        // Chrome 1+.
        return 'chrome';
      } else if (typeof InstallTrigger !== 'undefined') {
        // Firefox 1.0+.
        return 'firefox';
      } else if (Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0) {
        // At least Safari 3+: "[object HTMLElementConstructor]".
        return 'safari';
      } else if ( /*@cc_on!@*/false || !!document.documentMode) {
        // At least IE6.
        return 'ie';
      }
    }
  }, {
    key: 'getEngine',
    value: function getEngine(browser) {
      browser = browser || this.getBrowser();

      if (browser === 'firefox') {
        return 'gecko';
      } else if (browser === 'opera' || browser === 'chrome' || browser === 'safari') {
        return 'webkit';
      } else if (browser === 'ie') {
        return 'trident';
      }
    }
  }, {
    key: 'stripLeadingZeros',
    value: function stripLeadingZeros(str) {
      if (typeof str !== 'string') {
        return str;
      }
      return str.replace(/^0+(?=\d+)/g, '');
    }
  }, {
    key: 'triggerEvent',
    value: function triggerEvent(el, name, data) {
      data = data || {};
      data.detail = data.detail || {};

      var event;

      if ('CustomEvent' in window) {
        event = new CustomEvent(name, data);
      } else {
        event = document.createEvent('CustomEvent');
        event.initCustomEvent(name, data.bubbles, data.cancelable, data.detail);
      }

      Object.keys(data.detail).forEach(function (key) {
        event[key] = data.detail[key];
      });

      el.dispatchEvent(event);
    }
  }]);

  return Utils;
})();

exports['default'] = Utils;
module.exports = exports['default'];

},{}]},{},[1])(1)
});