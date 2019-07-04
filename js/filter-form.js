'use strict';

(function () {

  var filtersNameMap = {
    'housing-type': 'type',
    'housing-price': 'price',
    'housing-rooms': 'rooms',
    'housing-guests': 'guests',
    'features': 'features'
  };

  var filtersForm = document.querySelector('.map__filters');
  var filtersFormFields = filtersForm.querySelectorAll('select, fieldset');

  var onFormChange = function (evt) {
    window.filterForm.updateState(evt.target);
    window.utils.debounce(window.map.updatePins);
  };

  window.filterForm = {
    state: {},
    checkedFeatures: [],

    updateState: function (target) {
      var filterName = filtersNameMap[target.name];
      if (this.state.hasOwnProperty(filterName) && target.value === 'any') {
        delete this.state[filterName];
      } else if (target.classList.contains('map__filter')) {
        this.state[filterName] = target.value;
      } else if (target.checked) {
        this.checkedFeatures.push(target.value);
        this.state[filterName] = this.checkedFeatures;
      } else {
        this.checkedFeatures.splice(this.checkedFeatures.indexOf(target.value), 1);
        if (this.checkedFeatures.length === 0) {
          delete this.state[filterName];
        } else {
          this.state[filterName] = this.checkedFeatures;
        }
      }
    },

    activate: function () {
      this.state = {};
      this.checkedFeatures = [];
      window.utils.activateFormFields(filtersFormFields);

      filtersForm.addEventListener('change', onFormChange);
    },

    deactivate: function () {
      filtersForm.reset();
      window.utils.deactivateFormFields(filtersFormFields);

      filtersForm.removeEventListener('change', onFormChange);
    }
  };

})();
