/* ДЗ 3 - работа с массивами и объеектами */

/*
 Задача 1:
 Напишите аналог встроенного метода forEach для работы с массивами
 */
function forEach(array, fn) {
    for ( let i = 0; i < array.length; i++ ) {
        fn(array[i], i, array);
    }
}

/*
 Задача 2:
 Напишите аналог встроенного метода map для работы с массивами
 */
function map(array, fn) {
    var result = [];

    for ( let i = 0; i < array.length; i++ ) {
        result.push(fn(array[i], i, array));
    }

    return result;
}

/*
 Задача 3:
 Напишите аналог встроенного метода reduce для работы с массивами
 */
function reduce(array, fn, initial) {
    if ( typeof initial == 'undefined' ) {
        var prev = array[0];

        for ( let i = 1; i < array.length; i++ ) {
            prev = fn(prev, array[i], i, array);
        }
    } else {
        prev = initial;

        for ( let i = 0; i < array.length; i++ ) {
            prev = fn(prev, array[i], i, array);
        }
    }

    return prev;
}

/*
 Задача 4:
 Функция принимает объект и имя свойства, которое необходиом удалить из объекта
 Функция должна удалить указанное свойство из указанного объекта
 */
function deleteProperty(obj, prop) {
    delete obj[prop];
}

/*
 Задача 5:
 Функция принимает объект и имя свойства и возвращает true или false
 Функция должна проверить существует ли укзаанное свойство в указанном объекте
 */
function hasProperty(obj, prop) {
    for ( var key in obj ) {
        if ( key == prop ) {
            return true;
        }
    }

    return false;
}

/*
 Задача 6:
 Функция должна получить все перечисляемые свойства объекта и вернуть их в виде массива
 */
function getEnumProps(obj) {
    let result = [];

    for ( var key in obj ) {
        if ( {}.hasOwnProperty.call(obj, key) ) {
            result.push(key);
        }
    }

    return result;
}

/*
 Задача 7:
 Функция должна перебрать все свойства объекта, преобразовать их имена в верхний регистра и вернуть в виде массива
 */
function upperProps(obj) {
    var result = [];

    for( var key in obj ) {
        result.push(key);
    }

    for( var i = 0; i < result.length; i++ ) {
        result[i] = result[i].toUpperCase();
    }

    return result;
}

/*
 Задача 8 *:
 Напишите аналог встроенного метода slice для работы с массивами
 */
function slice(array, from = 0, to) {
    var result = [];
    if ( to == undefined ) {
        to = array.length;

        if ( from < 0 ) {
            if ( -(from) > array.length ) {
                from = 0;
            } else {
                from = to + from;
            }
            for ( var i = from; i < to; i++ ) {
                result.push(array[i]);
            }
            return result;
        }
    }
    else {
        if (from == 0 && to == 0) {
            return result;
        }
        if ( to < 0) {
            to = array.length + to;
            if ( from < 0 && -from > array.length) {
                from = 0;
            }
            for ( var i = from; i < to; i++ ) {
                result.push(array[i]);
            }
            return result;
        }
        if ( to > array.length ) {
            to = array.length;
            for ( var i = from; i < to; i++ ) {
                result.push(array[i]);
            }
            return result;
        }

    }

    if ( from < 0 && -from > array.length ) {
        from = 0;
    }
    for ( let i = from; i < to; i++ ) {
        result.push(array[i]);
    }
    return result;
}

/*
 Задача 9 *:
 Функция принимает объект и должна вернуть Proxy для этого объекта
 Proxy должен перехватывать все попытки записи значений свойств и возводить это значение в квадрат
 */
function createProxy(obj) {
    var proxy = new Proxy(obj, {
        set(targer, prop, value) {
            targer[prop] = Math.pow(value, 2);
            return true;
        }
    });
    return proxy;
}

export {
    forEach,
    map,
    reduce,
    deleteProperty,
    hasProperty,
    getEnumProps,
    upperProps,
    slice,
    createProxy
};
