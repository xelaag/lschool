/*
 ДЗ 7 - Создать редактор cookie с возможностью фильтрации

 7.1: На странице должна быть таблица со списком имеющихся cookie. Таблица должна иметь следующие столбцы:
   - имя
   - значение
   - удалить (при нажатии на кнопку, выбранная cookie удаляется из браузера и таблицы)

 7.2: На странице должна быть форма для добавления новой cookie. Форма должна содержать следующие поля:
   - имя
   - значение
   - добавить (при нажатии на кнопку, в браузер и таблицу добавляется новая cookie с указанным именем и значением)

 Если добавляется cookie с именем уже существующией cookie, то ее значение в браузере и таблице должно быть обновлено

 7.3: На странице должно быть текстовое поле для фильтрации cookie
 В таблице должны быть только те cookie, в имени или значении которых, хотя бы частично, есть введенное значение
 Если в поле фильтра пусто, то должны выводиться все доступные cookie
 Если дабавляемая cookie не соответсвуте фильтру, то она должна быть добавлена только в браузер, но не в таблицу
 Если добавляется cookie, с именем уже существующией cookie и ее новое значение не соответствует фильтру,
 то ее значение должно быть обновлено в браузере, а из таблицы cookie должна быть удалена

 Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/*
 homeworkContainer - это контейнер для всех ваших домашних заданий
 Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер

 Пример:
   const newDiv = document.createElement('div');
   homeworkContainer.appendChild(newDiv);
 */
const homeworkContainer = document.querySelector('#homework-container');
// текстовое поле для фильтрации cookie
const filterNameInput = homeworkContainer.querySelector('#filter-name-input');
// текстовое поле с именем cookie
const addNameInput = homeworkContainer.querySelector('#add-name-input');
// текстовое поле со значением cookie
const addValueInput = homeworkContainer.querySelector('#add-value-input');
// кнопка "добавить cookie"
const addButton = homeworkContainer.querySelector('#add-button');
// таблица со списком cookie
const listTable = homeworkContainer.querySelector('#list-table tbody');
let inputValue = '';
var keyUp = false,
    fragment = document.createDocumentFragment();

var cookieObj = document.cookie.split('; ').reduce((prev, current) => {
    const [name, value] = current.split('=');

    prev[name] = value;

    return prev;
}, {});

// здесь можно обработать нажатия на клавиши внутри текстового поля для фильтрации cookie
filterNameInput.addEventListener('keyup', function () {
    keyUp = true;
    deleteNodes(listTable);
    if (filterNameInput.value !== '') {
        inputValue = filterNameInput.value;
        for (let cookieOne in cookieObj) {
            let cookieLowName = cookieOne;
            let cookieLowValue = cookieObj[cookieOne];

            cookieLowName = cookieLowName.toLowerCase();
            cookieLowValue = cookieLowValue.toLowerCase();

            if (isMatching(cookieLowName, inputValue)) {
                createTR(cookieOne, cookieObj[cookieOne]);
            } else {
                if (isMatching(cookieLowValue, inputValue)) {
                    createTR(cookieOne, cookieObj[cookieOne]);
                }
            }
        }
    } else {
        for (var cookie in cookieObj) {
            createTR(cookie, cookieObj[cookie]);
        }
    }

});

// Если filterNameInput пуст и нет эвента keyUp на filterNameInput
if (!keyUp) {
    for (var cookie in cookieObj) {
        createTR(cookie, cookieObj[cookie]);
    }
}

// здесь можно обработать нажатие на кнопку "добавить cookie"
addButton.addEventListener('click', () => {
    document.cookie = `${addNameInput.value}=${addValueInput.value}`;
    addNameInput.value = '';
    addValueInput.value = '';
    cookieObj = document.cookie.split('; ').reduce((prev, current) => {
        const [name, value] = current.split('=');

        prev[name] = value;

        return prev;
    }, {});
    deleteNodes(listTable);
    for (var cookie in cookieObj) {
        createTR(cookie, cookieObj[cookie]);
    }
});

function createTR(name, value) {
    const tr = document.createElement('tr');
    const tdName = document.createElement('td');
    const tdValue = document.createElement('td');

    tdName.innerText = name;
    tdValue.innerText = value;
    const deleteButton = document.createElement('button');

    deleteButton.textContent = 'удалить';
    deleteButton.addEventListener(('click'), () => {
        listTable.removeChild(tr);
        var cookieDate = new Date();

        cookieDate.setTime(cookieDate.getTime() - 1);
        document.cookie = name += '=; expires= ' + cookieDate.toUTCString();
        cookieObj = document.cookie.split('; ').reduce((prev, current) => {
            const [name, value] = current.split('=');

            prev[name] = value;

            return prev;
        }, {});
        deleteNodes(listTable);
        for (var cookie in cookieObj) {
            createTR(cookie, cookieObj[cookie]);
        }
    });

    tr.appendChild(tdName);
    tr.appendChild(tdValue);
    tr.appendChild(deleteButton);

    fragment.appendChild(tr);
    listTable.appendChild(fragment);
}

function isMatching(full, chunk) {
    full = full.toLowerCase();
    chunk = chunk.toLowerCase();
    if (full.indexOf(chunk) !== -1) {
        return true;
    }

    return false
}

function deleteNodes(where) {
    for (var i = 0; i < where.children.length; i++) {
        where.removeChild(where.children[i]);
        --i;
    }

    return where;
}
