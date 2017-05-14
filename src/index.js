/* ДЗ 2 - работа с исключениями и отладчиком */

/*
 Задача 1:
 Функция принимает массив и фильтрующую фукнцию и должна вернуть true или false
 Функция должна вернуть true только если fn вернула true для всех элементов массива
 Необходимо выбрасывать исключение в случаях:
 - array не массив или пустой массив (с текстом "empty array")
 - fn не является функцией (с текстом "fn is not a function")
 Зарпещено использовать встроенные методы для работы с массивами
 */
var a1 = [2, 34, 3, 21];
function fn1 (e) {
    return e > 3;
}

function isAllTrue(array, fn) {

    if( !(array instanceof Array) || array.length == 0) {
        throw new Error('empty array');
    }
    if ( typeof fn != 'function' ) {
        throw new Error('fn is not a function');
    }

    for(var i = 0; i < array.length; i++) {
        if( !fn(array[i]) )
            return false;
    }

    return true;
}

try {
    isAllTrue(a1, fn1);
}
catch(e) {
    alert(e.message);
}


/*
 Задача 2:
 Функция принимает массив и фильтрующую фукнцию и должна вернуть true или false
 Функция должна вернуть true если fn вернула true хотя бы для одного из элементов массива
 Необходимо выбрасывать исключение в случаях:
 - array не массив или пустой массив (с текстом "empty array")
 - fn не является функцией (с текстом "fn is not a function")
         Зарпещено использовать встроенные методы для работы с массивами
 */

var a2 = [21, 22, 3, 55, 4];
function fn2 (e) { return !!e < 5; }
function isSomeTrue(array, fn) {
    if ( !(array instanceof Array) || array.length == 0) {
        throw new Error('empty array');
    }
    if ( typeof fn != 'function' ) {
        throw new Error('fn is not a function');
    }

    var result = false;
    for(var i = 0; i < array.length; i++) {
        if( fn2(array[i]) ) {
            result = true;
        }
    }
    return result;
}

isSomeTrue(a2, fn2);


/*
 Задача 3:
 Функция принимает заранее неизветсное количество аргументов, первым из которых является функция fn
 Функция должна поочередно запусти fn для каждого переданного аргумента (кроме самой fn)
 Функция должна вернуть массив аргументов, для которых fn выбросила исключение
 Необходимо выбрасывать исключение в случаях:
 - fn не является функцией (с текстом "fn is not a function")
 */

function returnBadArguments() {

    if(typeof(arguments[0]) == 'function'){
        var fn = arguments[0];
    }else{
        throw Error('fn is not a function');
    }

    var result = [];
    for(var i = 1; i < arguments.length; i++){
        try {
            fn(arguments[i]);
        } catch (e){
            result.push(arguments[i]);
        }
    }
    return result;
}

var fn3 = function(n){
    if(n > 3){
        throw Error('Warning: parameter ' + n + ' > 3');
    }
};

returnBadArguments(fn3, 2, false, 'red', 3, 44, 5);


/*
 Задача 4:
 Функция имеет параметр number (по умолчанию - 0)
 Функция должна вернуть объект, у которого должно быть несколько методов:
 - sum - складывает number с переданными аргументами
 - dif - вычитает из number переданные аргументы
 - div - делит number на первый аргумент. Результат делится на следующий аргумент (если передан) и так далее
 - mul - умножает number на первый аргумент. Результат умножается на следующий аргумент (если передан) и так далее

 Количество передаваемых в методы аргументов заранее неизвестно
 Необходимо выбрасывать исключение в случаях:
 - number не является числом (с текстом "number is not a number")
 - какой-либо из аргументов div является нулем (с текстом "division by 0")
 */
function calculator(number = 0) {

    if ( typeof number != 'number' ) {
        throw new Error('number is not a number');
    }

    return {
        sum: function() {
            var sum = number;
            for( var arg in arguments) {
                sum += arguments[arg];
            }
            return sum;
        },
        dif: function() {
            var dif = number;
            for( var arg in arguments) {
                dif -= arguments[arg];
            }
            return dif;
        },
        div: function() {
            var isNull = false;
            for( var arg in arguments) {
                if ( arguments[arg] == 0) {
                    isNull = true;
                }
            }
            if (isNull) {
                throw new Error('division by 0');
            }

            var div = number;
            for( var arg in arguments) {
                div /= arguments[arg];
            }

            return div;
        },
        mul: function() {
            var mul = number;
            for( var arg in arguments) {
                mul *= arguments[arg];
            }
            return mul;
        }
    };
}


export {
    isAllTrue,
    isSomeTrue,
    returnBadArguments,
    calculator
};
