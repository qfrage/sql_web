const tabContents = document.querySelectorAll(".tabcontent");

const tabLinks = document.querySelectorAll(".menu a");

var allFAQs = -1;

var toggles = document.getElementsByClassName("toggle");
for (var i = 0; i < toggles.length; i++) {
    toggles[i].addEventListener("click", function () {
        this.classList.toggle("active");
        var nestedList = this.nextElementSibling;
        if (nestedList.style.display === "block") {
            nestedList.style.display = "none";
        } else {
            nestedList.style.display = "block";
        }
    });
}

var subtopics = document.getElementsByClassName("subtopic");
for (var i = 0; i < subtopics.length; i++) {
    subtopics[i].addEventListener("click", function () {
        alert(this.innerHTML);
    });
}

function openDialogEditFAQ() {
    var dialogOverlay = document.createElement('div');
    dialogOverlay.classList.add('dialog-overlay');

    var dialogBox = document.createElement('div');
    dialogBox.classList.add('dialog-box');

    var dialogTitle = document.createElement('h2');
    dialogTitle.textContent = 'Редагування';

    var inputField = document.createElement('input');
    inputField.classList.add('dialog-input');
    if (this.question) inputField.value = this.question;
    else inputField.placeholder = 'Питання'

    var textareaField = document.createElement('textarea');
    textareaField.classList.add('dialog-textarea');
    if (this.answer) textareaField.value = this.answer;
    else textareaField.placeholder = 'Відповідь'

    var saveButton = document.createElement('span');
    saveButton.classList.add('dialog-save');
    saveButton.textContent = 'Зберегти';
    var sql_id = this.faq_id
    saveButton.onclick = function () {
        const titleInput = document.querySelector('.dialog-input');
        const contentTextarea = document.querySelector('.dialog-textarea');
        const f_id = sql_id;

        if (titleInput.value && contentTextarea.value) {
            fetch('/updateFaq', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: f_id,
                    title: titleInput.value,
                    content: contentTextarea.value,
                }),
            })
                .then((response) => response.text())
                .then((result) => {
                    showPopup(result);
                    dialogOverlay.remove();
                    getFAQs();
                })
                .catch((error) => {
                    showPopup('Сталася помилка:' + error);
                });
        } else {
            showPopup('Не всі поля заповнені');
        }
    };

    var closeButton = document.createElement('span');
    closeButton.classList.add('dialog-close');
    closeButton.textContent = 'Закрити';

    closeButton.onclick = function () {
        dialogOverlay.remove();
    };

    dialogBox.appendChild(dialogTitle);
    dialogBox.appendChild(inputField);
    dialogBox.appendChild(textareaField);
    dialogBox.appendChild(closeButton);
    dialogBox.appendChild(saveButton);


    dialogOverlay.appendChild(dialogBox);
    document.body.appendChild(dialogOverlay);
}

