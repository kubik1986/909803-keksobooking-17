'use strict';

(function () {

  var OFFERS_AMOUNT = 5;

  var isFilterOn = false;

  window.data = {
    offers: [],
    filteredOffers: [],

    filterOffers: function () {
      var result = [];
      var amount = (this.offers.length > OFFERS_AMOUNT) ? OFFERS_AMOUNT : this.offers.length;

      if (!isFilterOn) {
        var shuffledOffers = window.utils.shuffleArray(this.offers);

        for (var i = 0; i < shuffledOffers.length; i++) {
          if (result.length === amount) {
            break;
          }
          if (shuffledOffers[i].hasOwnProperty('offer')) {
            result.push(shuffledOffers[i]);
          }
        }
      }

      this.filteredOffers = result;
    }
  };

})();
