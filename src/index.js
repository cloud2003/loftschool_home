var myPoints = [];
var myReviews = [];
var myIdPoint = 0;
var placemarks = [];


ymaps.ready(init);


function init() {

  // Создание экземпляра карты и его привязка к созданному контейнеру.
  var myMap = new ymaps.Map('map', {
      center: [55.777777, 37.577777],
      zoom: 15,
      behaviors: ['default', 'scrollZoom']
    }, {
      searchControlProvider: 'yandex#search'
    }),

    customItemContentLayout = ymaps.templateLayoutFactory.createClass(
      // Флаг "raw" означает, что данные вставляют "как есть" без экранирования html.
      '<h2 class=ballon_header>{{ properties.balloonContentHeader|raw }}</h2>' +
      '<div class=ballon_body>{{ properties.balloonContentBody|raw }}</div>' +
      '<div class=ballon_footer>{{ properties.balloonContentFooter|raw }}</div>'
    ),
    // Создание экземпляра кластера
    clusterer = new ymaps.Clusterer({
      // preset: 'islands#invertedVioletClusterIcons',
      // Устанавливаем стандартный макет балуна кластера "Карусель".
      clusterBalloonContentLayout: 'cluster#balloonCarousel',
      // Устанавливаем собственный макет.
      clusterBalloonItemContentLayout: customItemContentLayout,
      groupByCoordinates: false,
      clusterDisableClickZoom: true,
      clusterHideIconOnBalloonOpen: false,
      geoObjectHideIconOnBalloonOpen: false,
      //gridSize: 200
    }),

    // Создание макета балуна на основе Twitter Bootstrap.
    MyBalloonLayout = ymaps.templateLayoutFactory.createClass(
      '<div class="popover top">' +
      '<a class="close" href="#">&times;</a>' +
      '<div class="popover-inner">' +

      '<h3 class="popover-title">{{ balloonHeader }}</h3>' +
      '<div class="popover-content">' +
      '<div class="popover-review">' +
      '{{ balloonContent }} \
      {% for review in reviews %} \
        <div class="popover-review__item">\
          <strong>{{ review.name }}</strong>, <span>{{ review.place }}</span> \
          <p>{{ review.text }}</p> \
        </div>\
      {% endfor %} \
    </div>' +
      '<br><hr><h4>Ваш отзыв</h4>' +
      '<form>' +
      '<input type="text" id="inputName" class="popover-name form-control form-control-sm" placeholder="Введите имя" /><br />' +
      '<input type="text" id="inputPlace" class="popover-place form-control form-control-sm" placeholder="Укажите место" /><br />' +
      '<textarea name="" id="textareaReview" cols="10" rows="5" class="form-control form-control-sm"></textarea><br />' +
      '</form>' +
      '<button id="popover-button" class="btn btn-warning">Добавить</button>' +
      '</div>' +
      '</div>' +
      '</div>', {
        // Строит экземпляр макета на основе шаблона и добавляет его в родительский HTML-элемент.
        build: function () {
          this.constructor.superclass.build.call(this);
          this._$element = $('.popover', this.getParentElement());
          this._$element.find('.close').on('click', $.proxy(this.onCloseClick, this));
        },
        onCloseClick: function (e) {
          e.preventDefault();
          this.events.fire('userclose');
        }
      });

  // Создание независимого экземпляра балуна и отображение его в центре карты.
  var balloon = new ymaps.Balloon(myMap, {layout: MyBalloonLayout});
  // Здесь родительскими устанавливаются опции карты, где содержатся значения по умолчанию для обязательных опций.
  balloon.options.setParent(myMap.options);

  balloon.events.add('click', function (e) {
    // console.log('domEvent -->'); console.log(domEl);

    if (e.get('domEvent').get('target').id == 'popover-button') {
      // берем координаты точки
      var coords = e.get('target').getPosition();

      // console.log(e.get('target')._data.balloonHeader);
      // console.log(coords.join(','));

      if (inputName.value != '' && inputPlace.value != '' && textareaReview.value != '') {

        var myPoint = {
          id: myIdPoint,
          coords: coords,
          name: inputName.value,
          place: inputPlace.value,
          text: textareaReview.value,
          balloonHeader: e.get('target')._data.balloonHeader,
          balloonContentBody: `
          <div>
            <p><strong>${inputPlace.value}</strong></p>
            <p><a data-id="id_${myIdPoint}" class="link">${e.get('target')._data.balloonHeader}</a></p>
            <p><em>${inputName.value}</em> ${textareaReview.value}</p>
          </div>
          `
        };

        myPoints.push(myPoint);

        inputName.value = inputPlace.value = textareaReview.value = '';

        ++myIdPoint;

        // создаем Placemark
        var placemark = new ymaps.Placemark(coords, myPoint);

        // добавляем метку в массив
        placemarks.push(placemark);

        // добавляем метки на карту
        clusterer.add(placemarks);
        myMap.geoObjects.add(clusterer);


        /*var newText = '';
         newText += templateFn(getReviewsByCoords(coords));*/

        // переоткрываем balloon
        balloon.open(coords, {
          balloonHeader: myPoint.balloonHeader,
          balloonContent: '',
          reviews: getReviewsByCoords(coords)
          // balloonContent: newText
        });

        // Save in localStorage
        localStorage.setItem('myPointsLocal', JSON.stringify(myPoints));
        //localStorage.setItem('placemarksLocal', JSON.stringify(placemarks));
      }
    }
    // Добавляем кластер на карту
    myMap.geoObjects.add(clusterer);

  });

  if (window.localStorage.hasOwnProperty('myPointsLocal')) {
    myPoints = JSON.parse(localStorage.getItem('myPointsLocal'));
    // placemarks = JSON.parse(localStorage.getItem('placemarksLocal'));
    console.log('myPointsLocal', myPoints);
    // console.log('placemarksLocal', placemarks);

    for(var i=0; i < myPoints.length; i++) {
      // создаем Placemark
      var placemark = new ymaps.Placemark(myPoints[i].coords, myPoints[i]);

      // добавляем метку в массив
      placemarks.push(placemark);
    }
    // добавляем метки на карту
    clusterer.add(placemarks);
    myMap.geoObjects.add(clusterer);
  }

  // Слушаем клик на карте.
  myMap.events.add('click', function (e) {

    var coords = e.get('coords');
    clusterer.balloon.close();

    ymaps.geocode(coords).then(function (res) {
      var firstGeoObject = res.geoObjects.get(0);
      var address = firstGeoObject.getAddressLine();
      balloon.open(coords, {
        balloonHeader: address,
        balloonContent: 'Пока еще нет отзывов'
      });
    });
  });

  // Отзывы по координатам
  function getReviewsByCoords(coords) {
    var reviews = [];
    for (let i = 0; i < myPoints.length; i++) {
      if (coords.join(',') == myPoints[i].coords.join(',')) {
        reviews.push({
          name: myPoints[i].name,
          place: myPoints[i].place,
          text: myPoints[i].text
        });
      }
    }
    return reviews;
  }


  // Открыть окно "добавить отзыв" по ссылке из карусели кластеров
  document.addEventListener('click', function (e) {
    if (balloon && balloon.isOpen()) {
      clusterer.balloon.close();
      console.log('close');
    }

    if ( e.target.className == 'link' ) {
      e.preventDefault();
      // console.log('e.target.textContent', e.target.textContent)

      for (let i = 0; i < myPoints.length; i++) {
        if (e.target.textContent == myPoints[i].balloonHeader) {
          balloon.open(myPoints[i].coords, {
            balloonHeader: myPoints[i].balloonHeader,
            balloonContent: '',
            reviews: getReviewsByCoords(myPoints[i].coords)
          });
          clusterer.balloon.close();
          break;
        }
      }
    }
  });



  /*  clusterer.events.add('click', function (e) {
   console.log('e.geometry * —>', e);
   console.log('this —>', this);
   // console.log('target —>', e.get('target'));

   });*/

}