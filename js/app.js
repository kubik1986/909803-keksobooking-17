'use strict';

(function () {

  var PIN_Y_MIN = 130;
  var PIN_Y_MAX = 630;
  var MAIN_PIN_WIDTH = 65;
  var MAIN_PIN_HEIGHT = 80;

  var isPageActive = false;
  var pinsBlock = document.querySelector('.map__pins');
  var mainPin = document.querySelector('.map__pin--main');
  var mainPinStartPos = {
    left: mainPin.style.left,
    top: mainPin.style.top
  };
  var adFormReset = document.querySelector('.ad-form__reset');
  var filtersForm = document.querySelector('.map__filters');
  var filtersFormFields = filtersForm.querySelectorAll('select, fieldset');

  var PinPositionLimits = {
    minLeft: 0,
    maxLeft: pinsBlock.offsetWidth - MAIN_PIN_WIDTH,
    minTop: PIN_Y_MIN - MAIN_PIN_HEIGHT,
    maxTop: PIN_Y_MAX - MAIN_PIN_HEIGHT
  };

  var onMainPinMousedown = function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();
      if (!isPageActive) {
        activatePage();
      }

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var pinLeft = mainPin.offsetLeft - shift.x;
      var pinTop = mainPin.offsetTop - shift.y;

      if (pinLeft < PinPositionLimits.minLeft) {
        pinLeft = PinPositionLimits.minLeft;
      }
      if (pinLeft > PinPositionLimits.maxLeft) {
        pinLeft = PinPositionLimits.maxLeft;
      }
      if (pinTop < PinPositionLimits.minTop) {
        pinTop = PinPositionLimits.minTop;
      }
      if (pinTop > PinPositionLimits.maxTop) {
        pinTop = PinPositionLimits.maxTop;
      }

      setMainPinPos(pinLeft + 'px', pinTop + 'px');
      window.adForm.setAddress(getMainPinCoordinates());
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      if (isPageActive && window.map.pins.length === 0) {
        window.map.renderPins(window.data.offers);
      }

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  var onAdFormResetClick = function (evt) {
    evt.preventDefault();
    resetPage();
  };

  var getMainPinCoordinates = function (isCenter) {
    var x = Math.round(mainPin.offsetLeft + MAIN_PIN_WIDTH / 2);
    var y;

    if (isCenter === undefined) {
      isCenter = false;
    }
    if (isCenter) {
      y = Math.round(mainPin.offsetTop + MAIN_PIN_WIDTH / 2);
    } else {
      y = Math.round(mainPin.offsetTop + MAIN_PIN_HEIGHT);
    }

    return {
      x: x,
      y: y
    };
  };

  var setMainPinPos = function (left, top) {
    mainPin.style.left = left;
    mainPin.style.top = top;
  };

  var activatePage = function () {
    window.map.activate();
    window.adForm.activate();
    window.data.offers = window.data.getSimilarOffers();
    window.utils.activateFormFields(filtersFormFields);

    adFormReset.addEventListener('click', onAdFormResetClick);

    isPageActive = true;
  };

  var resetPage = function () {
    if (isPageActive) {
      window.map.clearPins();
      filtersForm.reset();
      setMainPinPos(mainPinStartPos.left, mainPinStartPos.top);
      window.scrollTo(0, 0);

      adFormReset.removeEventListener('click', onAdFormResetClick);
    }

    window.map.deactivate();
    window.adForm.deactivate();
    window.adForm.setAddress(getMainPinCoordinates(true));
    window.utils.deactivateFormFields(filtersFormFields);
    isPageActive = false;
  };

  var initPage = function () {
    resetPage();
    mainPin.addEventListener('mousedown', onMainPinMousedown);
  };

  initPage();

})();