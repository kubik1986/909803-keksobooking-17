'use strict';

;(function () { // eslint-disable-line

  var onAdsLoad = function (ads) {
    window.data.ads = ads;
    window.data.initAds();
    window.map.renderPins(window.data.filteredAds);
    window.filterForm.activate();
  };

  var onAdsError = function (errorText) {
    window.alerts.showError('Не удалось загрузить похожие объявления.<br>' + errorText, function () {
      window.backend.load(onAdsLoad, onAdsError);
    });
  };

  var initPage = function () {
    window.app.resetPage();
    window.filterForm.init();
  };

  window.app = {
    isPageActive: false,

    activatePage: function () {
      window.map.activate();
      window.adForm.activate();
      this.isPageActive = true;
      window.backend.load(onAdsLoad, onAdsError);
    },

    resetPage: function () {
      if (this.isPageActive) {
        window.map.closeCard();
        window.map.clearPins();
        window.map.resetMainPinPos();
        window.scrollTo(0, 0);
      }

      window.map.deactivate();
      window.filterForm.deactivate();
      window.adForm.deactivate();
      window.adForm.setAddress(window.map.getMainPinCoordinates(true));
      this.isPageActive = false;
    }
  };

  initPage();

})();
