// Отримати всі елементи tabcontent
const tabContents = document.querySelectorAll(".tabcontent");

// Отримати всі елементи tablinks
const tabLinks = document.querySelectorAll(".menu a");

// Додати обробники подій кліку на заголовки списку та на піделементи
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
    // Створення діалогового вікна
    var dialogOverlay = document.createElement('div');
    dialogOverlay.classList.add('dialog-overlay');

    var dialogBox = document.createElement('div');
    dialogBox.classList.add('dialog-box');

    // Заголовок
    var dialogTitle = document.createElement('h2');
    dialogTitle.textContent = 'Діалогове вікно';

    // Поле введення
    var inputField = document.createElement('input');
    inputField.classList.add('dialog-input');
    inputField.value = this.question;

    // Зона для введення великого тексту
    var textareaField = document.createElement('textarea');
    textareaField.classList.add('dialog-textarea');
    textareaField.value = this.answer;

    // Кнопка зберегти
    var saveButton = document.createElement('span');
    saveButton.classList.add('dialog-save');
    saveButton.textContent = 'Зберегти';
    var sql_id = this.faq_id
    saveButton.onclick = function(){
        // Отримання значень полів введення
        const titleInput = document.querySelector('.dialog-input');
        const contentTextarea = document.querySelector('.dialog-textarea');
        const f_id = sql_id; // Ідентифікатор запису, який потрібно оновити
    
        // Перевірка наявності значень
        if (f_id && titleInput && contentTextarea) {
            // Відправка HTTP-запиту на сервер
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
                console.log(result); // Вивід результату в консоль
                dialogOverlay.remove();
                getFAQs();
            })
            .catch((error) => {
                console.error('Сталася помилка:', error);
            });
        } else {
            console.error('Значення не визначені');
        }
    };

    // Кнопка закрити
    var closeButton = document.createElement('span');
    closeButton.classList.add('dialog-close');
    closeButton.textContent = 'Закрити';
    
    closeButton.onclick = function() {
      // Закриття діалогового вікна
      dialogOverlay.remove();
    };

    // Додавання елементів до діалогового вікна
    dialogBox.appendChild(dialogTitle);
    dialogBox.appendChild(inputField);
    dialogBox.appendChild(textareaField);
    dialogBox.appendChild(closeButton);
    dialogBox.appendChild(saveButton);


    // Додавання діалогового вікна до DOM
    dialogOverlay.appendChild(dialogBox);
    document.body.appendChild(dialogOverlay);
  }

function fillTable(data) {
    var table = document.querySelector('#faqs .faq_table');

    // Очищуємо існуючі значення
    table.innerHTML = '';

    // Створюємо заголовок таблиці
    var headerRow = document.createElement('tr');
    var headerCell1 = document.createElement('th');
    var headerCell2 = document.createElement('th');
    headerCell1.textContent = 'Питання';
    headerCell2.textContent = 'Відповідь';
    headerRow.appendChild(headerCell1);
    headerRow.appendChild(headerCell2);
    table.appendChild(headerRow);

    // Створюємо рядки з даними
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
      remove_btn.onclick = function(){
        var faqId = this.faq_id;
    
        if (faqId) {
            // Відправка HTTP-запиту на сервер
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
                    console.log(result); // Вивід результату в консоль
                    getFAQs(); // Оновлення таблиці після видалення
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
    faq_sum_el.textContent='Всього питань: '+data.length
}

function getFAQs(){
    var dataArray = [
    ];
    fetch('/api/faq')
    .then(response => response.json())
    .then(data => {
      // Обробка отриманої JSON-відповіді
      data.forEach(element => {
          dataArray.push({sql_id:element.id,question:element.title,answer:element.content});
      });
      // Викликаємо функцію для заповнення таблиці
      fillTable(dataArray);   
    })
    .catch(error => {
      // Обробка помилок
      console.error('Помилка при отриманні даних:', error);
    });
}

// Прохід по елементам tablinks і додавання класу active для поточного/клікнутого tablink
for (const tabLink of tabLinks) {
    tabLink.addEventListener("click", function (e) {
        e.preventDefault();
        const tabId = this.getAttribute("href").substring(1);
        

        // Видалення класу active з усіх tablink
        for (const tabLink of tabLinks) {
            tabLink.classList.remove("active");
        }

        // Додавання класу active для клікнутого tablink
        this.classList.add("active");

        // Приховування всіх tabcontent
        for (const tabContent of tabContents) {
            tabContent.classList.remove("active");
        }

        // Показ обраного tabcontent
        document.getElementById(tabId).classList.add("active");
        if(tabId == "faqs"){
            getFAQs();  
        }
    });
}
