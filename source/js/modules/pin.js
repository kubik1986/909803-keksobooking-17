'use strict';

;(function () { // eslint-disable-line

  var pinTemplate = document.querySelector('#pin')
      .content
      .querySelector('.map__pin');

  window.pin = {
    create: function (id, ad) {
      var pinElement = pinTemplate.cloneNode(true);
      var img = pinElement.querySelector('img');

      pinElement.dataset.id = id;
      pinElement.style.left = ad.location.x + 'px';
      pinElement.style.top = ad.location.y + 'px';
      pinElement.style.transform = 'translate(-50%, -100%)';
      img.src = ad.author.avatar;
      img.alt = ad.offer.title;

      return pinElement;
    }
  };

})();