function fillTableUsers(data) {
    var table = document.querySelector('#users .users_table');

    table.innerHTML = '';

    var headerRow = document.createElement('tr');
    var headerCell1 = document.createElement('th');
    var headerCell2 = document.createElement('th');
    var headerCell3 = document.createElement('th');
    var headerCell4 = document.createElement('th');

    headerCell1.textContent = 'Name';
    headerCell2.textContent = 'Заблокований';
    headerCell3.textContent = 'Admin';
    headerCell4.textContent = 'Telegram ID';
    headerRow.appendChild(headerCell1);
    headerRow.appendChild(headerCell2);
    headerRow.appendChild(headerCell3);
    headerRow.appendChild(headerCell4);

    table.appendChild(headerRow);

    for (var i = 0; i < data.length; i++) {
        var rowData = data[i];
        var row = document.createElement('tr');
        var name = document.createElement('td');
        var blocked = document.createElement('td');
        var admin = document.createElement('td');
        var telegram_id = document.createElement('td');
        var blockButton = document.createElement('button');
        var adminButton = document.createElement('button');

        name.classList.add('users_name');
        blocked.classList.add('users_blocked');
        admin.classList.add('users_admin');
        telegram_id.classList.add('users_telegram_id');

        name.textContent = rowData.user_name;
        telegram_id.textContent = rowData.user_telegram_id;
        blocked.textContent = rowData.user_blocked;
        admin.textContent = rowData.user_admin;
        blockButton.textContent = rowData.user_blocked ? 'Розблокувати' : 'Заблокувати';
        blockButton.sql_id = rowData.user_telegram_id;
        blockButton.status = rowData.user_blocked;
        blockButton.classList.add("user_button");

        blockButton.onclick = function () {
            var id = this.sql_id;
            var isBlocked = this.status;
            var oppositeValue = isBlocked ? 0 : 1;
            // Отправка запроса на сервер для обновления значения is_blocked
            fetch('/update-user-blocked', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: id,
                    is_blocked: oppositeValue
                })
            })
                .then(function (response) {
                    // Обработка ответа от сервера
                    if (response.ok) {
                        // Обновление значения в таблице или выполнение других действий
                        getUsers();
                    } else {
                        // Обработка ошибки при обновлении значения
                        console.error('Ошибка при обновлении значения is_blocked');
                    }
                })
                .catch(function (error) {
                    // Обработка ошибок сети или других ошибок
                    console.error('Ошибка при выполнении запроса:', error);
                });
        };
        adminButton.textContent = rowData.user_admin ? 'Забрати адмінку' : 'Видати адмінку';
        adminButton.sql_id = rowData.user_telegram_id;
        adminButton.status = rowData.user_admin;
        adminButton.classList.add("user_button");
        adminButton.onclick = function(){
            var isAdmin = this.status;
            var oppositeValue = isAdmin ? 0 : 1;
            var id = this.sql_id;
            // Отправка запроса на сервер для обновления значения is_admin
            fetch('/update-user-admin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: id,
                    is_admin: oppositeValue
                })
            })
                .then(function (response) {
                    // Обработка ответа от сервера
                    if (response.ok) {
                        // Обновление значения в таблице или выполнение других действий
                        getUsers();
                    } else {
                        // Обработка ошибки при обновлении значения
                        console.error('Ошибка при обновлении значения is_admin');
                    }
                })
                .catch(function (error) {
                    // Обработка ошибок сети или других ошибок
                    console.error('Ошибка при выполнении запроса:', error);
                });
        };

        row.appendChild(name);
        row.appendChild(blocked);
        row.appendChild(admin);
        row.appendChild(telegram_id);
        row.appendChild(blockButton);
        row.appendChild(adminButton);
        table.appendChild(row);
    }

    const user_sum_el = document.getElementById('users_sum');
    user_sum_el.textContent = 'Всього: ' + data.length;
}


function fillTableFAQ(data) {
    var table = document.querySelector('#faqs .faq_table');

    table.innerHTML = '';

    var headerRow = document.createElement('tr');
    var headerCell1 = document.createElement('th');
    var headerCell2 = document.createElement('th');
    headerCell1.textContent = 'Питання';
    headerCell2.textContent = 'Відповідь';
    headerRow.appendChild(headerCell1);
    headerRow.appendChild(headerCell2);
    table.appendChild(headerRow);

    for (var i = 0; i < data.length; i++) {
        var rowData = data[i];
        var row = document.createElement('tr');
        var cell1 = document.createElement('td');
        var cell2 = document.createElement('td');
        var edit_btn = document.createElement('td');
        var remove_btn = document.createElement('td');

        cell1.classList.add('faq_title')
        cell2.classList.add('faq_content')
        edit_btn.classList.add('faq_edit_btn')
        remove_btn.classList.add('faq_remove_btn');
        cell1.textContent = rowData.question;
        cell2.textContent = rowData.answer;
        edit_btn.faq_id = rowData.sql_id;
        edit_btn.answer = rowData.answer;
        edit_btn.question = rowData.question;
        edit_btn.textContent = 'Редагувати'
        edit_btn.addEventListener('click', openDialogEditFAQ);
        remove_btn.textContent = 'Видалити'
        remove_btn.faq_id = rowData.sql_id;
        remove_btn.onclick = function () {
            var faqId = this.faq_id;

            if (faqId) {
                fetch('/deleteFaq', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        id: faqId
                    }),
                })
                    .then((response) => response.text())
                    .then((result) => {
                        showPopup(result);
                        getFAQs();
                    })
                    .catch((error) => {
                        console.error('Помилка:', error);
                    });
            } else {
                console.error('Ідентифікатор не визначений');
            }
        }
        row.appendChild(cell1);
        row.appendChild(cell2);
        row.appendChild(edit_btn);
        row.appendChild(remove_btn);
        table.appendChild(row);
    }
    const faq_sum_el = document.getElementById('faq_sum')
    faq_sum_el.textContent = 'Всього питань: ' + data.length
    allFAQs = data.length;
}

