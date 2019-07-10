'use strict';

(function () {

  var spinner = document.querySelector('.spinner');

  window.spinner = {
    show: function () {
      if (spinner.classList.contains('spinner--hidden')) {
        spinner.classList.remove('spinner--hidden');
        document.body.style.overflow = 'hidden';
      }
    },

    hide: function () {
      if (!spinner.classList.contains('spinner--hidden')) {
        spinner.classList.add('spinner--hidden');
        document.body.style.overflow = 'visible';
      }
    }
  };

})();
