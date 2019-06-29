'use strict';

(function () {

  var ADS_AMOUNT = 5;

  var PriceLevel = {
    LOW: 10000,
    HIGH: 50000
  };

  var filtersNameMap = {
    'housing-type': 'type',
    'housing-rooms': 'rooms',
    'housing-guests': 'guests'
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

    updateFilterState: function (filter) {
      if (filterState.hasOwnProperty(filter.name) && filter.value === 'any') {
        delete filterState[filter.name];
      } else if (filter.classList.contains('map__filter')) {
        filterState[filter.name] = filter.value;
      } else if (filter.checked) {
        checkedFeatures.push(filter.value);
        filterState[filter.name] = checkedFeatures;
      } else {
        checkedFeatures.splice(checkedFeatures.indexOf(filter.value), 1);
        if (checkedFeatures.length === 0) {
          delete filterState[filter.name];
        } else {
          filterState[filter.name] = checkedFeatures;
        }
      }
    },

    filterAds: function () {
      this.filteredAds = this.ads
        .filter(function (ad) {
          var isProperAd = true;
          for (var filter in filterState) {
            if (filterState.hasOwnProperty(filter)) {
              if (filter === 'housing-price') {
                isProperAd = checkPrice(ad, filterState[filter]);
              } else if (filter === 'features') {
                isProperAd = checkFeatures(ad);
              } else {
                isProperAd = filterState[filter] === ad.offer[filtersNameMap[filter]].toString();
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
