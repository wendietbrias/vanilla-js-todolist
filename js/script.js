'use-strict';

//todos
let todos = JSON.parse(localStorage.getItem("todos")) || [];

//elemet html
const todoInput = document.getElementById('todo-input');
const todoContent = document.querySelector('.todo-content');
const categoriesButton  = document.querySelectorAll('.todo-side-left-btn button');
const clearButton = document.getElementById('clear');

//category todos
let categories = 'all';

categoriesButton.forEach((button) => {
    if(button.getAttribute('id').includes(categories)) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      } 
});

//reusable function
function renderAlertHtml(message) {
    return  `
            <div class="alert">
              <p>${message}</p>
            </div>
         `;
 }

function renderTodoItemHtml(todo,index) {
    return `
      <div class="todo-item">
        <div class="todo-title">
        <input data-type="create" ${todo.checked ? "checked" : ""} data-id="${todo.id}" class="check-input" type="checkbox">
        <p>${todo.title}</p>
        </div>
        <button data-index="${index}" class="menu"><i class="ri-more-line"></i></button>
        <div style="display:none" class="wrap-menu">
          <button class="update-todo-btn" data-id="${todo.id}">
          <i class="ri-edit-line"></i>
          Update
          </button>
          <button class="delete-todo-btn" data-id="${todo.id}">
          <i class="ri-delete-bin-7-line"></i>
          Delete
          </button>
        </div>
      </div>
    `;
}

 function renderTodosHtml(todos) {
   let temp = '';

   if(Array.isArray(todos)) {
      todos.map((todo,index) => {
          temp += renderTodoItemHtml(todo, index);
      });

     return todoContent.innerHTML = `
      <div class="todo-items">
      ${temp}
      </div>
   `;
   }   
 }
 
//functionality

function allTodoBehavior() {
  const deleteTodoBtn = document.querySelectorAll('.delete-todo-btn');
  const updateTodoBtn = document.querySelectorAll('.update-todo-btn');
  const checkInput = document.querySelectorAll('.check-input');
  const menuButtons = document.querySelectorAll('.menu');

  deleteTodoBtn.forEach((button)=>{
     button.addEventListener('click' ,deleteTodo);
  });

  updateTodoBtn.forEach((button) => {
    button.addEventListener('click'  ,updateTodo);
  });

  checkInput.forEach((input) => {
     input.addEventListener('change' ,checkStatusTypes);
  });

  menuButtons.forEach(button => {
     button.addEventListener('click' , openMenu);
  });


}

function showAllTodos() {
    if(todos.length < 1) {
        return todoContent.innerHTML = renderAlertHtml("No todos added");
    }
    
     renderTodosHtml(todos);
     allTodoBehavior();
}

function createTodo(e) {
  e.preventDefault();


  if(e.keyCode === 13) {

    if(this.dataset.type === "create") {
      const obj = {
         created_at:new Date().toDateString(),
      };

      obj.id = `ID-${Math.floor(Math.random() * 1000000) + 1}`;
      obj.title = e.target.value;
      obj.status = 'pending';

      todos.push(obj);
      localStorage.setItem('todos',JSON.stringify(todos));

      showAllTodos(todos);

    } else {

      const updateMapped = todos.map((todo)=>todo.id == this.getAttribute('updateId') ? {...todo, title:e.target.value} : todo);
      todos = updateMapped;
      localStorage.setItem('todos' , JSON.stringify(todos));
      showAllTodos(todos);

      todoInput.setAttribute('data-type' , 'create');
      todoInput.removeAttribute('updateId');

    }

    e.target.value = "";

  }
}

function deleteTodo() { 
   const filteredTodos = todos.filter((todo)=>todo.id != this.dataset.id ? todo : "");
   todos = filteredTodos;
   localStorage.setItem('todos',JSON.stringify(todos));
   showAllTodos(todos);
}

function updateTodo() {
   const id = this.dataset.id;
   const findTodos = todos.find(todo=>todo.id===id);

   if(findTodos) {
      todoInput.setAttribute('data-type' , 'update');
      todoInput.setAttribute('updateId', findTodos.id);
      todoInput.value = findTodos.title;
   }
}

function filterTodo() {
   const value = this.innerHTML.toLowerCase().trim();
   categories = value;

   categoriesButton.forEach((button)=>{
    button.classList.remove('active');

    if(button.innerHTML.toLowerCase() === categories){
      button.classList.add('active');
    }
   });

   const filteredTodos = todos.filter(todo=>todo.status === categories);

   if(categories === "all") {
       renderTodosHtml(todos);
   } else {
       renderTodosHtml(filteredTodos);
   }

   allTodoBehavior();
}

function checkStatusTypes() {
   const id = this.dataset.id;
   let mapped;

   if(this.checked === true){
      mapped = todos.map((todo)=>todo.id === id ? {...todo, status:"complete" , checked:this.checked} : todo);
   } else {
     mapped = todos.map((todo)=> todo.id === id ? {...todo, status:"pending" , checked:this.checked} : todo);
   }

   todos = mapped;

  localStorage.setItem("todos",JSON.stringify(todos));
  showAllTodos();
}

function clearTodos() {
     todos = [];
     localStorage.setItem("todos",JSON.stringify(todos));
     showAllTodos(todos);
}

function openMenu() {
  const wrapMenus = document.querySelectorAll('.wrap-menu');
  wrapMenus.forEach((el)=>el.style.display = 'none');
  const getIndex = Number(this.dataset.index);

  wrapMenus[getIndex].style.display = 'flex';
}

//event listener

categoriesButton.forEach(button => {
  button.addEventListener('click' , filterTodo);
});

clearButton.addEventListener('click', clearTodos);
todoInput.addEventListener('keyup', createTodo);
window.addEventListener('load' , showAllTodos);