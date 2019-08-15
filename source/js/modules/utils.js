'use strict';

(function () {

  var DEBOUNCE_INTERVAL = 500;

  var KeyCode = {
    ESC: 27,
    ENTER: 13
  };

  var PluralFormsChangingNumber = {
    FIRST: 1,
    SECOND: 2,
    THIRD: 5,
    REPEAT: 19
  };

  var wordsMap = {
    'room': ['комната', 'комнаты', 'комнат'],
    'guest-genitive': ['гостя', 'гостей', 'гостей']
  };

  var lastTimeout;

  window.utils = {
    shuffleArray: function (array) {
      for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[j];
        array[j] = array[i];
        array[i] = temp;
      }

      return array;
    },

    pluralize: function (num, word) {
      var result = '';
      if (!wordsMap.hasOwnProperty(word)) {
        return result;
      }

      var count = num % 100;
      if (count > PluralFormsChangingNumber.REPEAT) {
        count = count % 10;
      }
      if (count === PluralFormsChangingNumber.FIRST) {
        result = wordsMap[word][0];
      } else if (count >= PluralFormsChangingNumber.SECOND && count < PluralFormsChangingNumber.THIRD) {
        result = wordsMap[word][1];
      } else {
        result = wordsMap[word][2];
      }

      return result;
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
      if (evt.keyCode === KeyCode.ESC) {
        evt.preventDefault();
        cb();
      }
    },

    debounce: function (cb) {
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(cb, DEBOUNCE_INTERVAL);
    }
  };

})();
