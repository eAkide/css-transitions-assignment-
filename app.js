const itemTemplate = document.querySelector("#list-item-template");
const list = document.querySelector(".list-items > ul");

const items = [];
let currentMenu = null;

function storeItems() {
  localStorage.setItem('todo-list', JSON.stringify(items));
}

function loadItems() {
  let storedItems = localStorage.getItem('todo-list');
  if (!storedItems) {
    return [
      { title: 'cook supper', checked: false },
      { title: 'shopping', checked: false },
      { title: 'read bible', checked: false },
      { title: 'finish assignments', checked: false },
      { title: 'Wash dishes', checked: false },
      { title: 'fold clothes', checked: false }
    ];
  }

  try {
    storedItems = JSON.parse(storedItems);
  } catch (e) {
    storedItems = [];
  }

  return storedItems;
}

function getAnimationDuration(node) {
  const style = window.getComputedStyle(node);
  let duration = style.getPropertyValue('--animation-duration');
  duration = parseFloat(duration);

  return duration;
}

function displayItem(item, atTop = false, appear = false) {
  if (atTop) {
    items.unshift(item);
  } else {
    items.push(item);
  }

  const itemNode = itemTemplate.content.firstElementChild
    .cloneNode(true);

  const itemTitle = itemNode.querySelector('.list-item__title > *');
  itemTitle.innerText = item.title;

  if (item.checked) {
    itemNode.classList.add('checked');
  }
  if (item.important) {
    itemNode.classList.add('important');
  }

  itemNode.addEventListener('click', (e) => {
    item.checked = !item.checked;
    storeItems();
    if (item.checked) {
      itemNode.classList.add('checked');
    } else {
      itemNode.classList.remove('checked');
    }
  });

  const importantButton = itemNode.querySelector('.list-item__important');
  importantButton.addEventListener('click', (e) => {
    e.stopPropagation();

    item.important = !item.important;
    itemNode.classList.toggle('important');
    storeItems();
  });

  const menuButton = itemNode.querySelector('.list-item__menu-button');
  const menuBase = itemNode.querySelector('.list-item__menu-base');
  menuButton.addEventListener('click', (e) => {
    e.stopPropagation();

    if (currentMenu) {
      currentMenu.classList.remove('open');
      currentMenu = null;
    }

    menuBase.classList.add('open');
    currentMenu = menuBase;
  });
  menuBase.addEventListener('click', (e) => {
    e.stopPropagation();
    menuBase.classList.remove('open');
    currentMenu = null;
  });

  const deleteButton = itemNode.querySelector('.list-item__delete-button');
  deleteButton.addEventListener('click', () => {
    itemNode.classList.add('deleted');
    const duration = getAnimationDuration(deleteButton);
    setTimeout(() => {
      const index = items.indexOf(item);
      items.splice(index, 1);
      storeItems();
      list.removeChild(itemNode);
    }, duration);
  });

  if (atTop) {
    list.prepend(itemNode);
  } else {
    list.appendChild(itemNode);
  }

  if (appear) {
    itemNode.classList.add('appear');
  }
}

const addPanel = document.querySelector('.add-panel');
const addNavButton = document.querySelector('.navbar .add-button');
addNavButton.addEventListener('click', () => {
  addNavButton.classList.toggle('open');
  addPanel.classList.toggle('open');
});


const addTodoButton = document.querySelector('.add-panel__button');
const addTodoInput = document.querySelector('.add-panel__input');

function addItem() {
  const title = addTodoInput.value;
  if (!title) {
    return;
  }

  const newItem = {
    title,
    checked: false,
  };
  displayItem(newItem, true, true);
  storeItems();

  addTodoInput.value = '';

  addTodoButton.classList.add('sending');
  const duration = getAnimationDuration(addTodoButton);

  // for being able to restart the animation
  setTimeout(() => {
    addTodoButton.classList.remove('sending');
  }, duration);
}

addTodoButton.addEventListener('click', () => {
  addItem();
});
addTodoInput.addEventListener('keyup', (e) => {
  if (e.altKey || e.shiftKey || e.ctrlKey) {
    return;
  }

  if (e.key === 'Enter') {
    addItem();
  } else if (e.key === 'Escape') {
    addTodoInput.value = '';
  }
}, true);


const currentItems = loadItems();
currentItems
  .forEach((item) => {
    displayItem(item);
  });