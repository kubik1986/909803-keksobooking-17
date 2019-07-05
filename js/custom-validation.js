'use strict';

(function () {

  window.CustomValidation = function () {
    this.invalidities = [];
  };

  window.CustomValidation.prototype = {
    checkValidity: function (input) {
      var validity = input.validity;

      if (validity.patternMismatch) {
        this.addInvalidity('Значение не соответствует указанному шаблону');
      }

      if (validity.rangeOverflow) {
        var max = input.getAttribute('max');
        this.addInvalidity('Значение должно быть меньше или равно ' + max);
      }

      if (validity.rangeUnderflow) {
        var min = input.getAttribute('min');
        this.addInvalidity('Значение должно быть больше или равно ' + min);
      }

      if (validity.stepMismatch) {
        var step = input.getAttribute('step');
        this.addInvalidity('Значение должно быть кратным ' + step);
      }

      if (validity.tooLong) {
        var maxlength = input.getAttribute('maxlength');
        this.addInvalidity('Максимальное количество символов: ' + maxlength);
      }

      if (validity.tooShort) {
        var minlength = input.getAttribute('minlength');
        this.addInvalidity('Минимальное количество символов: ' + minlength);
      }

      if (validity.valueMissing) {
        this.addInvalidity('Это поле обязательно для заполнения');
      }

      if (validity.typeMismatch) {
        this.addInvalidity('Значение не соответствует указанному типу');
      }

      if (validity.customError) {
        this.addInvalidity(input.validationMessage);
      }
    },

    addInvalidity: function (message) {
      this.invalidities.push(message);
    },

    getInvalidities: function () {
      return this.invalidities.join('. \n');
    },

    getInvaliditiesForHTML: function () {
      return this.invalidities.join('. <br>');
    }
  };

})();
