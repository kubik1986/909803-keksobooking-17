'use strict';

(function () {

  var LocationLimit = {
    MIN_Y: 170,
    MAX_Y: 700
  }; // Диапазон значения координаты метки Y изменен умышленно по сравнению со значениями в ТЗ, которые не отображают реальное положение горизонта и панели фильтров

  var MainPinSize = {
    WIDTH: 65,
    HEIGHT: 81
  };

  var map = document.querySelector('.map');
  var pinsBlock = map.querySelector('.map__pins');
  var pins = [];
  var activePin = null;
  var isCardRendered = false;

  var mainPin = {
    element: document.querySelector('.map__pin--main'),
    size: MainPinSize,
  };

  mainPin.startPosition = {
    left: mainPin.element.style.left,
    top: mainPin.element.style.top
  };

  mainPin.positionLimit = {
    minLeft: 0,
    maxLeft: pinsBlock.offsetWidth - mainPin.size.WIDTH,
    minTop: LocationLimit.MIN_Y - mainPin.size.HEIGHT,
    maxTop: LocationLimit.MAX_Y - mainPin.size.HEIGHT
  };

  var clientCoordinatesLimit = {
    minX: Math.round(pinsBlock.getBoundingClientRect().left + mainPin.size.WIDTH / 2),
    maxX: Math.round(pinsBlock.getBoundingClientRect().left + pinsBlock.offsetWidth - mainPin.size.WIDTH / 2),
    minY: Math.round(LocationLimit.MIN_Y - mainPin.size.HEIGHT / 2),
    maxY: Math.round(LocationLimit.MAX_Y - mainPin.size.HEIGHT / 2)
  };

  var onMainPinMousedown = function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();
      if (!window.app.isPageActive) {
        window.app.activatePage();
      }

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var pinLeft = mainPin.element.offsetLeft - shift.x;
      var pinTop = mainPin.element.offsetTop - shift.y;

      if (pinLeft < mainPin.positionLimit.minLeft) {
        pinLeft = mainPin.positionLimit.minLeft;
        if (startCoords.x < clientCoordinatesLimit.minX - pageXOffset) {
          startCoords.x = clientCoordinatesLimit.minX - pageXOffset;
        }
      } else if (pinLeft > mainPin.positionLimit.maxLeft) {
        pinLeft = mainPin.positionLimit.maxLeft;
        if (startCoords.x > clientCoordinatesLimit.maxX - pageXOffset) {
          startCoords.x = clientCoordinatesLimit.maxX - pageXOffset;
        }
      }
      if (pinTop < mainPin.positionLimit.minTop) {
        pinTop = mainPin.positionLimit.minTop;
        if (startCoords.y < clientCoordinatesLimit.minY - pageYOffset) {
          startCoords.y = clientCoordinatesLimit.minY - pageYOffset;
        }
      } else if (pinTop > mainPin.positionLimit.maxTop) {
        pinTop = mainPin.positionLimit.maxTop;
        if (startCoords.y > clientCoordinatesLimit.maxY - pageYOffset) {
          startCoords.y = clientCoordinatesLimit.maxY - pageYOffset;
        }
      }

      setMainPinPos(pinLeft + 'px', pinTop + 'px');
      window.adForm.setAddress(window.map.getMainPinCoordinates());
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

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

  var setMainPinPos = function (left, top) {
    mainPin.element.style.left = left;
    mainPin.element.style.top = top;
  };

  var resetActivePin = function () {
    activePin.classList.remove('map__pin--active');
    activePin = null;
  };

  var openCard = function (pinID) {
    var card = window.card.create(window.data.filteredAds[pinID]);
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

    renderPins: function (ads) {
      var fragment = document.createDocumentFragment();

      ads.forEach(function (ad, index) {
        var pinElement = window.pin.create(index, ad);

        fragment.appendChild(pinElement);
        pins.push(pinElement);

        pinElement.addEventListener('click', onPinClick);
      });
      pinsBlock.appendChild(fragment);
    },

    clearPins: function () {
      pins.forEach(function (pin) {
        pin.remove();
      });
      pins = [];
    },

    updatePins: function () {
      var activeElement = document.activeElement;

      window.map.closeCard();
      activeElement.focus();
      window.map.clearPins();
      window.data.filterAds();
      window.map.renderPins(window.data.filteredAds);
    },

    getMainPinCoordinates: function (isCenter) {
      var x = Math.round(mainPin.element.offsetLeft + mainPin.size.WIDTH / 2);
      var y;

      if (isCenter === undefined) {
        isCenter = false;
      }
      if (isCenter) {
        y = Math.round(mainPin.element.offsetTop + mainPin.size.WIDTH / 2);
      } else {
        y = mainPin.element.offsetTop + mainPin.size.HEIGHT;
      }

      return {
        x: x,
        y: y
      };
    },

    resetMainPinPos: function () {
      setMainPinPos(mainPin.startPosition.left, mainPin.startPosition.top);
    },

    closeCard: function () {
      if (isCardRendered) {
        clearCard();
        activePin.focus();
        resetActivePin();
      }
    }
  };

  mainPin.element.addEventListener('mousedown', onMainPinMousedown);

})();
