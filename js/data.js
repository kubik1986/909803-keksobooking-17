'use strict';

(function () {

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

  var pinXMax = document.querySelector('.map__pins').offsetWidth - PIN_WIDTH / 2;

  window.data = {
    offers: [],

    getSimilarOffers: function () {
      var result = [];

      for (var i = 0; i < OFFERS_AMOUNT; i++) {
        var userID = (i + 1) >= 10 ? i + 1 : '0' + (i + 1);

        result.push({
          'author': {
            'avatar': 'img/avatars/user' + userID + '.png'
          },

          'offer': {
            'type': window.utils.getRandomArrayItem(OFFERS_TYPES),
            'title': window.utils.getRandomArrayItem(OFFERS_TITLES)
          },

          'location': {
            'x': window.utils.getRandomNumberFromRange(PIN_X_MIN, pinXMax),
            'y': window.utils.getRandomNumberFromRange(PIN_Y_MIN, PIN_Y_MAX)
          }
        });
      }

      return result;
    }
  };

})();
