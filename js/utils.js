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

    shuffleArray: function (array) {
      for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[j];
        array[j] = array[i];
        array[i] = temp;
      }

      return array;
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
        evt.preventDefault();
        cb();
      }
    },

    onEnterPress: function (evt, cb) {
      if (evt.keyCode === KeyCodes.ENTER) {
        cb();
      }
    }
  };

})();
