'use strict';

(function () {

  var ADS_AMOUNT = 5;

  var PriceLevel = {
    LOW: 10000,
    HIGH: 50000
  };

  var filtersNameMap = {
    'housing-type': 'type',
    'housing-price': 'price',
    'housing-rooms': 'rooms',
    'housing-guests': 'guests',
    'features': 'features'
  };

  var filterState;
  var checkedFeatures;

  var checkPrice = function (ad, priceLevel) {
    switch (priceLevel) {
      case 'low':
        return ad.offer.price < PriceLevel.LOW;
      case 'middle':
        return (ad.offer.price >= PriceLevel.LOW && ad.offer.price <= PriceLevel.HIGH);
      case 'high':
        return ad.offer.price > PriceLevel.HIGH;
      default:
        return true;
    }
  };

  var checkFeatures = function (ad) {
    return checkedFeatures.every(function (feature) {
      return ad.offer.features.includes(feature);
    });
  };

  window.data = {
    ads: [],
    filteredAds: [],

    initAds: function () {
      filterState = {};
      checkedFeatures = [];
      this.ads = this.ads.filter(function (ad) {
        return ad.hasOwnProperty('offer');
      });
      var shuffledAds = window.utils.shuffleArray(this.ads.slice());
      this.filteredAds = shuffledAds.slice(0, ADS_AMOUNT);
    },

    updateFilterState: function (target) {
      var filterName = filtersNameMap[target.name];
      if (filterState.hasOwnProperty(filterName) && target.value === 'any') {
        delete filterState[filterName];
      } else if (target.classList.contains('map__filter')) {
        filterState[filterName] = target.value;
      } else if (target.checked) {
        checkedFeatures.push(target.value);
        filterState[filterName] = checkedFeatures;
      } else {
        checkedFeatures.splice(checkedFeatures.indexOf(target.value), 1);
        if (checkedFeatures.length === 0) {
          delete filterState[filterName];
        } else {
          filterState[filterName] = checkedFeatures;
        }
      }
    },

    filterAds: function () {
      this.filteredAds = this.ads
        .filter(function (ad) {
          var isProperAd = true;
          for (var key in filterState) {
            if (filterState.hasOwnProperty(key)) {
              if (key === 'price') {
                isProperAd = checkPrice(ad, filterState[key]);
              } else if (key === 'features') {
                isProperAd = checkFeatures(ad);
              } else {
                isProperAd = filterState[key] === ad.offer[key].toString();
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
