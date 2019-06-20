'use strict';

var OFFERS_AMOUNT = 8;
var OFFERS_TYPES = [
  'palace',
  'flat',
  'house',
  'bungalo'
];
var OFFERS_TITLES = [
  'Роскошный дворец в классическом японском стиле',
  'Прекрасно сохранившийся дворец эпохи Мэйдзи',
  'Уютная квартира в тихом районе',
  'Просторная квартира в деловом районе',
  'Одноэтажный дом для небольшой семьи',
  'Двухэтажный дом с гаражом и земельным участком',
  'Бунгало для большой компании',
  'Бунгало прямо на берегу залива'
];
var PIN_WIDTH = 50;
var PIN_X_MIN = PIN_WIDTH / 2;
var PIN_Y_MIN = 130;
var PIN_Y_MAX = 630;
var MAIN_PIN_WIDTH = 65;
var MAIN_PIN_HEIGHT = 80;

var isPageActive = false;
var map = document.querySelector('.map');
var offers = [];
var pins = [];
var pinsBlock = map.querySelector('.map__pins');
var pinsBlockWidth = pinsBlock.offsetWidth;
var mainPin = pinsBlock.querySelector('.map__pin--main');
var mainPinStartPos = {
  left: mainPin.style.left,
  top: mainPin.style.top
};
var pinTemplate = document.querySelector('#pin')
    .content
    .querySelector('.map__pin');
var pinXMax = pinsBlockWidth - PIN_WIDTH / 2;
var adForm = document.querySelector('.ad-form');
var adFormFields = adForm.querySelectorAll('fieldset');
var adFormAddressInput = adForm.querySelector('#address');
var adFormTypeInput = adForm.querySelector('#type');
var adFormPriceInput = adForm.querySelector('#price');
var adFormTimeinSelect = adForm.querySelector('#timein');
var adFormTimeoutSelect = adForm.querySelector('#timeout');
var adFormRoomNumberSelect = adForm.querySelector('#room_number');
var adFormCapacitySelect = adForm.querySelector('#capacity');
var adFormReset = adForm.querySelector('.ad-form__reset');
var filtersForm = document.querySelector('.map__filters');
var filtersFormFields = filtersForm.querySelectorAll('select, fieldset');

var OffersMinPrices = {
  'bungalo': 0,
  'flat': 1000,
  'house': 5000,
  'palace': 10000
};

var PinPositionLimits = {
  minLeft: 0,
  maxLeft: pinsBlockWidth - MAIN_PIN_WIDTH,
  minTop: PIN_Y_MIN - MAIN_PIN_HEIGHT,
  maxTop: PIN_Y_MAX - MAIN_PIN_HEIGHT
};

var getRandomArrayItem = function (array) {
  return array[Math.floor(Math.random() * array.length)];
};

var getRandomNumberFromRange = function (min, max) {
  return Math.floor(Math.random() * (max + 1 - min)) + min;
};

var getSimilarOffers = function (amount) {
  var result = [];

  for (var i = 0; i < amount; i++) {
    var userID = (i + 1) >= 10 ? i + 1 : '0' + (i + 1);

    result.push({
      'author': {
        'avatar': 'img/avatars/user' + userID + '.png'
      },

      'offer': {
        'type': getRandomArrayItem(OFFERS_TYPES),
        'title': getRandomArrayItem(OFFERS_TITLES)
      },

      'location': {
        'x': getRandomNumberFromRange(PIN_X_MIN, pinXMax),
        'y': getRandomNumberFromRange(PIN_Y_MIN, PIN_Y_MAX)
      }
    });
  }

  return result;
};

var createPin = function (similarOffer) {
  var pinElement = pinTemplate.cloneNode(true);
  var img = pinElement.querySelector('img');

  pinElement.style.left = similarOffer.location.x + 'px';
  pinElement.style.top = similarOffer.location.y + 'px';
  pinElement.style.transform = 'translate(-50%, -100%)';
  img.src = similarOffer.author.avatar;
  img.alt = similarOffer.offer.title;

  return pinElement;
};

var renderPins = function (similarOffers) {
  var fragment = document.createDocumentFragment();

  similarOffers.forEach(function (offer) {
    fragment.appendChild(createPin(offer));
  });
  pinsBlock.appendChild(fragment);

  return pinsBlock.querySelectorAll('.map__pin:not([class$="main"])');
};

