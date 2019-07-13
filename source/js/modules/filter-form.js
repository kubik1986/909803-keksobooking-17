'use strict';

;(function () { // eslint-disable-line

  var DEFAULT_SELECT_VALUE = 'any';

  var filtersNameMap = {
    'housing-type': 'type',
    'housing-price': 'price',
    'housing-rooms': 'rooms',
    'housing-guests': 'guests'
  };

  var form = document.querySelector('.map__filters');
  var selects = form.querySelectorAll('select');
  var features = form.querySelectorAll('input[name="features"]');
  var formFields = form.querySelectorAll('select, fieldset');

  var onFormChange = function (key, value) {
    window.filterForm.updateState(key, value);
    window.utils.debounce(window.map.updatePins);
  };

  window.filterForm = {
    defaultSelectValue: DEFAULT_SELECT_VALUE,
    state: {},

    updateState: function (key, value) {
      this.state[key] = value;
    },

    activate: function () {
      window.utils.activateFormFields(formFields);
    },

    deactivate: function () {
      form.reset();
      this.state = {
        type: this.defaultSelectValue,
        price: this.defaultSelectValue,
        rooms: this.defaultSelectValue,
        guests: this.defaultSelectValue,
        features: []
      };
      window.utils.deactivateFormFields(formFields);
    },

    init: function () {
      selects.forEach(function (select) {
        select.addEventListener('change', function () {
          var key = filtersNameMap[select.name];
          var value = select.value;
          onFormChange(key, value);
        });
      });

      features.forEach(function (feature) {
        feature.addEventListener('change', function () {
          var key = 'features';
          var value = window.filterForm.state.features.slice();
          if (feature.checked) {
            value.push(feature.value);
          } else {
            value.splice(value.indexOf(feature.value), 1);
          }
          onFormChange(key, value);
        });
      });
    }
  };

})();
