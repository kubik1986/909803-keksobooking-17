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

var map = document.querySelector('.map');
var mapPinsBlock = map.querySelector('.map__pins');
var mapPinsBlockWidth = mapPinsBlock.offsetWidth;
var pinTemplate = document.querySelector('#pin')
    .content
    .querySelector('.map__pin');
var pinXMax = mapPinsBlockWidth - PIN_WIDTH / 2;

var offersData = {
  types: OFFERS_TYPES,
  titles: OFFERS_TITLES,
  pinXMin: PIN_X_MIN,
  pinXMax: pinXMax,
  pinYMin: PIN_Y_MIN,
  pinYMax: PIN_Y_MAX
};

var getRandomArrayItem = function (array) {
  return array[Math.floor(Math.random() * array.length)];
};

var getRandomNumberFromRange = function (min, max) {
  return Math.floor(Math.random() * (max + 1 - min)) + min;
};

var getSimilarOffers = function (amount, data) {
  var result = [];

  for (var i = 0; i < amount; i++) {
    var userID = (i + 1) >= 10 ? i + 1 : '0' + (i + 1);

    result.push({
      'author': {
        'avatar': 'img/avatars/user' + userID + '.png'
      },

      'offer': {
        'type': getRandomArrayItem(data.types),
        'title': getRandomArrayItem(data.titles)
      },

      'location': {
        'x': getRandomNumberFromRange(data.pinXMin, data.pinXMax),
        'y': getRandomNumberFromRange(data.pinYMin, data.pinYMax)
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

  for (var i = 0; i < similarOffers.length; i++) {
    fragment.appendChild(createPin(similarOffers[i]));
  }
  mapPinsBlock.appendChild(fragment);
};

var similarOffers = getSimilarOffers(OFFERS_AMOUNT, offersData);
map.classList.remove('map--faded');
renderPins(similarOffers);
