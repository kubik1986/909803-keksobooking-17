'use strict';

(function () {

  var form = document.querySelector('.ad-form');
  var formFields = form.querySelectorAll('fieldset');
  var addressInput = form.querySelector('#address');
  var typeInput = form.querySelector('#type');
  var priceInput = form.querySelector('#price');
  var timeinSelect = form.querySelector('#timein');
  var timeoutSelect = form.querySelector('#timeout');
  var roomNumberSelect = form.querySelector('#room_number');
  var capacitySelect = form.querySelector('#capacity');
  var formReset = form.querySelector('.ad-form__reset');
  var isFormActive = false;

  var offerMinPricesMap = {
    'bungalo': 0,
    'flat': 1000,
    'house': 5000,
    'palace': 10000
  };

  var onFormResetClick = function (evt) {
    evt.preventDefault();
    window.resetPage();
  };

  var onFormChange = function (evt) {
    var target = evt.target;

    switch (target.id) {
      case 'type':
        setPrice(target.value);
        break;
      case 'timein':
      case 'timeout':
        setTimes(target.value);
        break;
      case 'room_number':
        setCapacity(target.value);
        break;
      case 'capacity':
        setCapacityValidity();
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

  window.adForm = {
    activate: function () {
      form.classList.remove('ad-form--disabled');
      setPrice(typeInput.value);
      setTimes(timeinSelect.value);
      setCapacity(roomNumberSelect.value);
      setCapacityValidity();
      window.utils.activateFormFields(formFields);

      form.addEventListener('change', onFormChange);
      formReset.addEventListener('click', onFormResetClick);

      isFormActive = true;
    },

    deactivate: function () {
      form.classList.add('ad-form--disabled');
      window.utils.deactivateFormFields(formFields);

      if (isFormActive) {
        form.reset();

        form.removeEventListener('change', onFormChange);
        formReset.removeEventListener('click', onFormResetClick);
      }

      isFormActive = false;
    },

    setAddress: function (pinCoordinates) {
      addressInput.value = pinCoordinates.x + ', ' + pinCoordinates.y;
    }
  };

})();