var clearPins = function () {
  var last = pinsBlock.lastChild;

  for (var i = 0; i < pins.length; i++) {
    pinsBlock.removeChild(last);
    last = pinsBlock.lastChild;
  }
  pins = [];
};

var activateForm = function (formFields) {
  formFields.forEach(function (formField) {
    formField.disabled = false;
  });
};

var deactivateForm = function (formFields) {
  formFields.forEach(function (formField) {
    formField.disabled = true;
  });
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

var setAdFormAddress = function (pinCoordinates) {
  adFormAddressInput.value = pinCoordinates.x + ', ' + pinCoordinates.y;
};

var setAdFormPrice = function (value) {
  adFormPriceInput.min = OffersMinPrices[value];
  adFormPriceInput.placeholder = OffersMinPrices[value];
};

var setAdFormTimes = function (value) {
  adFormTimeinSelect.value = value;
  adFormTimeoutSelect.value = value;
};

var setAdFormCapacity = function (roomNumber) {
  var options = adFormCapacitySelect.options;

  if (+roomNumber < 100) {
    Array.prototype.forEach.call(options, function (option) {
      option.disabled = (+option.value > +roomNumber || +option.value === 0) ? true : false;
    });
  } else {
    Array.prototype.forEach.call(options, function (option) {
      option.disabled = (+option.value > 0) ? true : false;
    });
  }
  setAdFormCapacityValidity();
};

var setAdFormCapacityValidity = function () {
  var selectedOption = adFormCapacitySelect.options[adFormCapacitySelect.selectedIndex];

  if (selectedOption.disabled) {
    adFormCapacitySelect.setCustomValidity('Укажите подходящее количество мест');
  } else {
    adFormCapacitySelect.setCustomValidity('');
  }
};

var adFormInit = function () {
  setAdFormAddress(getMainPinCoordinates(true));
  setAdFormPrice(adFormTypeInput.value);
  setAdFormTimes(adFormTimeinSelect.value);
  setAdFormCapacity(adFormRoomNumberSelect.value);
  setAdFormCapacityValidity();
};

var activatePage = function () {
  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');
  activateForm(adFormFields);
  offers = getSimilarOffers(OFFERS_AMOUNT);
  activateForm(filtersFormFields);
  isPageActive = true;

  adForm.addEventListener('change', onAdFormChange);
  adFormReset.addEventListener('click', onAdFormResetClick);
};

var setMainPinPos = function (left, top) {
  mainPin.style.left = left;
  mainPin.style.top = top;
};

var resetPage = function () {
  if (isPageActive) {
    clearPins();
    adForm.reset();
    filtersForm.reset();
    setMainPinPos(mainPinStartPos.left, mainPinStartPos.top);
    offers = [];
    window.scrollTo(0, 0);

    adForm.removeEventListener('change', onAdFormChange);
    adFormReset.removeEventListener('click', onAdFormResetClick);
  }

  map.classList.add('map--faded');
  adForm.classList.add('ad-form--disabled');
  adFormInit();
  deactivateForm(adFormFields);
  deactivateForm(filtersFormFields);
  isPageActive = false;
};

var initPage = function () {
  resetPage();
  mainPin.addEventListener('mousedown', onMainPinMousedown);
};

var onMainPinMousedown = function (evt) {
  evt.preventDefault();

  var isDragged = false;
  var startCoords = {
    x: evt.clientX,
    y: evt.clientY
  };

  var onMouseMove = function (moveEvt) {
    moveEvt.preventDefault();
    isDragged = true;

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
    if (isPageActive) {
      setAdFormAddress(getMainPinCoordinates());
    } else {
      setAdFormAddress(getMainPinCoordinates(true));
    }
  };

  var onMouseUp = function (upEvt) {
    upEvt.preventDefault();

    if (!isPageActive && isDragged) {
      activatePage();
    }

    if (isPageActive) {
      setAdFormAddress(getMainPinCoordinates());

      if (pins.length === 0) {
        pins = renderPins(offers);
      }
    }

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
};

var onAdFormChange = function (evt) {
  var target = evt.target;

  switch (target.id) {
    case 'type':
      setAdFormPrice(target.value);
      break;
    case 'timein':
    case 'timeout':
      setAdFormTimes(target.value);
      break;
    case 'room_number':
      setAdFormCapacity(target.value);
      break;
    case 'capacity':
      setAdFormCapacityValidity();
  }
};

var onAdFormResetClick = function (evt) {
  evt.preventDefault();
  resetPage();
};

initPage();
