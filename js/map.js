'use strict';

(function () {

  var map = document.querySelector('.map');
  var pinsBlock = map.querySelector('.map__pins');
  var pins = [];
  var activePin = null;
  var isCardRendered = false;

  var onPinClick = function (evt) {
    var pin = evt.currentTarget;

    if (activePin === pin) {
      return;
    }

    if (isCardRendered) {
      clearCard();
      resetActivePin();
    }
    pin.classList.add('map__pin--active');
    activePin = pin;
    openCard(+pin.dataset.id);
  };

  var onCardCloseBtnClick = function () {
    window.map.closeCard();
  };

  var onCardEscPress = function (evt) {
    window.utils.onEscPress(evt, window.map.closeCard);
  };

  var resetActivePin = function () {
    activePin.classList.remove('map__pin--active');
    activePin = null;
  };

  var openCard = function (pinID) {
    var card = window.card.create(window.data.filteredOffers[pinID]);
    map.appendChild(card);
    isCardRendered = true;

    var cardCloseBtn = card.querySelector('.popup__close');

    cardCloseBtn.addEventListener('click', onCardCloseBtnClick);
    document.addEventListener('keydown', onCardEscPress);
  };

  var clearCard = function () {
    map.querySelector('.map__card').remove();
    isCardRendered = false;

    document.removeEventListener('keydown', onCardEscPress);
  };

  window.map = {
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

      pins = pinsBlock.querySelectorAll('.map__pin:not([class$="main"])');
      pins.forEach(function (pin) {
        pin.addEventListener('click', onPinClick);
      });
    },

    clearPins: function () {
      var last = pinsBlock.lastChild;

      for (var i = 0; i < pins.length; i++) {
        pinsBlock.removeChild(last);
        last = pinsBlock.lastChild;
      }
      pins = [];
    },

    closeCard: function () {
      if (isCardRendered) {
        clearCard();
        activePin.focus();
        resetActivePin();
      }
    }
  };

})();
