'use strict';

(function () {

  var ADS_AMOUNT = 5;

  var PriceLevel = {
    LOW: 10000,
    HIGH: 50000
  };

  var checkPrice = function (offer, priceLevel) {
    switch (priceLevel) {
      case 'low':
        return offer.price < PriceLevel.LOW;
      case 'middle':
        return (offer.price >= PriceLevel.LOW && offer.price <= PriceLevel.HIGH);
      case 'high':
        return offer.price > PriceLevel.HIGH;
      default:
        return true;
    }
  };

  var checkFeatures = function (offer, checkedFeatures) {
    return checkedFeatures.every(function (feature) {
      return offer.features.includes(feature);
    });
  };

  var checkSimpleProperty = function (offerValue, filterValue) {
    return filterValue === window.filterForm.defaultSelectValue || filterValue === offerValue.toString();
  };

  window.data = {
    ads: [],
    filteredAds: [],

    initAds: function () {
      this.ads = this.ads.filter(function (ad) {
        return ad.hasOwnProperty('offer');
      });
      var shuffledAds = window.utils.shuffleArray(this.ads.slice());
      this.filteredAds = shuffledAds.slice(0, ADS_AMOUNT);
    },

    filterAds: function () {
      var filterState = window.filterForm.state;
      this.filteredAds = this.ads
        .filter(function (ad) {
          var isProperAd = true;
          for (var key in filterState) {
            if (filterState.hasOwnProperty(key)) {
              if (key === 'price') {
                isProperAd = checkPrice(ad.offer, filterState[key]);
              } else if (key === 'features') {
                isProperAd = checkFeatures(ad.offer, filterState[key]);
              } else {
                isProperAd = checkSimpleProperty(ad.offer[key], filterState[key]);
              }

              if (!isProperAd) {
                return false;
              }
            }
          }

          return isProperAd;
        })
        .slice(0, ADS_AMOUNT);
    }
  };

})();
