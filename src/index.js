//6056913
new Promise(function (resolve) {
   /*
   window.addEventListener('load', function () {
       resolve();
   });
   */
   window.onload = resolve();
}).then(function () {
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
    .then(function () {
        return new Promise(function (resolve, reject) {
           VK.api('users.get', {'name_case' : 'gen'}, function (responce) {
               if (responce.error) {
                   reject(new Error(responce.error.error_msg));
               } else {
                   console.log(responce);
                   //myFriends.textContent = `Друзья ${responce.response[0].first_name}`;
                   resolve();
               }

           });
        });
    });