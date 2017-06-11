var myFriends = document.querySelector('#myFriends');
var addButton = document.querySelector('#myFriends .b-list__plus');
var addedFriends = document.querySelector('#addedFriends');
var deleteButton = document.querySelector('#addedFriends .b-list__plus');
var filterNameInput = document.querySelector('#filterNameInput');
var loadListOfFriends;

var myModule = {
    Init: function() {
        loadListOfFriends = document.querySelectorAll('.b-list__item');

        //типо фильтрация
        filterNameInput.addEventListener('keyup', function(e) {
            loadListOfFriends.forEach(function (person) {
                if ( !isMatching(person.querySelector('.b-list__name').innerText, e.target.value) && e.target.value != '' ) {
                    person.style.display = 'none';
                } else {
                    person.style = '';
                }
            });
        });
    }
};

function vkApi(method, options) {
    return new Promise(function (resolve, reject) {
        VK.api(method, options, function (responce) {
            if (responce.error) {
                reject(new Error(responce.error.error_msg));
            } else {
                resolve(responce);
            }
        });
    });
}

function createFriendsList(obj) {
    //console.log(obj);
    var html = templateFn(obj);
    myFriends.innerHTML = html;
}

function isMatching (full, chunk) {
    // console.log('full, chunk');
    // console.log(full, chunk);
    full = full.toLowerCase();
    chunk = chunk.toLowerCase();

    if ( ~full.indexOf(chunk) && chunk.length != 0 ) {
        return true;
    }

    return false;
}

var template = `
    {{#each items}}
    <div class="b-list__item" id="{{id}}">
        <div class="b-list__plus"></div>
        <div class="b-list__img"><img src="{{#with photo_100}}{{this}}{{else}}img/no-image.gif{{/with}}" alt="{{first_name}} {{last_name}}" /></div>
        <div class="b-list__name">{{first_name}} {{last_name}}</div>
    </div>
    {{/each}}`;
var templateFn = Handlebars.compile(template);


new Promise(function (resolve) {
        window.onload = resolve();
    })
    .then(() => {
        return new Promise(function (resolve, reject) {
            VK.init({
                apiId: 6056913
            });

            VK.Auth.login(function(response) {
                if (response.session) {
                    resolve(response);
                } else {
                    reject(new Error('Пользователь нажал кнопку Отмена в окне авторизации'));
                }
            }, 2);
        });
    })
    .then(() => vkApi('friends.get', {v: '5.64', 'fields' : 'country, city, photo_100'}))
    .then(responce => createFriendsList(responce.response))
    .then(() => myModule.Init())
    .catch(e => alert('Ошибка ' + e.message));

