"use strict";

/**
 * @rot-13.js 
 * Encipher and Decipher rot-13 algorithm and rot-5 (for numbers)
 *
 * Create a div container with class .rot-13, and 2 input elements with class .rot-13-input and .rot-13-output respectively.
 * Optional is to add sliders for string cipher shift and numeric cipher shift. Create a div container for each slider.
 * 
 * You can use the constant GLOBAL_INPUT from cipherHelper if you want one input for several ciphers for example
 */
(function ($, cipherHelper) {
  "use strict";

  var c = cipherHelper;
  var ALPHABET = c.alphabet;
  var ALPHALENGTH = c.alphabetLength();
  var DEFAULT_CIPHER = 13;
  var DEFAULT_NRCIPHER = 5;
  var GLOBAL_INPUT = $(c.GLOBAL_INPUT);

  var Rot13 = function Rot13(obj) {
    // If Constructor is called without "new" for instance from a call(), re-cell the constructor with this as obj argument.
    if (!(this instanceof Rot13)) {
      return new Rot13(this);
    }
    // Set the instance to make the instance available in all methods and events.
    var rot13 = $.extend(this, {
      obj: $(obj),
      InputEl: $(".rot-13-input", obj), // mandatory
      OutputEl: $(".rot-13-output", obj), // mandatory
      alphaSliderEl: $(".rot-13-slider-container-a", obj),
      alphaSliderVal: $(".rot-13-slider-a", obj),
      numberSliderEl: $(".rot-13-slider-container-n", obj),
      numberSliderVal: $(".rot-13-slider-n", obj),
      cipherVal: 0,
      nrCipherVal: 0
    });
    return this.init(obj);
  };

  Rot13.prototype = {
    createCipherIndex: function createCipherIndex(index, cipherVal, arrayLength) {
      var cipherIndex = 0;
      if (cipherVal < 0) return parseInt(index) + parseInt(cipherVal) + arrayLength;

      cipherIndex = parseInt(index) + parseInt(cipherVal) - arrayLength;

      if (cipherIndex < 0) cipherIndex = cipherIndex + arrayLength;

      return cipherIndex;
    },
    deCipher: function deCipher(input) {
      var output = "";
      var cipherIndex = 0;

      input = input.toUpperCase();

      for (var i = 0; i < input.length; i++) {
        if (input[i].match(/\d/)) {
          cipherIndex = this.createCipherIndex(input[i], this.nrCipherVal, 10);
          output += cipherIndex;
        } else {
          var index = ALPHABET.indexOf(input[i]);

          if (index !== -1) {
            cipherIndex = this.createCipherIndex(index, this.cipherVal, ALPHALENGTH);
            output += ALPHABET[cipherIndex];
          } else {
            output += input[i];
          }
        }
      }

      return output;
    },
    updatePanels: function updatePanels() {
      var input = $.trim(this.InputEl.val());
      var output = $.trim(this.deCipher(input));

      this.OutputEl.val(output);
    },
    init: function init() {
      var _this = this;

      this.cipherVal = this.alphaSliderVal.val() || DEFAULT_CIPHER;
      this.nrCipherVal = this.numberSliderVal.val() || DEFAULT_NRCIPHER;
      this.InputEl = GLOBAL_INPUT.length > 0 ? GLOBAL_INPUT : this.InputEl;

      if (this.InputEl.val().length > 0) {
        this.updatePanels();
      }

      this.InputEl.bind('input propertychange', function () {
        _this.updatePanels();
      });

      // If elements exist attach to event
      if (this.alphaSliderEl.length > 0) {
        this.alphaSliderEl.on("slidestop", function (event, ui) {
          _this.cipherVal = _this.alphaSliderVal.val();

          _this.updatePanels();
        });
      }

      if (this.numberSliderEl.length > 0) {
        this.numberSliderEl.on("slidestop", function (event, ui) {
          _this.nrCipherVal = _this.numberSliderVal.val();

          _this.updatePanels();
        });
      }
    }
  };

  $('.js-rot-13').each(Rot13);

  return Rot13;
})(jQuery, cipherHelper);

/* Todo:
	negative number shift
*/