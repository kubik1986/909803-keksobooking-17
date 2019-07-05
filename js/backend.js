'use strict';

(function () {

  var URL_POST = 'https://js.dump.academy/keksobooking';
  var URL_GET = URL_POST + '/data';
  var TIMEOUT = 5000;

  var xhrSetup = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onLoad(xhr.response);
      } else {
        onError('Произошла ошибка. Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения. Попробуйте повторить позднее.');
    });

    xhr.addEventListener('timeout', function () {
      onError('Время ожидания ответа сервера истекло.<br>Попробуйте повторить позднее.');
    });

    xhr.timeout = TIMEOUT;

    return xhr;
  };

  window.backend = {
    load: function (onLoad, onError) {
      var xhr = xhrSetup(onLoad, onError);

      xhr.open('GET', URL_GET);
      xhr.send();
    },

    save: function (data, onLoad, onError) {
      var xhr = xhrSetup(onLoad, onError);

      xhr.open('POST', URL_POST);
      xhr.send(data);
    }
  };

})();
