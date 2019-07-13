'use strict';

(function () {

  var VALIDATION_ERROR_CLASS = 'js-file-error';

  var Byte = {
    KB: 1024,
    MB: 1024 * 1024,
  };

  window.ImageLoader = function (obj) {
    this._maxFilesAmount = obj.maxFilesAmount; // максимальное число загружаемых файлов
    this._previewInsertPosition = obj.previewInsertPosition; // позиция вставки элемента превью в родительском контейнере (start / end)
    this._fileChooser = obj.fileChooser; // инпут
    this._dropZone = obj.dropZone; // контейнер drop zone
    this._loaderContainer = obj.loaderContainer; // контейнер загрузчика
    this._preview = obj.preview; // контейнер превью
    this._previewClass = this._preview.className;
    this._highlightClass = obj.highlightClass; // класс контейнера drop zone при dragenter и dragover
    this._fileTypes = obj.fileTypes; // допустимые типы файлов
    this._maxFileSize = obj.maxFileSize; // максимальный размер файла в KB
    this._imgSize = obj.imgSize; // {width - ширина в px, height - высота в px}
    this._imgAlt = obj.imgAlt; // атрибут alt тега img
    this._isActive = false; // флаг активного состояния
    this._files = []; // массив файлов, передаваемый в FormData
    this._errors = []; // массив сообщений об ошибках
    // this._alert = window.alerts.showErrorNoCallback;

    this._init.call(this);
  };

  window.ImageLoader.prototype = {
    _highlight: function () {
      if (!this._dropZone.classList.contains(this._highlightClass)) {
        this._dropZone.classList.add(this._highlightClass);
      }
    },

    _unhighlight: function () {
      if (this._dropZone.classList.contains(this._highlightClass)) {
        this._dropZone.classList.remove(this._highlightClass);
      }
    },

    _alert: function (message) {
      var alert = document.createElement('p');

      alert.classList.add(VALIDATION_ERROR_CLASS);
      alert.innerHTML = message;
      alert.style.marginTop = '10px';
      alert.style.marginBottom = '10px';
      alert.style.fontSize = '14px';
      alert.style.color = 'red';

      this._loaderContainer.parentElement.appendChild(alert);
    },

    _validate: function (file) {
      var isCorrect = false;
      var typeError = 'Допустимые типы файлов - ' + this._fileTypes.join(', ');
      var sizeError = 'Максимальный размер файла - ' + this._maxFileSize + ' КБ';
      var fileName = file.name.toLowerCase();
      var matches = this._fileTypes.some(function (type) {
        return fileName.endsWith(type);
      });

      if (!matches) {
        if (this._errors.indexOf(typeError) === -1) {
          this._errors.push(typeError);
        }
      } else if (file.size > this._maxFileSize * Byte.KB) {
        if (this._errors.indexOf(sizeError) === -1) {
          this._errors.push(sizeError);
        }
      } else {
        isCorrect = true;
      }

      return isCorrect;
    },

    _clearErrors: function () {
      var error = this._loaderContainer.parentElement.querySelector('.' + VALIDATION_ERROR_CLASS);

      this._errors = [];
      if (error) {
        error.remove();
      }
    },

    _updatePreviews: function (files) {
      var self = this;
      var loadedFilesAmount = 0;
      var fragment = document.createDocumentFragment();

      if (files.length > 0) {
        files.forEach(function (file) {
          var reader = new FileReader();

          reader.addEventListener('load', function () {
            var div = document.createElement('div');
            var img = document.createElement('img');

            img.src = reader.result;
            img.alt = self._imgAlt;
            img.width = self._imgSize.width;
            img.height = self._imgSize.height;
            img.style.borderRadius = '5px';
            img.style.objectFit = 'cover';

            div.classList.add(self._previewClass);
            div.appendChild(img);

            fragment.appendChild(div);
            loadedFilesAmount++;

            if (loadedFilesAmount === files.length) {
              self._deletePreviews();
              if (self._previewInsertPosition === 'start') {
                self._loaderContainer.insertBefore(fragment, self._loaderContainer.firstChild);
              } else {
                self._loaderContainer.appendChild(fragment);
              }
            }
          });

          reader.readAsDataURL(file);
        });
      } else {
        self._setDefaultPreview();
      }
    },

    _deletePreviews: function () {
      var previews = this._loaderContainer.querySelectorAll('.' + this._previewClass);

      previews.forEach(function (preview) {
        preview.remove();
      });
    },

    _setDefaultPreview: function () {
      this._deletePreviews();
      if (this._previewInsertPosition === 'start') {
        this._loaderContainer.insertBefore(this._preview, this._loaderContainer.firstChild);
      } else {
        this._loaderContainer.appendChild(this._preview);
      }
    },

    _addFiles: function (files) {
      var self = this;

      self._files = [];
      self._clearErrors();

      if (files.length > self._maxFilesAmount) {
        self._errors.unshift('Максимальное количество файлов - ' + self._maxFilesAmount);
      }

      for (var i = 0; i < files.length; i++) {
        if (self._files.length === self._maxFilesAmount) {
          break;
        }
        if (self._validate(files[i])) {
          self._files.push(files[i]);
        }
      }

      if (self._errors.length > 0) {
        if (self._files.length === 0) {
          self._errors.unshift('Внимание: файлы не будут загружены');
        } else {
          self._errors.unshift('Внимание: будут загружены не все выбранные файлы');
        }

        var message = self._errors.join('.<br>');
        self._alert(message);
      }
    },

    _init: function () {
      var self = this;

      ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(function (evtName) {
        self._dropZone.addEventListener(evtName, function (evt) {
          evt.preventDefault();
          evt.stopPropagation();
        });
      });

      ['dragenter', 'dragover'].forEach(function (evtName) {
        self._dropZone.addEventListener(evtName, function () {
          if (self._isActive) {
            self._highlight();
          }
        });
      });

      ['dragleave', 'drop'].forEach(function (evtName) {
        self._dropZone.addEventListener(evtName, function () {
          if (self._isActive) {
            self._unhighlight();
          }
        });
      });

      self._dropZone.addEventListener('drop', self._onDrop.bind(self));
      self._fileChooser.addEventListener('change', self._onInputChange.bind(self));
    },

    _onDrop: function (evt) {
      if (this._isActive) {
        var dataTransfer = evt.dataTransfer;
        var files = Array.from(dataTransfer.files);

        this._addFiles(files);
        this._updatePreviews(this._files);
      }
    },

    _onInputChange: function () {
      if (this._isActive) {
        var files = Array.from(this._fileChooser.files);

        this._addFiles(files);
        this._updatePreviews(this._files);
      }
    },

    activate: function () {
      this._isActive = true;
    },

    deactivate: function () {
      this._isActive = false;
    },

    reset: function () {
      this._files = [];
      this._clearErrors();
      this._setDefaultPreview();
      this._isActive = false;
    },

    getFiles: function () {
      return this._files;
    }
  };

})();