function getUsers() {
    var dataArray = [
    ];
    fetch('/api/users')
        .then(response => response.json())
        .then(data => {
            data.forEach(element => {
                dataArray.push({ user_telegram_id: element.user_id, user_name: element.username, user_blocked: element.is_blocked, user_admin: element.is_admin });
            });
            fillTableUsers(dataArray);
        })
        .catch(error => {
            console.error('Помилка при отриманні даних:', error);
        });
}

function getFAQs() {
    var dataArray = [
    ];
    fetch('/api/faq')
        .then(response => response.json())
        .then(data => {
            data.forEach(element => {
                dataArray.push({ sql_id: element.id, question: element.title, answer: element.content });
            });
            fillTableFAQ(dataArray);
        })
        .catch(error => {
            console.error('Помилка при отриманні даних:', error);
        });
}

for (const tabLink of tabLinks) {
    tabLink.addEventListener("click", function (e) {
        e.preventDefault();
        const tabId = this.getAttribute("href").substring(1);


        for (const tabLink of tabLinks) {
            tabLink.classList.remove("active");
        }

        this.classList.add("active");

        for (const tabContent of tabContents) {
            tabContent.classList.remove("active");
        }
        document.getElementById(tabId).classList.add("active");
        if (tabId == "faqs") {
            getFAQs();
        }
        else if (tabId == 'users') {
            getUsers();
        }
    });
}

var addButton = document.querySelector('.add-button');

addButton.addEventListener('click', function () {
    openDialogEditFAQ();
});


const inputField = document.querySelector('.input-field');
const inputFieldUsers = document.querySelector('.input-field-users')

inputFieldUsers.addEventListener('input', function (event) {
    const inputValue = event.target.value.toLowerCase();
    const faqRows = document.querySelectorAll('.users_table tr');

    for (const faqRow of faqRows) {
        const userName = faqRow.querySelector('.users_name');
        const userTelegram = faqRow.querySelector('.users_telegram_id')
        if (userName && userTelegram) {
            const nameText = userName.textContent.toLowerCase();
            const telegramText = userTelegram.textContent.toLowerCase();
            if (nameText.includes(inputValue) || telegramText.includes(inputValue)) {
                faqRow.style.display = 'table-row';
            } else {
                faqRow.style.display = 'none';
            }
        }
    }
});
inputField.addEventListener('input', function (event) {
    const inputValue = event.target.value.toLowerCase();
    const faqRows = document.querySelectorAll('.faq_table tr');
    // Перебираємо теги <tr>
    for (const faqRow of faqRows) {
        const faqTitle = faqRow.querySelector('.faq_title');
        const faqContent = faqRow.querySelector('.faq_content');

        if (faqTitle && faqContent) {
            const titleText = faqTitle.textContent.toLowerCase();
            const contentText = faqContent.textContent.toLowerCase();

            if (titleText.includes(inputValue) || contentText.includes(inputValue)) {
                faqRow.style.display = 'table-row';
            } else {
                faqRow.style.display = 'none';
            }
        }
    }
});

function checkUpdateInDB() {
    const tab = document.getElementById('faqs');
    if (tab.classList.contains("active")) {
        fetch('/api/faq')
            .then(response => response.json())
            .then(data => {
                if (allFAQs != data.length) {
                    showPopup("База даних оновилась!");
                    allFAQs = data.length;
                    getFAQs();
                }
            })
            .catch(error => {
                console.error('Помилка при отриманні даних:', error);
            });
    }
}

setInterval(checkUpdateInDB, 5000);

function showPopup(text) {
    const popupContainer = document.createElement('div');
    const popupText = document.createElement('p');

    popupText.textContent = text;

    popupContainer.classList.add('popup-container');
    popupText.classList.add('popup-text');

    popupContainer.appendChild(popupText);

    document.body.appendChild(popupContainer);

    const existingPopups = document.querySelectorAll('.popup-container');
    existingPopups.forEach((popup, index) => {
        popup.style.transform = `translateY(${index * 80}px)`;
    });

    setTimeout(function () {
        popupContainer.classList.add('popup-fade-out');
        setTimeout(function () {
            document.body.removeChild(popupContainer);

            const remainingPopups = document.querySelectorAll('.popup-container');
            remainingPopups.forEach((popup, index) => {
                popup.style.transform = `translateY(${index * 80}px)`;
            });
        }, 500);
    }, 3000);
}