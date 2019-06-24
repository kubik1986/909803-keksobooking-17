'use strict';

(function () {

  var pinTemplate = document.querySelector('#pin')
      .content
      .querySelector('.map__pin');

  window.pin = {
    create: function (id, offer) {
      var pinElement = pinTemplate.cloneNode(true);
      var img = pinElement.querySelector('img');

      pinElement.dataset.id = id;
      pinElement.style.left = offer.location.x + 'px';
      pinElement.style.top = offer.location.y + 'px';
      pinElement.style.transform = 'translate(-50%, -100%)';
      img.src = offer.author.avatar;
      img.alt = offer.offer.title;

      return pinElement;
    }
  };

})();
