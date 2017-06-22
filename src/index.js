var myPoints = [];

ymaps.ready(init);

function init() {
    // Создание экземпляра карты и его привязка к созданному контейнеру.
    var myMap = new ymaps.Map('map', {
            center: [55.751574, 37.573856],
            zoom: 15,
            behaviors: ['default', 'scrollZoom']
        }, {
            searchControlProvider: 'yandex#search'
        }),

        // Создание макета балуна на основе Twitter Bootstrap.
        MyBalloonLayout = ymaps.templateLayoutFactory.createClass(
            '<div class="popover top">' +
            '<a class="close" href="#">&times;</a>' +
            '<div class="arrow"></div>' +
            '<div class="popover-inner">' +
            '$[[options.contentLayout observeSize minWidth=235 maxWidth=335 maxHeight=350]]' +
            '</div>' +
            '</div>', {
                /**
                 * Строит экземпляр макета на основе шаблона и добавляет его в родительский HTML-элемент.
                 * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/layout.templateBased.Base.xml#build
                 * @function
                 * @name build
                 */
                build: function () {
                    this.constructor.superclass.build.call(this);

                    this._$element = $('.popover', this.getParentElement());

                    this.applyElementOffset();

                    this._$element.find('.close')
                        .on('click', $.proxy(this.onCloseClick, this));
                },

                /**
                 * Удаляет содержимое макета из DOM.
                 * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/layout.templateBased.Base.xml#clear
                 * @function
                 * @name clear
                 */
                clear: function () {
                    this._$element.find('.close')
                        .off('click');

                    this.constructor.superclass.clear.call(this);
                },

                /**
                 * Метод будет вызван системой шаблонов АПИ при изменении размеров вложенного макета.
                 * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/IBalloonLayout.xml#event-userclose
                 * @function
                 * @name onSublayoutSizeChange
                 */
                onSublayoutSizeChange: function () {
                    MyBalloonLayout.superclass.onSublayoutSizeChange.apply(this, arguments);

                    if(!this._isElement(this._$element)) {
                        return;
                    }

                    this.applyElementOffset();

                    this.events.fire('shapechange');
                },

                /**
                 * Сдвигаем балун, чтобы "хвостик" указывал на точку привязки.
                 * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/IBalloonLayout.xml#event-userclose
                 * @function
                 * @name applyElementOffset
                 */
                applyElementOffset: function () {
                    this._$element.css({
                        left: -(this._$element[0].offsetWidth / 2),
                        top: -(this._$element[0].offsetHeight + this._$element.find('.arrow')[0].offsetHeight)
                    });
                },

                /**
                 * Закрывает балун при клике на крестик, кидая событие "userclose" на макете.
                 * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/IBalloonLayout.xml#event-userclose
                 * @function
                 * @name onCloseClick
                 */
                onCloseClick: function (e) {
                    e.preventDefault();

                    this.events.fire('userclose');
                },

                /**
                 * Используется для автопозиционирования (balloonAutoPan).
                 * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/ILayout.xml#getClientBounds
                 * @function
                 * @name getClientBounds
                 * @returns {Number[][]} Координаты левого верхнего и правого нижнего углов шаблона относительно точки привязки.
                 */
                getShape: function () {
                    if(!this._isElement(this._$element)) {
                        return MyBalloonLayout.superclass.getShape.call(this);
                    }

                    var position = this._$element.position();

                    return new ymaps.shape.Rectangle(new ymaps.geometry.pixel.Rectangle([
                        [position.left, position.top], [
                            position.left + this._$element[0].offsetWidth,
                            position.top + this._$element[0].offsetHeight + this._$element.find('.arrow')[0].offsetHeight
                        ]
                    ]));
                },

                /**
                 * Проверяем наличие элемента (в ИЕ и Опере его еще может не быть).
                 * @function
                 * @private
                 * @name _isElement
                 * @param {jQuery} [element] Элемент.
                 * @returns {Boolean} Флаг наличия.
                 */
                _isElement: function (element) {
                    return element && element[0] && element.find('.arrow')[0];
                }
            }),

        // Создание вложенного макета содержимого балуна.
        MyBalloonContentLayout = ymaps.templateLayoutFactory.createClass(
            '<h3 class="popover-title">$[properties.balloonHeader]</h3>' +
            '<div class="popover-content">$[properties.balloonContent]</div>' +
            '<div class="popover-content">' +
            '<input type="text" id="inputName" class="popover-name" placeholder="Имя" /><br />' +
            '<input type="text" id="inputPlace" class="popover-place" placeholder="Место" /><br />' +
            '<textarea name="" id="textareaReview" cols="10" rows="5"></textarea><br />' +
            '</div>' +
            '<button id="popover-button">Добавить</button>'
        );

    var inputName = document.querySelector('#inputName');
    var inputPlace = document.querySelector('#inputPlace');
    var textareaReview = document.querySelector('#textareaReview');

    // Слушаем клик на карте.
    myMap.events.add('click', function (e) {
        var idClick = 0,
            coords = e.get('coords');

        myPoints.push({
            id: idClick++,
            coords: coords
        });

        console.log(myPoints);

        var myPlacemark = window.myPlacemark = createPlacemark(coords);
        console.log(myPlacemark);
        myMap.geoObjects.add(myPlacemark);
        myPlacemark.balloon.open();

        getAddress(coords);
    });

    // Создание метки.
    function createPlacemark(coords) {
        return new ymaps.Placemark(coords, {
            iconCaption: 'поиск...',
            //balloonHeader: 'Заголовок балуна',
            //balloonContent: 'Контент балуна'
        }, {
            //preset: 'islands#violetDotIconWithCaption',
            //draggable: false,
            balloonLayout: MyBalloonLayout,
            balloonContentLayout: MyBalloonContentLayout,
            // Запретим замену обычного балуна на балун-панель.
            // Если не указывать эту опцию, на картах маленького размера откроется балун-панель.
            balloonPanelMaxMapArea: 0
            // Не скрываем иконку при открытом балуне.
            // hideIconOnBalloonOpen: false,
            // И дополнительно смещаем балун, для открытия над иконкой.
            // balloonOffset: [3, -40]
        });
    }

    // Определяем адрес по координатам (обратное геокодирование).
    function getAddress(coords) {
        myPlacemark.properties.set('iconCaption', 'поиск...');
        ymaps.geocode(coords).then(function (res) {
            var firstGeoObject = res.geoObjects.get(0);

            myPlacemark.properties
                .set({
                    /*// Формируем строку с данными об объекте.
                     iconCaption: [
                     // Название населенного пункта или вышестоящее административно-территориальное образование.
                     firstGeoObject.getLocalities().length ? firstGeoObject.getLocalities() : firstGeoObject.getAdministrativeAreas(),
                     // Получаем путь до топонима, если метод вернул null, запрашиваем наименование здания.
                     firstGeoObject.getThoroughfare() || firstGeoObject.getPremise()
                     ].filter(Boolean).join(', '),*/
                    // В качестве контента балуна задаем строку с адресом объекта.
                    balloonHeader: firstGeoObject.getAddressLine(),
                    balloonContent: 'dfsdfsd'
                });
        });
    }

}

