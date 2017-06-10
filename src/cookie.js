/**
 * ДЗ 7.2 - Создать редактор cookie с возможностью фильтрации
 *
 * На странице должна быть таблица со списком имеющихся cookie:
 * - имя
 * - значение
 * - удалить (при нажатии на кнопку, выбранная cookie удаляется из браузера и таблицы)
 *
 * На странице должна быть форма для добавления новой cookie:
 * - имя
 * - значение
 * - добавить (при нажатии на кнопку, в браузер и таблицу добавляется новая cookie с указанным именем и значением)
 *
 * Если добавляется cookie с именем уже существующией cookie, то ее значение в браузере и таблице должно быть обновлено
 *
 * На странице должно быть текстовое поле для фильтрации cookie
 * В таблице должны быть только те cookie, в имени или значении которых есть введенное значение
 * Если в поле фильтра пусто, то должны выводиться все доступные cookie
 * Если дабавляемая cookie не соответсвуте фильтру, то она должна быть добавлена только в браузер, но не в таблицу
 * Если добавляется cookie, с именем уже существующией cookie и ее новое значение не соответствует фильтру,
 * то ее значение должно быть обновлено в браузере, а из таблицы cookie должна быть удалена
 *
 * Для более подробной информации можно изучить код тестов
 *
 * Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/**
 * homeworkContainer - это контейнер для всех ваших домашних заданий
 * Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер
 *
 * @example
 * homeworkContainer.appendChild(...);
 */
let homeworkContainer = document.querySelector('#homework-container');
let addButton = homeworkContainer.querySelector('#add-button');
let filterNameInput = homeworkContainer.querySelector('#filter-name-input');
let addNameInput = homeworkContainer.querySelector('#add-name-input');
let addValueInput = homeworkContainer.querySelector('#add-value-input');
//  let listBlock = homeworkContainer.querySelector('#list-block');
let listTable = homeworkContainer.querySelector('#list-table tbody');

function createCookie(name, value) {
    document.cookie = name + '=' + value;
}

function deleteCookie(name) {
    let date = new Date(0);

    createCookie(name, '; expires=' + date.toUTCString());
}

function getCookie() {
    if (document.cookie.length == 0) {
        return [];
    }
    let cookieStr = document.cookie;

    let cookieArr = cookieStr.split('; ');

    let cookieNameArr = [];

    for (let i = 0; i < cookieArr.length; i++) {
        let keyCookie = cookieArr[i].split('=');

        cookieNameArr[i] = {
            name: keyCookie[0],
            value: keyCookie[1]
        };
    }

    return cookieNameArr;
}

function isMatching (full, chunk) {
    full = full.toLowerCase();
    chunk = chunk.toLowerCase();

    if ( ~full.indexOf(chunk) && chunk.length != 0 ) {
        return true;
    }

    return false;
}

function createTableCookie(cookieArr) {
    var table = '';

    for (let key in cookieArr) {
        table += '<tr><td>' + cookieArr[key].name + '</td><td>' + cookieArr[key].value + '</td><td><button>удалить</button></td></tr>';
    }

    listTable.innerHTML = table;
}

listTable.addEventListener('click', function (e) {
    if (e.target.tagName == 'BUTTON') {
        let delParent = e.target.parentNode.parentNode;
        let delCookie = delParent.firstChild.textContent;

        deleteCookie(delCookie);

        listTable.removeChild(delParent);
    }
});

filterNameInput.addEventListener('keyup', function() {
    var cookieArrNew = [];
    var cookieArr = getCookie();

    for (let i = 0; i < cookieArr.length; i++) {
        if ( isMatching(cookieArr[i].name, filterNameInput.value) || isMatching(cookieArr[i].value, filterNameInput.value) ) {
            cookieArrNew.push({
                name: cookieArr[i].name,
                value: cookieArr[i].value
            });
        }
    }
    createTableCookie(cookieArrNew);

    if (this.value == '') {
        createTableCookie(getCookie());
    }
});

addButton.addEventListener('click', () => {
    if (!addNameInput.value == '' && !addValueInput.value == '') {
        createCookie(addNameInput.value, addValueInput.value);
    }
    /*if (filterNameInput.value.length) {
        createTableCookie(getCookie());
    }*/
    setTimeout(function () {
        addNameInput.value = addValueInput.value = '';
    }, 1000);

    if (filterNameInput.value == '') {
        createTableCookie(getCookie());
    }
});
