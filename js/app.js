'use strict';

(function () {

  var LocationLimit = {
    MIN_Y: 170,
    MAX_Y: 700
  };
  // Диапазон значения координаты метки Y изменен умышленно по сравнению со значениями в ТЗ, которые не отображают реальное положение горизонта и панели фильтров
  var MainPinSize = {
    WIDTH: 65,
    HEIGHT: 80
  };

  var isPageActive = false;
  var pinsBlock = document.querySelector('.map__pins');
  var mainPin = document.querySelector('.map__pin--main');

  var MainPinStartPos = {
    LEFT: mainPin.style.left,
    TOP: mainPin.style.top
  };

  var PinPositionLimit = {
    MIN_LEFT: 0,
    MAX_LEFT: pinsBlock.offsetWidth - MainPinSize.WIDTH,
    MIN_TOP: LocationLimit.MIN_Y - MainPinSize.HEIGHT,
    MAX_TOP: LocationLimit.MAX_Y - MainPinSize.HEIGHT
  };

  var ClientCoordinatesLimit = {
    MIN_X: pinsBlock.getBoundingClientRect().left + MainPinSize.WIDTH / 2,
    MAX_X: pinsBlock.getBoundingClientRect().left + pinsBlock.offsetWidth - MainPinSize.WIDTH / 2,
    MIN_Y: pinsBlock.getBoundingClientRect().top + LocationLimit.MIN_Y - MainPinSize.HEIGHT / 2,
    MAX_Y: pinsBlock.getBoundingClientRect().top + LocationLimit.MAX_Y - MainPinSize.HEIGHT / 2
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
        window.backend.load(onAdsLoad, onAdsError);
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

      if (pinLeft < PinPositionLimit.MIN_LEFT) {
        pinLeft = PinPositionLimit.MIN_LEFT;
        if (startCoords.x < ClientCoordinatesLimit.MIN_X - pageXOffset) {
          startCoords.x = ClientCoordinatesLimit.MIN_X - pageXOffset;
        }
      }
      if (pinLeft > PinPositionLimit.MAX_LEFT) {
        pinLeft = PinPositionLimit.MAX_LEFT;
        if (startCoords.x > ClientCoordinatesLimit.MAX_X - pageXOffset) {
          startCoords.x = ClientCoordinatesLimit.MAX_X - pageXOffset;
        }
      }
      if (pinTop < PinPositionLimit.MIN_TOP) {
        pinTop = PinPositionLimit.MIN_TOP;
        if (startCoords.y < ClientCoordinatesLimit.MIN_Y - pageYOffset) {
          startCoords.y = ClientCoordinatesLimit.MIN_Y - pageYOffset;
        }
      }
      if (pinTop > PinPositionLimit.MAX_TOP) {
        pinTop = PinPositionLimit.MAX_TOP;
        if (startCoords.y > ClientCoordinatesLimit.MAX_Y - pageYOffset) {
          startCoords.y = ClientCoordinatesLimit.MAX_Y - pageYOffset;
        }
      }

      setMainPinPos(pinLeft + 'px', pinTop + 'px');
      window.adForm.setAddress(getMainPinCoordinates());
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  var onAdsLoad = function (ads) {
    window.data.ads = ads;
    window.data.initAds();
    window.map.renderPins(window.data.filteredAds);
    window.filterForm.activate();
  };

  var onAdsError = function (errorText) {
    window.alerts.showError('Не удалось загрузить похожие объявления.<br>' + errorText, function () {
      window.backend.load(onAdsLoad, onAdsError);
    });
  };

  var getMainPinCoordinates = function (isCenter) {
    var x = Math.round(mainPin.offsetLeft + MainPinSize.WIDTH / 2);
    var y;

    if (isCenter === undefined) {
      isCenter = false;
    }
    if (isCenter) {
      y = Math.round(mainPin.offsetTop + MainPinSize.WIDTH / 2);
    } else {
      y = Math.round(mainPin.offsetTop + MainPinSize.HEIGHT);
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

    isPageActive = true;
  };

  var initPage = function () {
    window.resetPage();
    mainPin.addEventListener('mousedown', onMainPinMousedown);
    window.filterForm.init();
  };

  window.resetPage = function () {
    if (isPageActive) {
      window.map.closeCard();
      window.map.clearPins();
      setMainPinPos(MainPinStartPos.LEFT, MainPinStartPos.TOP);
      window.scrollTo(0, 0);
    }

    window.map.deactivate();
    window.filterForm.deactivate();
    window.adForm.deactivate();
    window.adForm.setAddress(getMainPinCoordinates(true));

    isPageActive = false;
  };

  initPage();

})();
