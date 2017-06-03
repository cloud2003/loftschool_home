/**
 * ДЗ 6.2 - Создать страницу с текстовым полем для фильтрации городов
 *
 * Страница должна предварительно загрузить список городов из
 * https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 * и отсортировать в алфавитном порядке.
 *
 * При вводе в текстовое поле, под ним должен появляться список тех городов,
 * в названии которых, хотя бы частично, есть введенное значение.
 * Регистр символов учитываться не должен, то есть "Moscow" и "moscow" - одинаковые названия.
 *
 * Во время загрузки городов, на странице должна быть надпись "Загрузка..."
 * После окончания загрузки городов, надпись исчезает и появляется текстовое поле.
 *
 * Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 *
 * *** Часть со звездочкой ***
 * Если загрузка городов не удалась (например, отключился интернет или сервер вернул ошибку),
 * то необходимо показать надпись "Не удалось загрузить города" и кнопку "Повторить".
 * При клике на кнопку, процесс загруки повторяется заново
 */

/**
 * homeworkContainer - это контейнер для всех ваших домашних заданий
 * Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер
 *
 * @example
 * homeworkContainer.appendChild(...);
 */
let homeworkContainer = document.querySelector('#homework-container');

/**
 * Функция должна загружать список городов из https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 * И возвращать Promise, которой должен разрешиться массивом загруженных городов
 *
 * @return {Promise<Array<{name: string}>>}
 */
function loadTowns() {
    return new Promise(function(resolve, reject) {
        let xhr = new XMLHttpRequest();

        xhr.open('GET', 'https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json', true);
        xhr.send();
        xhr.addEventListener('load', function () {
            if (xhr.status < 400) {
                resolve(JSON.parse(xhr.responseText));
            } else {
                reject();
            }
        });
    }).then(
        function(obj) {
            obj.sort(function(a, b) {
                if ( a.name > b.name ) {
                    return 1;
                }
                if ( a.name < b.name ) {
                    return -1;
                }

                return 0;
            });

            loadingBlock.setAttribute('style', 'display: none');
            filterBlock.setAttribute('style', 'display: block');

            return obj;
        },
        function() {
            // console.log('Не удалось загрузить города');

            var error = document.createElement('div');

            error.innerHTML = 'Не удалось загрузить города';

            loadingBlock.setAttribute('style', 'display: none');
            filterBlock.setAttribute('style', 'display: block');
            filterResult.setAttribute('style', 'display:block;');
            filterResult.appendChild(error);

            reLoad();
        });
}

function reLoad() {
    var reloadElem = document.createElement('button');

    reloadElem.setAttribute('id', 'reloadButton');
    reloadElem.innerHTML = 'Повторить';
    filterResult.appendChild(reloadElem);

    reloadElem.addEventListener('click', function () {
        loadTowns();

        while (filterResult.firstChild) {
            filterResult.removeChild(filterResult.firstChild);
        }
    });
}

/**
 * Функция должна проверять встречается ли подстрока chunk в строке full
 * Проверка должна происходить без учета регистра символов
 *
 * @example
 * isMatching('Moscow', 'moscow') // true
 * isMatching('Moscow', 'mosc') // true
 * isMatching('Moscow', 'cow') // true
 * isMatching('Moscow', 'SCO') // true
 * isMatching('Moscow', 'Moscov') // false
 *
 * @return {boolean}
 */
function isMatching(full, chunk) {
    full = full.toLowerCase();
    chunk = chunk.toLowerCase();

    if ( ~full.indexOf(chunk) && chunk.length != 0 ) {
        return true;
    }

    return false;
}

let loadingBlock = homeworkContainer.querySelector('#loading-block');
let filterBlock = homeworkContainer.querySelector('#filter-block');
let filterInput = homeworkContainer.querySelector('#filter-input');
let filterResult = homeworkContainer.querySelector('#filter-result');
let townsPromise = loadTowns();

filterInput.addEventListener('keyup', function() {
    townsPromise.then(function(cities) {
        var newCities = [];

        cities.forEach(function (city) {

            if (isMatching(city.name, filterInput.value)) {
                newCities.push(city.name);
            }
        });

        filterResult.innerHTML = '';
        for (var key in newCities) {
            if (newCities.hasOwnProperty(key)) {

                var div = document.createElement('div');

                div.innerHTML = newCities[key];
                filterResult.appendChild(div);
            }
        }
    });
});

export {
    loadTowns,
    isMatching
};
