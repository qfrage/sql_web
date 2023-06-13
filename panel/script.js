// Get all tabcontent elements
const tabContents = document.querySelectorAll(".tabcontent");

// Get all tablinks elements
const tabLinks = document.querySelectorAll(".menu a");

// добавляем обработчики клика на заголовки списка и на подэлементы
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

function fillTable(data) {
    var table = document.querySelector('#faqs .faq_table');

    // Очищаем существующие значения
    table.innerHTML = '';

    // Создаем заголовок таблицы
    var headerRow = document.createElement('tr');
    var headerCell1 = document.createElement('th');
    var headerCell2 = document.createElement('th');
    headerCell1.textContent = 'Питання';
    headerCell2.textContent = 'Відповідь';
    headerRow.appendChild(headerCell1);
    headerRow.appendChild(headerCell2);
    table.appendChild(headerRow);

    // Создаем строки с данными
    for (var i = 0; i < data.length; i++) {
      var rowData = data[i];
      var row = document.createElement('tr');
      var cell1 = document.createElement('td');
      var cell2 = document.createElement('td');
      cell1.textContent = rowData.question;
      cell2.textContent = rowData.answer;
      row.appendChild(cell1);
      row.appendChild(cell2);
      table.appendChild(row);
    }
}

// Loop through the tablinks elements and add the active class to the current/clicked tablink
for (const tabLink of tabLinks) {
    tabLink.addEventListener("click", function (e) {
        e.preventDefault();
        const tabId = this.getAttribute("href").substring(1);
        

        // Remove the active class from all tablinks
        for (const tabLink of tabLinks) {
            tabLink.classList.remove("active");
        }

        // Add the active class to the clicked tablink
        this.classList.add("active");

        // Hide all tabcontents
        for (const tabContent of tabContents) {
            tabContent.classList.remove("active");
        }

        // Show the selected tabcontent
        document.getElementById(tabId).classList.add("active");
        if(tabId == "faqs"){
            var dataArray = [
              ];
              fetch('/api/faq')
              .then(response => response.json())
              .then(data => {
                // Обработка полученного JSON-ответа
                data.forEach(element => {
                    dataArray.push({question:element.title,answer:element.content});
                });
                // Вызываем функцию для заполнения таблицы
                fillTable(dataArray);   
              })
              .catch(error => {
                // Обработка ошибок
                console.error('Ошибка при получении данных:', error);
              });
              
        }
    });
}
