'use strict';

(function () {

  var VALIDATION_ERROR_CLASS = 'js-error-message';

  var TitleLengthLimit = {
    MIN: 30,
    MAX: 100
  };

  var form = document.querySelector('.ad-form');
  var formFields = form.querySelectorAll('fieldset');
  var addressInput = form.querySelector('#address');
  var titleInput = form.querySelector('#title');
  var typeInput = form.querySelector('#type');
  var priceInput = form.querySelector('#price');
  var timeinSelect = form.querySelector('#timein');
  var timeoutSelect = form.querySelector('#timeout');
  var roomNumberSelect = form.querySelector('#room_number');
  var capacitySelect = form.querySelector('#capacity');
  var formReset = form.querySelector('.ad-form__reset');
  var formSubmit = form.querySelector('.ad-form__submit');
  var validatingFields = [
    titleInput,
    priceInput,
    capacitySelect
  ];
  var isFormActive = false;
  var isValidationError = false;

  var offerMinPricesMap = {
    'bungalo': 0,
    'flat': 1000,
    'house': 5000,
    'palace': 10000
  };

  var onFormResetClick = function (evt) {
    evt.preventDefault();
    window.app.resetPage();
  };

  var onFormChange = function (evt) {
    var target = evt.target;

    switch (target.id) {
      case 'title':
        setTitleValidity();
        validate(titleInput);
        break;
      case 'type':
        setPrice(target.value);
        if (priceInput.value) {
          validate(priceInput);
        }
        break;
      case 'price':
        validate(priceInput);
        break;
      case 'timein':
      case 'timeout':
        setTimes(target.value);
        break;
      case 'room_number':
        setCapacity(target.value);
        validate(capacitySelect);
        break;
      case 'capacity':
        setCapacityValidity();
        validate(capacitySelect);
    }
  };

  var onFormSubmitClick = function (evt) {
    evt.preventDefault();
    isValidationError = false;
    validatingFields.forEach(function (field) {
      validate(field);
    });
    if (!isValidationError) {
      formSubmit.disabled = true;
      window.backend.save(new FormData(form), onSubmitSuccess, onSubmitError);
    }
  };

  var onSubmitSuccess = function () {
    window.alerts.showSuccess('Ваше объявление<br>успешно размещено!');
    window.app.resetPage();
    formSubmit.disabled = false;
  };

  var onSubmitError = function (errorText) {
    window.alerts.showError('Ваше объявление не размещено.<br>' + errorText, function () {
      formSubmit.disabled = true;
      window.backend.save(new FormData(form), onSubmitSuccess, onSubmitError);
    });
    formSubmit.disabled = false;
  };

  var setTitleValidity = function () {
    titleInput.value = titleInput.value.trim();
    var length = titleInput.value.length;

    if (length < TitleLengthLimit.MIN && length > 0) {
      titleInput.setCustomValidity('Минимальное количество символов: ' + TitleLengthLimit.MIN + '. Длина текста сейчас: ' + length);
    } else if (length > TitleLengthLimit.MAX) {
      titleInput.setCustomValidity('Максимальное количество символов: ' + TitleLengthLimit.MAX + '. Длина текста сейчас: ' + length);
    } else {
      titleInput.setCustomValidity('');
    }
  };

  var setPrice = function (value) {
    priceInput.min = offerMinPricesMap[value];
    priceInput.placeholder = offerMinPricesMap[value];
  };

  var setTimes = function (value) {
    timeinSelect.value = value;
    timeoutSelect.value = value;
  };

  var setCapacity = function (roomNumber) {
    var options = capacitySelect.options;

    if (+roomNumber < 100) {
      Array.prototype.forEach.call(options, function (option) {
        option.disabled = (+option.value > +roomNumber || +option.value === 0) ? true : false;
      });
    } else {
      Array.prototype.forEach.call(options, function (option) {
        option.disabled = (+option.value > 0) ? true : false;
      });
    }
    setCapacityValidity();
  };

  var setCapacityValidity = function () {
    var selectedOption = capacitySelect.options[capacitySelect.selectedIndex];

    if (selectedOption.disabled) {
      capacitySelect.setCustomValidity('Укажите подходящее количество мест');
    } else {
      capacitySelect.setCustomValidity('');
    }
  };

  var checkValidationError = function (field) {
    return field.nextElementSibling !== null && field.nextElementSibling.classList.contains(VALIDATION_ERROR_CLASS);
  };

  var validate = function (field) {
    var isError = checkValidationError(field);
    if (isError) {
      clearValidationError(field);
    }
    if (!field.validity.valid) {
      if (!isValidationError) {
        field.focus();
        isValidationError = true;
      }
      field.style.outline = '2px dashed red';

      var fieldCustomValidation = new window.CustomValidation();
      fieldCustomValidation.checkValidity(field);
      var customValidityMessageForHTML = fieldCustomValidation.getInvaliditiesForHTML();
      field.insertAdjacentHTML('afterend', '<p class="' + VALIDATION_ERROR_CLASS + '" style="margin-top: 7px; margin-bottom: 15px; padding-right: 20px; color: red;">' + customValidityMessageForHTML + '</p>');
    }
  };

  var clearValidationError = function (field) {
    var error = field.nextElementSibling;

    field.style.outline = null;
    error.remove();
  };

  var clearValidationErrors = function () {
    var errors = form.querySelectorAll('.' + VALIDATION_ERROR_CLASS);

    errors.forEach(function (error) {
      var field = error.previousElementSibling;

      clearValidationError(field);
    });
  };

  window.adForm = {
    activate: function () {
      form.classList.remove('ad-form--disabled');
      setPrice(typeInput.value);
      setTimes(timeinSelect.value);
      setCapacity(roomNumberSelect.value);
      window.utils.activateFormFields(formFields);

      form.addEventListener('change', onFormChange);
      formSubmit.addEventListener('click', onFormSubmitClick);
      formReset.addEventListener('click', onFormResetClick);

      isFormActive = true;
    },

    deactivate: function () {
      form.classList.add('ad-form--disabled');
      window.utils.deactivateFormFields(formFields);

      if (isFormActive) {
        form.reset();
        if (isValidationError) {
          clearValidationErrors();
        }

        form.removeEventListener('change', onFormChange);
        formSubmit.removeEventListener('click', onFormSubmitClick);
        formReset.removeEventListener('click', onFormResetClick);
      }

      isFormActive = false;
    },

    setAddress: function (pinCoordinates) {
      addressInput.value = pinCoordinates.x + ', ' + pinCoordinates.y;
    }
  };

})();
