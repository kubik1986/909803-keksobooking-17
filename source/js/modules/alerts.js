'use strict';

;(function () { // eslint-disable-line

  var main = document.querySelector('main');
  var errorTemplate = document.querySelector('#error')
      .content
      .querySelector('.error');
  var successTemplate = document.querySelector('#success')
      .content
      .querySelector('.success');

  var onAlertEscPress = function (evt) {
    window.utils.onEscPress(evt, hideAlert);
  };

  var onErrorClick = function (evt) {
    if (!evt.target.classList.contains('error__button')) {
      hideAlert();
    }
  };

  var onSuccessClick = function () {
    hideAlert();
  };

  var hideAlert = function () {
    var alerts = main.querySelectorAll('.error, .success');
    alerts.forEach(function (alert) {
      alert.remove();
    });

    document.removeEventListener('keydown', onAlertEscPress);
  };

  window.alerts = {
    showError: function (errorMessage, cb) {
      var errorElement = errorTemplate.cloneNode(true);
      var errorBtn = errorElement.querySelector('.error__button');

      var onErrorBtnClick = function () {
        hideAlert();
        cb();
      };

      errorElement.querySelector('.error__message').innerHTML = errorMessage;
      main.appendChild(errorElement);
      errorElement.focus();

      errorBtn.addEventListener('click', onErrorBtnClick);
      errorElement.addEventListener('click', onErrorClick);
      document.addEventListener('keydown', onAlertEscPress);
    },

    showSuccess: function (successMessage) {
      var successElement = successTemplate.cloneNode(true);

      successElement.querySelector('.success__message').innerHTML = successMessage;
      main.appendChild(successElement);
      successElement.focus();

      successElement.addEventListener('click', onSuccessClick);
      document.addEventListener('keydown', onAlertEscPress);
    }
  };

})();
