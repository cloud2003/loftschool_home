var myFriends = document.querySelector('#myFriends');
var addedFriends = document.querySelector('#addedFriends');
var buttonSafe = document.querySelector('#buttonSafe');
var filterInput = document.querySelectorAll('.filter');
var filterAllFriends = document.querySelector('#filterAllFriends');
var filterSelectedFriends = document.querySelector('#filterSelectedFriends');
let listOfFriends = [];
let vkRequest;

var vkModule = {
  Init: function () {

    function filterName(event) {
      var list = event.dataset.list;
      var listArr;

      if (list == 'myFriends') {
        listArr = vkRequest.items;
      } else {
        if (list == 'addedFriends') {
          listArr = listOfFriends;
        }
      }

      if (event.value != '') {
        var newListFilter = listArr.filter(function (person) {
          if (isMatching(person.first_name, event.value) || isMatching(person.last_name, event.value)) {
            return true;
          }
        });

        createFriendsList(document.getElementById(list), newListFilter);
      } else {
        createFriendsList(document.getElementById(list), listArr);
      }
    }

    filterInput.forEach(function (el) {
      el.addEventListener('keyup', function (e) {
        filterName(e.target);
      });
    });

    // Save in localStorage
    buttonSafe.addEventListener('click', function () {
      localStorage.setItem('listOfFriends', JSON.stringify(listOfFriends));
      localStorage.setItem('vkRequest', JSON.stringify(vkRequest));
    });

    // addButton
    myFriends.addEventListener('click', function (e) {
      if (e.target.className == 'b-list__plus') {
        vkRequest.items.filter(function (person, i) {
          if (e.path[0].id == person.id) {
            listOfFriends.push(person);
            vkRequest.items.splice(i, 1);
          }
        });
        // list rendering
        createFriendsList(addedFriends, listOfFriends);
        createFriendsList(myFriends, vkRequest.items);
      }
      filterName(filterAllFriends);
      filterSelectedFriends.value = '';
    });

    // deleteButton
    addedFriends.addEventListener('click', function (e) {
      if (e.target.className == 'b-list__plus') {
        listOfFriends.filter(function (person, i) {
          if (e.path[0].id == person.id) {
            vkRequest.items.push(person);
            listOfFriends.splice(i, 1);
          }
        });

        // list rendering
        createFriendsList(addedFriends, listOfFriends);
        createFriendsList(myFriends, vkRequest.items);
      }
      filterName(filterSelectedFriends);
      filterAllFriends.value = '';
    });
  }
};

function dragStart(ev) {
  //console.log(ev.target.getAttribute('id'));
  ev.dataTransfer.effectAllowed = 'move';
  ev.dataTransfer.setData("text/plain", ev.target.getAttribute('id'));
  ev.dataTransfer.setDragImage(ev.target, 165, 10);
  return true;
}
function dragEnter(ev) {
  event.preventDefault();
  return true;
}
function dragOver(ev) {
  event.preventDefault();
}
function dragDrop(ev) {
  var data = ev.dataTransfer.getData("text/plain");
  //console.log('getElementById(data)', data);
  ev.target.appendChild(document.getElementById(data));
  ev.stopPropagation();

  // if (ev.target.className == 'b-list__plus') {
    vkRequest.items.filter(function (person, i) {
      if (ev.path[0].id == person.id) {
        listOfFriends.push(person);
        vkRequest.items.splice(i, 1);
      }
    });
    // list rendering
    createFriendsList(addedFriends, listOfFriends);
    createFriendsList(myFriends, vkRequest.items);
  // }
  filterName(filterAllFriends);
  filterSelectedFriends.value = '';

  return false;
}

function createFriendsList(where, obj) {
  where.innerHTML = templateFn(obj);
}

function isMatching(full, chunk) {
  full = full.toLowerCase();
  chunk = chunk.toLowerCase();

  if (~full.indexOf(chunk) && chunk.length != 0) {
    return true;
  }

  return false;
}

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

var template = `
    {{#each []}}
    <div id="d_{{id}}" class="b-list__item" draggable="true" ondragstart="return dragStart(event)">
        <div class="b-list__plus" id="{{id}}"></div>
        <div class="b-list__img"><img src="{{#with photo_100}}{{this}}{{else}}img/no-image.gif{{/with}}" alt="{{first_name}} {{last_name}}" /></div>
        <div class="b-list__name">{{first_name}} {{last_name}}</div>
    </div>
    {{/each}}`;
var templateFn = Handlebars.compile(template);

new Promise(function (resolve, reject) {
  VK.init({
    apiId: 6056913
  });

  VK.Auth.login(function (response) {
    if (response.session) {
      resolve(response);
    } else {
      reject(new Error('Пользователь нажал кнопку Отмена в окне авторизации'));
    }
  }, 2);
})
  .then(() => vkApi('friends.get', {v: '5.64', 'fields': 'country, city, photo_100'}))
  .then(function (response) {
    if (window.localStorage.hasOwnProperty('listOfFriends') && window.localStorage.hasOwnProperty('vkRequest')) {
      vkRequest = JSON.parse(localStorage.getItem('vkRequest'));
      listOfFriends = JSON.parse(localStorage.getItem('listOfFriends'));
      createFriendsList(myFriends, vkRequest.items);
      createFriendsList(addedFriends, listOfFriends);
    } else {
      createFriendsList(myFriends, response.response.items);
      vkRequest = response.response;
    }
  })
  .then(() => vkModule.Init())
  .catch(e => alert('Ошибка ' + e.message));
