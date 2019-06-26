'use strict';

(function () {

  var map = document.querySelector('.map');
  var pinsBlock = map.querySelector('.map__pins');

  window.map = {
    pins: [],

    activate: function () {
      map.classList.remove('map--faded');
    },

    deactivate: function () {
      map.classList.add('map--faded');
    },

    renderPins: function (offers) {
      var fragment = document.createDocumentFragment();

      for (var i = 0; i < offers.length; i++) {
        fragment.appendChild(window.pin.create(i, offers[i]));
      }
      pinsBlock.appendChild(fragment);

      this.pins = pinsBlock.querySelectorAll('.map__pin:not([class$="main"])');
    },

    clearPins: function () {
      var last = pinsBlock.lastChild;

      for (var i = 0; i < this.pins.length; i++) {
        pinsBlock.removeChild(last);
        last = pinsBlock.lastChild;
      }
      this.pins = [];
    }
  };

})();
