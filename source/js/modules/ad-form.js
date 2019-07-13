'use strict';

;(function () { // eslint-disable-line

  var VALIDATION_ERROR_CLASS = 'js-error-message';
  var AVATAR_FILE_TYPES = ['jpg', 'jpeg', 'png', 'gif'];
  var PHOTO_FILE_TYPES = ['jpg', 'jpeg', 'png'];

  var TitleLengthLimit = {
    MIN: 30,
    MAX: 100
  };

  var form = document.querySelector('.ad-form');
  var formFields = form.querySelectorAll('fieldset');
  var addressInput = form.querySelector('#address');
  var titleInput = form.querySelector('#title');
  var typeSelect = form.querySelector('#type');
  var priceInput = form.querySelector('#price');
  var timeinSelect = form.querySelector('#timein');
  var timeoutSelect = form.querySelector('#timeout');
  var roomNumberSelect = form.querySelector('#room_number');
  var capacitySelect = form.querySelector('#capacity');
  var formReset = form.querySelector('.ad-form__reset');
  var formSubmit = form.querySelector('.ad-form__submit');
  var notFileFields = form.querySelectorAll('input:not([type="file"]), select, textarea');
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

  var avatarLoader = new window.ImageLoader({
    maxFilesAmount: 1,
    previewInsertPosition: 'start',
    fileChooser: form.querySelector('#avatar'),
    dropZone: form.querySelector('.ad-form-header__drop-zone'),
    loaderContainer: form.querySelector('.ad-form-header__upload'),
    preview: form.querySelector('.ad-form-header__preview'),
    highlightClass: 'ad-form-header__drop-zone--highlighted',
    fileTypes: AVATAR_FILE_TYPES,
    maxFileSize: 300, // KB
    imgSize: {
      width: 40,
      height: 44
    },
    imgAlt: 'Аватар пользователя'
  });

  var photoLoader = new window.ImageLoader({
    maxFilesAmount: 16,
    previewInsertPosition: 'end',
    fileChooser: form.querySelector('#images'),
    dropZone: form.querySelector('.ad-form__drop-zone'),
    loaderContainer: form.querySelector('.ad-form__photo-container'),
    preview: form.querySelector('.ad-form__photo'),
    highlightClass: 'ad-form__drop-zone--highlighted',
    fileTypes: PHOTO_FILE_TYPES,
    maxFileSize: 1024, // KB
    imgSize: {
      width: 70,
      height: 70
    },
    imgAlt: 'Фотография жилья'
  });


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
      upload();
    }
  };

  var onSubmitSuccess = function () {
    window.spinner.hide();
    window.alerts.showSuccess('Ваше объявление<br>успешно размещено!');
    unlock();
    window.app.resetPage();
  };

  var onSubmitError = function (errorText) {
    window.spinner.hide();
    window.alerts.showError('Ваше объявление не размещено.<br>' + errorText, upload);
    unlock();
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

  var lock = function () {
    form.classList.add('ad-form--disabled');
    window.utils.deactivateFormFields(formFields);
    avatarLoader.deactivate();
    photoLoader.deactivate();
  };

  var unlock = function () {
    form.classList.remove('ad-form--disabled');
    window.utils.activateFormFields(formFields);
    avatarLoader.activate();
    photoLoader.activate();
  };

  var setFormData = function () {
    var formData = new FormData();

    notFileFields.forEach(function (field) {
      if (field.type !== 'checkbox' || field.checked) {
        formData.append(field.name, field.value);
      }
    });

    var avatar = avatarLoader.getFiles();
    if (avatar.length > 0) {
      formData.append('avatar', avatar[0], avatar[0].name);
    }

    var photos = photoLoader.getFiles();
    if (photos.length > 0) {
      photos.forEach(function (photo) {
        formData.append('images', photo, photo.name);
      });
    }

    return formData;
  };

  var upload = function () {
    lock();
    window.backend.save(setFormData(), onSubmitSuccess, onSubmitError);
    window.spinner.show();
  };

  window.adForm = {
    activate: function () {
      unlock();
      setPrice(typeSelect.value);
      setTimes(timeinSelect.value);
      setCapacity(roomNumberSelect.value);

      form.addEventListener('change', onFormChange);
      formSubmit.addEventListener('click', onFormSubmitClick);
      formReset.addEventListener('click', onFormResetClick);

      isFormActive = true;
    },

    deactivate: function () {
      lock();

      if (isFormActive) {
        form.reset();
        avatarLoader.reset();
        photoLoader.reset();

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
