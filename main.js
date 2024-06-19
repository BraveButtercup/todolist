//Define elements

const FORM = document.querySelector(".js-new-todo");
const toDoInput = document.querySelector(".js-newtodo");
const toDoListEl = document.querySelector(".js-todos-list")
const notificationEl = document.querySelector(".js-notification")

//Variables

let toDoList = JSON.parse(localStorage.getItem('todos')) || [];
let editID = -1;


// Form submit and get items from local storage
FORM.addEventListener("submit", (e) => {
    e.preventDefault();
    saveTodo();
    renderToDo();
    localStorage.setItem('todos', JSON.stringify(toDoList));
})

// First rendering 
renderToDo();

// Rendering todos
function renderToDo() {
    toDoListEl.innerHTML = "";
    if (toDoList.length === 0) {
        toDoListEl.innerHTML = "<center>Nothing to do<center/>";
        return
    }
    let listEl = toDoList.map((todo, index) => `
          <div class="todo" id="${index}">
          <i class="${todo.checked ? 'bi bi-check-circle' : 'bi bi-circle'}"  style="color:${todo.color}" data-action = "check"></i>
          <p class="${todo.checked ? 'checked' : ''}" data-action = "check"> ${todo.value}</p>
          <i class="bi bi-pencil-square" data-action="edit"></i>
          <i class="bi bi-trash" data-action="delete"></i>
        </div>
 `);
    toDoListEl.innerHTML += listEl.join('');
}

// Saving todo's and validate input 
function saveTodo() {
    let todoValue = toDoInput.value;
    let isEmpty = todoValue === "";
    let isDuplicate = toDoList.some((toDos) => toDos.value.toUpperCase() == todoValue.toUpperCase());
    if (isEmpty) {
        showNotification("The input is empty")
    } else if (isDuplicate) {
        showNotification("You have this to-do already")
    } else {
        if (editID >= 0) {
            toDoList = toDoList.map((item, index) => ({
                ...item,
                value: index === editID ? todoValue : item.value,
            })
            );
            editID = -1;
        } else {
            toDoList.push({
                value: todoValue,
                checked: false,
                color: '#' + Math.floor(Math.random() * 16777215).toString(16)
            });

        }
        toDoInput.value = "";
    }
};

// Notifications to validation
function showNotification(msg) {
    notificationEl.innerHTML = msg;
    notificationEl.classList.add("notif-enter");
    setTimeout(() => {
        notificationEl.classList.remove("notif-enter")
    }, 2000
    )
};

// Handling events / check, edit, delete
toDoListEl.addEventListener("click", (e) => {
    let item = e.target;
    let szuloElem = item.parentNode;
    if (szuloElem.className !== "todo") return;
    let szuloelemID = Number(szuloElem.id);
    let action = item.dataset.action;

    action === "check" && checkToDo(szuloelemID);
    action === "edit" && editToDo(szuloelemID);
    action === "delete" && deleteToDo(szuloelemID);

})

// Check a todo an re-rendering elements
function checkToDo(ID) {
    toDoList = toDoList.map((todo, index) =>
    ({
        ...todo,
        checked: ID === index ? !todo.checked : todo.checked
    }))

    renderToDo();
    localStorage.setItem('todos', JSON.stringify(toDoList));
}

// Edit a todo
function editToDo(ID) {
    toDoInput.value = toDoList[ID].value;
    editID = ID;
};

// Delete a to do and re-rendering elements / editID value to -1 
function deleteToDo(ID) {
    toDoList = toDoList.filter((item, index) => index !== ID);
    editID = -1;
    renderToDo();
    localStorage.setItem('todos', JSON.stringify(toDoList));
}

