/*! @name videojs-sprite-thumbnails @version 0.5.3 @license MIT */
'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var videojs = _interopDefault(require('video.js'));

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

/**
 * Set up sprite thumbnails for a player.
 *
 * @function spriteThumbs
 * @param {Player} player
 *        The current player instance.
 * @param {Object} options
 *        Configuration options.
 */

function spriteThumbs(player, options) {
  var url = options.url;
  var height = options.height;
  var width = options.width;
  var responsive = options.responsive;
  var dom = videojs.dom || videojs;
  var controls = player.controlBar;
  var progress = controls.progressControl;
  var seekBar = progress.seekBar;
  var seekBarEl = seekBar.el();
  var mouseTimeDisplay = seekBar.mouseTimeDisplay;

  if (url && height && width && mouseTimeDisplay) {
    var img = dom.createEl('img', {
      src: url
    });

    var tooltipStyle = function tooltipStyle(obj) {
      Object.keys(obj).forEach(function (key) {
        var val = obj[key];
        var ttstyle = mouseTimeDisplay.timeTooltip.el().style;

        if (val !== '') {
          ttstyle.setProperty(key, val);
        } else {
          ttstyle.removeProperty(key);
        }
      });
    };

    var pad = function pad(num, size) {
      num = num.toString();

      while (num.length < size) {
        num = "0" + num;
      }

      return num;
    };

    var thumbnailUrl = function thumbnailUrl(hoverTime, duration) {
      var numberOfSeconds = Math.round(hoverTime);
      var imageNumber = pad(Math.round((numberOfSeconds - 5) / 10), 5);
      return url.replace('00000', imageNumber);
    };

    var hijackMouseTooltip = function hijackMouseTooltip(evt) {
      var imgWidth = img.naturalWidth;
      var imgHeight = img.naturalHeight;

      if (player.controls() && imgWidth && imgHeight) {
        var position = dom.getPointerPosition(seekBarEl, evt).x * player.duration();
        position = position / options.interval;
        var playerWidth = player.currentWidth();
        var scaleFactor = responsive && playerWidth < responsive ? playerWidth / responsive : 1;
        var scaledWidth = width * scaleFactor;
        var scaledHeight = height * scaleFactor;
        var controlsTop = dom.findPosition(controls.el()).top;
        var seekBarTop = dom.findPosition(seekBarEl).top;
        var thumbnailSrc = thumbnailUrl(position, player.duration(), url); // top of seekBar is 0 position

        var topOffset = -scaledHeight - Math.max(0, seekBarTop - controlsTop);
        tooltipStyle({
          'width': scaledWidth + 'px',
          'height': scaledHeight + 'px',
          'background-image': 'url(' + thumbnailSrc + ')',
          'background-repeat': 'no-repeat',
          'background-size': 'cover',
          'top': topOffset + 'px',
          'color': '#fff',
          'text-shadow': '1px 1px #000',
          'border': '1px solid #000',
          'margin': '0 1px'
        });
      }
    };

    tooltipStyle({
      'width': '',
      'height': '',
      'background-image': '',
      'background-repeat': '',
      'background-position': '',
      'background-size': '',
      'top': '',
      'color': '',
      'text-shadow': '',
      'border': '',
      'margin': ''
    });
    progress.on('mousemove', hijackMouseTooltip);
    progress.on('touchmove', hijackMouseTooltip);
    player.addClass('vjs-sprite-thumbnails');
  }
}

var version = "0.5.3";

var Plugin = videojs.getPlugin('plugin');
/**
 * Default plugin options
 *
 * @param {String} url
 *        Sprite location. Must be set by user.
 * @param {Integer} width
 *        Width in pixels of a thumbnail. Must be set by user.
 * @param {Integer} height
 *        Height in pixels of a thumbnail. Must be set by user.
 * @param {Number} interval
 *        Interval between thumbnail frames in seconds. Default: 1.
 * @param {Integer} responsive
 *        Width of player below which thumbnails are reponsive. Default: 600.
 */

var defaults = {
  url: '',
  width: 0,
  height: 0,
  interval: 1,
  responsive: 600
};
/**
 * An advanced Video.js plugin. For more information on the API
 *
 * See: https://blog.videojs.com/feature-spotlight-advanced-plugins/
 */

var SpriteThumbnails = /*#__PURE__*/function (_Plugin) {
  _inheritsLoose(SpriteThumbnails, _Plugin);

  /**
   * Create a SpriteThumbnails plugin instance.
   *
   * @param  {Player} player
   *         A Video.js Player instance.
   *
   * @param  {Object} [options]
   *         An optional options object.
   */
  function SpriteThumbnails(player, options) {
    var _this;

    // the parent class will add player under this.player
    _this = _Plugin.call(this, player) || this;
    _this.options = videojs.mergeOptions(defaults, options);

    _this.player.ready(function () {
      spriteThumbs(_this.player, _this.options);
    });

    return _this;
  }

  return SpriteThumbnails;
}(Plugin); // Define default values for the plugin's `state` object here.


SpriteThumbnails.defaultState = {}; // Include the version number.

SpriteThumbnails.VERSION = version; // Register the plugin with video.js.

videojs.registerPlugin('spriteThumbnails', SpriteThumbnails);

module.exports = SpriteThumbnails;
