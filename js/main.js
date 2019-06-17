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
var filtersForm = document.querySelector('.map__filters');
var filtersFormFields = filtersForm.querySelectorAll('select, fieldset');

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

var clearPins = function (pinsCol) {
  var last = pinsBlock.lastChild;

  for (var i = 0; i < pinsCol.length; i++) {
    pinsBlock.removeChild(last);
    last = pinsBlock.lastChild;
  }
  pinsCol = [];
};

var activateForm = function (formFields) {
  formFields.forEach(function (formField) {
    formField.removeAttribute('disabled');
  });
};

var deactivateForm = function (formFields) {
  formFields.forEach(function (formField) {
    formField.setAttribute('disabled', '');
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

var activatePage = function () {
  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');
  activateForm(adFormFields);
  pins = renderPins(getSimilarOffers(OFFERS_AMOUNT));
  activateForm(filtersFormFields);
  isPageActive = true;
};

var onMainPinMouseup = function () {
  if (!isPageActive) {
    activatePage();
  }

  setAdFormAddress(getMainPinCoordinates());
};

var setMainPinPos = function (left, top) {
  mainPin.style.left = left;
  mainPin.style.top = top;
};

var resetPage = function () {
  if (isPageActive) {
    clearPins(pins);
    adForm.reset();
    filtersForm.reset();
    setMainPinPos(mainPinStartPos.left, mainPinStartPos.top);
  }

  map.classList.add('map--faded');
  adForm.classList.add('ad-form--disabled');
  deactivateForm(adFormFields);
  deactivateForm(filtersFormFields);
  setAdFormAddress(getMainPinCoordinates(true));
  isPageActive = false;

  mainPin.addEventListener('mouseup', onMainPinMouseup);
};

resetPage();
