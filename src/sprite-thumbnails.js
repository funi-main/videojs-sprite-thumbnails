import videojs from 'video.js';

/**
 * Set up sprite thumbnails for a player.
 *
 * @function spriteThumbs
 * @param {Player} player
 *        The current player instance.
 * @param {Object} options
 *        Configuration options.
 */
export default function spriteThumbs(player, options) {
  const url = options.url;
  const height = options.height;
  const width = options.width;
  const responsive = options.responsive;

  const dom = videojs.dom || videojs;
  const controls = player.controlBar;
  const progress = controls.progressControl;
  const seekBar = progress.seekBar;
  const seekBarEl = seekBar.el();
  const mouseTimeDisplay = seekBar.mouseTimeDisplay;

  if (url && height && width && mouseTimeDisplay) {
    const img = dom.createEl('img', {
      src: url
    });

    const tooltipStyle = (obj) => {
      Object.keys(obj).forEach((key) => {
        const val = obj[key];
        const ttstyle = mouseTimeDisplay.timeTooltip.el().style;

        if (val !== '') {
          ttstyle.setProperty(key, val);
        } else {
          ttstyle.removeProperty(key);
        }
      });
    };

    const pad = function(num, size) {
      num = num.toString();
      while (num.length < size) {
        num = '0' + num;
      }
      return num;
    };

    const thumbnailUrl = function(hoverTime, duration) {
      const numberOfSeconds = Math.round(hoverTime);
      const imageNumber = pad(Math.round((numberOfSeconds - 5) / 10), 5);

      return url.replace('00001', imageNumber);
    };

    const hijackMouseTooltip = (evt) => {
      const imgWidth = img.naturalWidth;
      const imgHeight = img.naturalHeight;

      if (player.controls() && imgWidth && imgHeight) {
        let position = dom.getPointerPosition(seekBarEl, evt).x * player.duration();

        position = position / options.interval;

        const playerWidth = player.currentWidth();
        const scaleFactor = responsive && playerWidth < responsive ?
          playerWidth / responsive : 1;
        const scaledWidth = width * scaleFactor;
        const scaledHeight = height * scaleFactor;
        const controlsTop = dom.findPosition(controls.el()).top;
        const seekBarTop = dom.findPosition(seekBarEl).top;
        const thumbnailSrc = thumbnailUrl(position, player.duration(), url);
        // top of seekBar is 0 position
        const topOffset = -scaledHeight - Math.max(0, seekBarTop - controlsTop);

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
