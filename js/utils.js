'use strict';

(function () {

  var KeyCode = {
    ESC: 27,
    ENTER: 13
  };

  var wordsMap = {
    'room': ['комната', 'комнаты', 'комнат'],
    'guest-genitive': ['гостя', 'гостей', 'гостей']
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

    numFormat: function (num, word) {
      var result = '';
      if (!wordsMap.hasOwnProperty(word)) {
        return result;
      }

      var count = num % 100;
      if (count > 19) {
        count = count % 10;
      }
      if (count === 1) {
        result = wordsMap[word][0];
      } else if (count >= 2 && count <= 4) {
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

    onEnterPress: function (evt, cb) {
      if (evt.keyCode === KeyCode.ENTER) {
        cb();
      }
    }
  };

})();
