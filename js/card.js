'use strict';

(function () {
  var PhotoSize = {
    WIDTH: 45,
    HEIGHT: 40
  };

  var offerTypesMap = {
    'bungalo': 'Бунгало',
    'flat': 'Квартира',
    'house': 'Дом',
    'palace': 'Дворец'
  };

  var wordsMap = {
    'комната': 'room',
    'гость-родительный': 'guest-genitive'
  };

  var cardTemplate = document.querySelector('#card')
      .content
      .querySelector('.map__card');

  var setFeature = function (featureElement, data) {
    var featureName = featureElement.classList[1].slice(featureElement.classList[1].indexOf('--') + 2);
    if (data.indexOf(featureName) === -1) {
      featureElement.style.display = 'none';
    }
  };

  window.card = {
    create: function (ad) {
      var cardElement = cardTemplate.cloneNode(true);
      var features = cardElement.querySelectorAll('.popup__feature');

      cardElement.querySelector('.popup__avatar').src = ad.author.avatar;
      cardElement.querySelector('.popup__title').textContent = ad.offer.title;
      cardElement.querySelector('.popup__text--address').textContent = ad.offer.address;
      cardElement.querySelector('.popup__text--price').innerHTML = ad.offer.price + '&#x20bd;<span>/ночь</span>';
      cardElement.querySelector('.popup__type').textContent = offerTypesMap[ad.offer.type];
      cardElement.querySelector('.popup__text--capacity').textContent = ad.offer.rooms + ' ' + window.utils.numFormat(ad.offer.rooms, wordsMap['комната']) + ' для ' + ad.offer.guests + ' ' + window.utils.numFormat(ad.offer.guests, wordsMap['гость-родительный']);
      cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;

      if (ad.offer.hasOwnProperty('features') && ad.offer.features.length > 0) {
        features.forEach(function (feature) {
          setFeature(feature, ad.offer.features);
        });
      } else {
        cardElement.querySelector('.popup__features').style.display = 'none';
      }

      if (ad.offer.hasOwnProperty('description') && ad.offer.description.trim() !== '') {
        cardElement.querySelector('.popup__description').textContent = ad.offer.description;
      } else {
        cardElement.querySelector('.popup__description').style.display = 'none';
      }

      if (ad.offer.hasOwnProperty('photos') && ad.offer.photos.length > 0) {
        cardElement.querySelector('.popup__photo').remove();
        var fragment = document.createDocumentFragment();
        ad.offer.photos.forEach(function (photoURL) {
          var photo = document.createElement('img');
          photo.src = photoURL;
          photo.width = PhotoSize.WIDTH;
          photo.height = PhotoSize.HEIGHT;
          photo.alt = 'Фотография жилья';
          photo.classList.add('popup__photo');
          fragment.appendChild(photo);
        });
        cardElement.querySelector('.popup__photos').appendChild(fragment);
      } else {
        cardElement.querySelector('.popup__photos').style.display = 'none';
      }

      return cardElement;
    }
  };

})();
