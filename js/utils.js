'use strict';

(function () {

  var KeyCodes = {
    ESC: 27,
    ENTER: 13
  };

  window.utils = {
    getRandomArrayItem: function (array) {
      return array[Math.floor(Math.random() * array.length)];
    },

    getRandomNumberFromRange: function (min, max) {
      return Math.floor(Math.random() * (max + 1 - min)) + min;
    },

    activateFormFields: function (formFields) {
      formFields.forEach(function (formField) {
        formField.disabled = false;
      });
    },

    deactivateFormFields: function (formFields) {
      formFields.forEach(function (formField) {
        formField.disabled = true;
      });
    },

    onEscPress: function (evt, cb) {
      if (evt.keyCode === KeyCodes.ESC) {
        cb();
      }
    },

    onEnterPress: function (evt, cb) {
      if (evt.keyCode === KeyCodes.ENTER) {
        cb();
      }
    },
  };

})();
