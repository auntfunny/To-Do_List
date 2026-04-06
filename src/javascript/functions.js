import { inputModal, newForm, filterMenuBackground } from "./main";

const inputTitle = document.querySelector("#inputTitle");
const infoBox = document.querySelector("#infoBox");
const submitText = document.querySelector("#submitText");
const newTask = document.querySelector("#newTask");
const daily = document.querySelector("#daily");
const dateBox = document.querySelector("#dateBox");
const timeBox = document.querySelector("#timeBox");
const priceBox = document.querySelector("#priceBox");
const dateOfTask = document.querySelector("#dateOfTask");
const infoTitle = document.querySelector("#infoTitle");
const descriptionPara = document.querySelector("#descriptionPara");
const dateSpan = document.querySelector("#dateSpan");
const timeSpan = document.querySelector("#timeSpan");
const priceSpan = document.querySelector("#priceSpan");
const urgentSpan = document.querySelector("#urgentSpan");
const taskDescription = document.querySelector("#taskDescription");
const withDate = document.querySelector("#withDate");
const withTime = document.querySelector("#withTime");
const timeOfTask = document.querySelector("#timeOfTask");
const withPrice = document.querySelector("#withPrice");
const priceOfTask = document.querySelector("#priceOfTask");
const urgent = document.querySelector("#urgent");
const filterMenu = document.querySelector("#filterMenu");

let dynamicData = [];
let activeEdit;
const time = new Date();
const date = time.getDate();
const month = time.getMonth() + 1;

/******************************************************************************
 
            MANAGE EVENTS
  
  Funtions:
    manageClick
    manageModalClick
    manageModalChange
    manageSubmit

  Purpose:
      When an event occurs, it is managed through these functions, depending 
    on where and when the event happened, and the state of the page. 

******************************************************************************/

/**
 * Handles clicks within the main list
 * 
 * @param {Event} event
 * @returns {null}
 */

export function manageMainClick(event) {
  const currentItem = event.target;
  const currentButton = currentItem.closest("button");

  if (infoBox.classList.contains("opacity-100")) {
    if (currentButton?.id === "closeInfo") {
      closeInfo();
    } else if (!currentItem.closest("section")) {
      closeInfo();
    }
  }
  if (currentButton && currentButton.id === "addNew") {
    inputTitle.textContent = "New Task";
    submitText.textContent = "Save Task";
    showModal();
  } else if (currentButton && currentButton.id === "filter") {
    openFilterMenu();
  } else if (currentButton && currentButton.dataset.action === "edit") {
    inputTitle.textContent = "Edit Task";
    submitText.textContent = "Save Changes";
    editTask();
    showModal();
  } else if (currentButton && currentButton.dataset.action === "info") {
    openInfo(event.target);
  } else if (currentButton && currentButton.dataset.action === "delete") {
    deleteTask();
  } else if (currentItem.type === "checkbox") {
    finishTask(event.target);
  }
}

/**
 * Handles clicks within the Modal
 * 
 * @param {Event} event
 * @returns {null}
 */

export function manageModalClick(event) {
  const currentItem = event.target;
  if (currentItem === inputModal || currentItem.closest("#closeModal")) {
    hideModal();
  }
}

/**
 * Handles changes within the Modal
 * 
 * @param {Event} event
 * @returns {null}
 */

export function manageModalChange(event) {
  const currentLabel = event.target.closest("label");

  if (currentLabel) {
    const next = currentLabel.nextElementSibling;
    if (
      currentLabel.classList.contains("slider") &&
      next.classList.contains("max-h-0")
    ) {
      showBox(next);
    } else if (currentLabel.classList.contains("slider")) {
      hideBox(next);
    }
    if (
      currentLabel.id === "dailySlider" &&
      next.classList.contains("hidden")
    ) {
      showInput(next);
    } else if (currentLabel.id === "dailySlider") {
      hideInput(next);
    }
  }
}

/**
 * Handles Submits within the new task/edit task modal
 * 
 * @param {Event} event
 * @returns {null}
 */

export function manageSubmit(event) {
  if (inputTitle.textContent === "New Task") {
    createNewTask(event);
  } else {
    changeExistingTask(event);
  }
}

/**
 * Handles clicks within the filter list
 * 
 * @param {Event} event
 * @returns {null}
 */

export function manageFilterClick(event) {
  const currentButton = event.target.closest("button");

  if (currentButton) {
    closeFilterMenu();
    filterTasks(currentButton.textContent.toLowerCase().trim());
  }
}

/******************************************************************************
 
            ADD NEW TASK
  
  Funtions:
    addNewTask
    createListItem
    createSpan
    createInput
    createInnerSpan
    createButtonDiv

  Purpose:
      When a new task is entered, it is checked to have content, then a new 
    item is created, formated, and appended to the correct task list. It is
    then added to dynamicData and saved to Local Storage.

******************************************************************************/

/**
 * Creates a new task node
 * 
 * @param {String} title new task title
 * @param {Boolean} daily is daily or not
 * @param {Number} urgency urgency number of task
 * @returns {null}
 */

function addNewTask({ title, daily, urgency }) {
  const newListItem = createListItem();
  const newSpan = createSpan();
  const newInput = createInput();
  const innerSpan = createInnerSpan(title, urgency);
  const newDiv = createButtonDiv();
  if (daily) {
    if (dailyTodoList.children.length > 0) {
      newListItem.classList.add("border-t");
    }
    dailyTodoList.appendChild(newListItem);
  } else {
    if (todoList.children.length > 0) {
      newListItem.classList.add("border-t");
    }
    todoList.appendChild(newListItem);
  }
  newListItem.appendChild(newSpan);
  newListItem.appendChild(newDiv);
  newSpan.appendChild(newInput);
  newSpan.appendChild(innerSpan);
}

/**
 * Creates the new list item with classes
 * 
 * @param {null} 
 * @returns {HTMLElement} newListItem
 */

function createListItem() {
  const newListItem = document.createElement("li");
  const listClasses = "relative flex justify-between border-acc3 py-2".split(
    " ",
  );
  newListItem.classList.add(...listClasses);
  newListItem.id = dynamicData.length;
  return newListItem;
}

/**
 * Creates the new Span with classes
 * 
 * @param {null} 
 * @returns {HTMLElement} newSpan
 */

function createSpan() {
  const newSpan = document.createElement("span");
  newSpan.classList.add("flex", "items-center");
  return newSpan;
}

/**
 * Creates the new checkbox input with classes
 * 
 * @param {null} 
 * @returns {HTMLElement} newInput
 */

function createInput() {
  const newInput = document.createElement("input");
  newInput.type = "checkbox";
  newInput.classList.add("accent-acc5", "w-8", "hover:cursor-pointer");
  return newInput;
}

/**
 * Creates the new span for title and urgency with classes
 * 
 * @param {String} newText title of new task
 * @param {Number} urgency number for urgency of new task
 * @returns {HTMLElement} innerSpan
 */

function createInnerSpan(newText, urgency) {
  const innerSpan = document.createElement("span");
  innerSpan.classList.add("pl-2", "text-acc5");
  switch (Number(urgency)) {
    case 3:
      innerSpan.innerHTML = '<span class="text-red-500 font-bold">!!! </span>';
      break;
    case 2:
      innerSpan.innerHTML =
        '<span class="text-orange-500 font-bold">!! </span>';
      break;
    case 1:
      innerSpan.innerHTML = '<span class="text-yellow-500 font-bold">! </span>';
      break;
  }
  const newSpan = document.createElement("span");
  newSpan.classList.add("title");
  newSpan.textContent += newText;
  innerSpan.appendChild(newSpan);
  return innerSpan;
}

/**
 * Creates the new div for button with classes and innerHTML
 * 
 * @param {null} 
 * @returns {HTMLElement} newDiv
 */

function createButtonDiv() {
  const newDiv = document.createElement("div");
  newDiv.innerHTML = `
          <button data-action="info"
            class="text-xs m-1 p-1 border border-acc5 bg-acc5 text-acc3 rounded-2xl hover:bg-acc3 hover:text-acc5 hover:cursor-pointer active:bg-acc4 transition duration-200 ease-in-out"
          >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
              </svg>
          </button>     
    `;
  return newDiv;
}

/******************************************************************************
 
            DELETE TASK

  Funtion: 
    deleteTask

  Purpose:
      When the delete button is clicked, the object clicked is located in the
    list and in the dynamic array and deleted from both places, then the 
    dynamic data is saved to the local storage.

******************************************************************************/

/**
 * Deletes selected task from storage
 * 
 * @param {null} 
 * @returns {null}
 */

function deleteTask() {
  const tasks = document.querySelectorAll(".title");
  const currentTask = Array.from(tasks).find(
    (task) => task.textContent === infoTitle.textContent,
  );
  const currentListItem = currentTask.closest("li");
  currentListItem.remove();
  closeInfo();
  dynamicData = dynamicData.filter(
    (item) => item.title !== currentTask.textContent,
  );
  try {
    localStorage.setItem("myDynamicObject", JSON.stringify(dynamicData));
    console.log("Changes Saved");
  } catch (error) {
    console.error("Error", error);
  }
}

/******************************************************************************
 
            EDIT TASK
    
  Funtions:
    editTask
    changeExistingTask

  Purpose:
      The active task is found in the dynamic array, then the info is inserted
    into the input modal to edit the task. When the submit button it pressed
    the object is edited in the dynamic array and the items are re-rendered,
    and the dynamic data is saved to the local storage.

******************************************************************************/

/**
 * Opens edit modal and sets values
 * 
 * @param {null} 
 * @returns {null}
 */

function editTask() {
  closeInfo();
  const tasks = document.querySelectorAll(".title");
  const currentTask = Array.from(tasks).find(
    (task) => task.textContent === infoTitle.textContent,
  );
  const currentObject = dynamicData.find(
    (task) => task.title === currentTask.textContent,
  );
  activeEdit = currentObject;
  newTask.value = currentObject.title;
  taskDescription.value = currentObject.description || "";
  if (currentObject.date || currentObject.daily) {
    withDate.checked = true;
    showBox(dateBox);
    if (currentObject.daily) {
      daily.checked = true;
      hideInput(dateOfTask);
    } else {
      dateOfTask.value = currentObject.date;
    }
  }
  if (currentObject.time) {
    withTime.checked = true;
    showBox(timeBox);
    timeOfTask.value = currentObject.time;
  }
  if (currentObject.price) {
    withPrice.checked = true;
    showBox(priceBox);
    priceOfTask.value = currentObject.price;
  }
  if (currentObject.urgency !== "0") {
    urgent.value = Number(currentObject.urgency);
  }
}

/**
 * Reads new values and updates selected task
 * 
 * @param {Event}
 * @returns {null}
 */

function changeExistingTask(event) {
  event.preventDefault();
  const currentObject = activeEdit;
  const formData = new FormData(event.target);
  currentObject.title = formData.get("newTask").trim();
  currentObject.description = formData.get("taskDescription").trim();
  currentObject.date = formData.get("withDate")
    ? !formData.get("daily")
      ? formData.get("dateOfTask")
      : null
    : null;
  currentObject.daily = formData.get("withDate")
    ? formData.get("daily")
      ? true
      : false
    : false;
  currentObject.time = formData.get("withTime")
    ? formData.get("timeOfTask")
    : null;
  currentObject.price = formData.get("withPrice")
    ? formData.get("priceOfTask")
    : null;
  currentObject.urgency = formData.get("urgent");
  hideModal();
  renderTasks(dynamicData);

  try {
    localStorage.setItem("myDynamicObject", JSON.stringify(dynamicData));
    console.log("Changes Saved");
  } catch (error) {
    console.error("Error:", error);
  }
}

/******************************************************************************
 
            FINISH TASK

  Function:
    finishTask

  Purpose:
      When the finished checkbox next to each task is checked, the text in that
    item is crossed out. If the task was already finished, then the line is 
    removed. Data is then saved in local storage.

******************************************************************************/

/**
 * Set task as finished or unfinished, depending on current state
 * 
 * @param {Event}
 * @returns {null}
 */

function finishTask(event) {
  const listItem = event.closest("li");
  const taskAtHand = listItem.querySelector(".title");
  const currentCheckBox = event;
  if (currentCheckBox.checked) {
    taskAtHand.classList.add("line-through");
    const currentObject = dynamicData.find(
      (object) => object.title === taskAtHand.textContent,
    );
    currentObject.finished = 1;
    try {
      localStorage.setItem("myDynamicObject", JSON.stringify(dynamicData));
      console.log("Changes Saved");
    } catch (error) {
      console.error("Error:", error);
    }
  } else {
    taskAtHand.classList.remove("line-through");
    const currentObject = dynamicData.find(
      (object) => object.title === taskAtHand.textContent,
    );
    currentObject.finished = 0;
    try {
      localStorage.setItem("myDynamicObject", JSON.stringify(dynamicData));
      console.log("Changes Saved");
    } catch (error) {
      console.error("Error:", error);
    }
  }
}

/******************************************************************************
 
            INFO BOX

    Functions:
    openInfo
    closeinfo
    formatInfo

  Purpose:
      Handles the opening, closing, and formatting of the information modal
    when the info button of any task is clicked.

******************************************************************************/

/**
 * Open the info Modal
 * 
 * @param {Event}
 * @returns {null}
 */

function openInfo(event) {
  infoBox.classList.remove("opacity-0");
  infoBox.classList.remove("invisible");
  infoBox.classList.add("opacity-100");
  formatInfo(event);
}

/**
 * Close the info Modal
 * 
 * @param {null}
 * @returns {null}
 */

function closeInfo() {
  infoBox.classList.remove("opacity-100");
  infoBox.classList.add("opacity-0");
  infoBox.classList.add("invisible");
}

/**
 * Format the info modal for selected task
 * 
 * @param {Event}
 * @returns {null}
 */

function formatInfo(event) {
  const listItem = event.closest("li");
  const itemName = listItem.querySelector(".title");
  const currentObject = dynamicData.find(
    (object) => object.title === itemName.textContent,
  );
  infoTitle.textContent = currentObject.title;
  if (currentObject.description) {
    descriptionPara.textContent = currentObject.description;
  } else {
    descriptionPara.textContent = "No task description";
  }
  if (currentObject.date) {
    dateSpan.textContent = currentObject.date;
  } else if (currentObject.daily) {
    dateSpan.textContent = "Daily";
  } else {
    dateSpan.textContent = "No task date";
  }
  if (currentObject.time) {
    timeSpan.textContent = currentObject.time;
  } else {
    timeSpan.textContent = "No task time";
  }
  if (currentObject.price) {
    priceSpan.textContent = `$${currentObject.price}`;
  } else {
    priceSpan.textContent = "No task price";
  }
  urgentSpan.classList.remove("text-red-500");
  urgentSpan.classList.remove("text-orange-500");
  urgentSpan.classList.remove("text-yellow-500");
  if (currentObject.urgency) {
    switch (currentObject.urgency) {
      case "3":
        urgentSpan.textContent = "High";
        urgentSpan.classList.add("text-red-500");
        break;
      case "2":
        urgentSpan.textContent = "Medium";
        urgentSpan.classList.add("text-orange-500");
        break;
      case "1":
        urgentSpan.textContent = "Low";
        urgentSpan.classList.add("text-yellow-500");
        break;
      case "0":
        urgentSpan.textContent = "No task urgency";
        break;
    }
  }
}

/******************************************************************************
 
            FILTER

    Functions:
    openFilterMenu
    closeFilterMenu
    filterTasks

  Purpose:
      Handles the changes in the filter menu, to open and close the menu
    and to apply the selected filter from the list.

******************************************************************************/

/**
 * Open the filter menu
 * 
 * @param {null}
 * @returns {null}
 */

function openFilterMenu() {
  filterMenuBackground.classList.remove("hidden");
  filterMenuBackground.classList.remove("invisible");
  filterMenu.classList.remove("max-h-0");
  filterMenu.classList.add("max-h-96");
}

/**
 * Close the filter menu
 * 
 * @param {null}
 * @returns {null}
 */

export function closeFilterMenu() {
  filterMenu.classList.remove("max-h-96");
  filterMenu.classList.add("max-h-0");
  filterMenuBackground.classList.add("hidden");
  filterMenuBackground.classList.add("invisible");
}

/**
 * Filters all tasks accoring to the selected filter
 * 
 * @param {String} filter clicked from the filter menu
 * @returns {null}
 */

function filterTasks(filter){
  const filterList = dynamicData.filter(task => task[filter]);
  const nonFilterList = dynamicData.filter(task => !task[filter])
  if(filter === "urgency"){
    filterList.sort((a, b) => b[filter] - a[filter]);
  } else if(filter === "time"){
    filterList.sort((a, b) => Number(a[filter].split(":").join("")) - Number(b[filter].split(":").join("")));
  } else if(filter === "date"){
    filterList.sort((a, b) => Number(a[filter].split("-").join("")) - Number(b[filter].split("-").join("")));
  } else if(filter === "price") {
    filterList.sort((a, b) => a[filter] - b[filter])
  } 
  if(filter === "finished"){
    renderTasks([...nonFilterList, ...filterList]);
  } else {
    renderTasks([...filterList, ...nonFilterList]);
  }
}

/******************************************************************************
 
            MODAL

    Functions:
    showModal
    hideModal
    cleanInputs
    showBox
    hideBox
    hideInput
    showInput
    createNewTask

  Purpose:
      Handles all changes and events with the new task/edit task modal

******************************************************************************/

/**
 * Show the input modal
 * 
 * @param {null}
 * @returns {null}
 */

function showModal() {
  inputModal.classList.remove("invisible");
  inputModal.classList.remove("opacity-0");
  inputModal.classList.add("opacity-100");
}

/**
 * Hide the input modal
 * 
 * @param {null}
 * @returns {null}
 */

function hideModal() {
  inputModal.classList.remove("opacity-100");
  inputModal.classList.add("invisible");
  inputModal.classList.add("opacity-0");
  cleanInputs();
}

/**
 * Reset the modal when it is closed without submitting
 * 
 * @param {null}
 * @returns {null}
 */

function cleanInputs() {
  newTask.value = "";
  taskDescription.value = "";
  if (withDate) {
    if (daily) {
      showInput(dateOfTask);
      daily.checked = false;
    } else {
      dateOfTask.value = "";
    }
    withDate.checked = false;
    hideBox(dateBox);
  }
  if (withTime) {
    timeOfTask.value = "";
    hideBox(timeBox);
    withTime.checked = false;
  }
  if (withPrice) {
    priceOfTask.value = "";
    hideBox(priceBox);
    withPrice.checked = false;
  }
  if (urgent !== 0) {
    urgent.value = 0;
  }
}

/**
 * Show an input box
 * 
 * @param {HTMLElement} box selected box to show
 * @returns {null}
 */

function showBox(box) {
  box.classList.remove("max-h-0");
  box.classList.add("max-h-100");
}

/**
 * Hides an input box
 * 
 * @param {HTMLElement} box selected box to hide
 * @returns {null}
 */

function hideBox(box) {
  box.classList.remove("max-h-100");
  box.classList.add("max-h-0");
}

/**
 * Hide an input
 * 
 * @param {HTMLElement} input selected input to hide
 * @returns {null}
 */

function hideInput(input) {
  input.classList.add("hidden");
  const parent = input.parentNode;
  parent.classList.add("min-h-29");
  setTimeout(() => {
    parent.classList.remove("min-h-29");
    parent.classList.add("min-h-0");
  }, 100);
}

/**
 * Show an input
 * 
 * @param {HTMLElement} input selected input to show
 * @returns {null}
 */

function showInput(input) {
  const parent = input.parentNode;
  parent.classList.remove("min-h-0");
  parent.classList.add("min-h-29");
  setTimeout(() => {
    input.classList.remove("hidden");
    parent.classList.remove("min-h-29");
  }, 500);
}

/**
 * Retrieves data from form and creates a new object and element
 * 
 * @param {Event}
 * @returns {null}
 */

function createNewTask(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  if (formData.get("newTask")) {
    const newTaskObject = {
      title: formData.get("newTask").trim(),
      description: formData.get("taskDescription").trim(),
      date: formData.get("withDate")
        ? !formData.get("daily")
          ? formData.get("dateOfTask")
          : null
        : null,
      daily: formData.get("withDate")
        ? formData.get("daily")
          ? true
          : false
        : false,
      time: formData.get("withTime") ? formData.get("timeOfTask") : null,
      price: formData.get("withPrice") ? formData.get("priceOfTask") : null,
      urgency: formData.get("urgent"),
      finished: 0,
    };

    addNewTask(newTaskObject);
    dynamicallySave(newTaskObject);
    newForm.reset();
    hideModal();
    if (formData.get("withDate")) {
      hideBox(dateBox);
    }
    if (formData.get("withTime")) {
      hideBox(timeBox);
    }
    if (formData.get("withPrice")) {
      hideBox(priceBox);
    }
    if (formData.get("daily")) {
      showInput(dateOfTask);
    }
  } else {
    alert("Please add a new task");
  }
}

/******************************************************************************
 
            LOCAL STORAGE
  
  Functions:
    loadSave
    renderTasks
    renderItem
    resetDailyItems
    dynamicallySave

  Purpose:
      The local storage is retrived, with the list, the last day, and the last
    month at time of previous login. If data is found, it is converted to JS.
    If the day or month has changed, the daily items are searched in the array
    and the finished key is set to 0 and then saved. The tasks are then 
    rendered by creating a list item for each task. The dynamicData array is
    updated, along with day and month. This runs automatically when the page
    loads.

******************************************************************************/

/**
 * Retrieves local storage data sets variables
 * 
 * @param {null}
 * @returns {null}
 */

export function loadSave() {
  const storedDataString = localStorage.getItem("myDynamicObject");
  const storedDate = Number(localStorage.getItem("myDate"));
  const storedMonth = Number(localStorage.getItem("myMonth"));

  if (storedDataString) {
    try {
      const retrievedObject = JSON.parse(storedDataString);

      console.log("Retrieved object:", retrievedObject);
      if (storedDate) {
        console.log(`Retrieved Date: ${storedDate}`);
        console.log(`Retrieved Month: ${storedMonth}`);
        if (storedDate !== date || storedMonth !== month) {
          resetDailyItems(retrievedObject);
        }
      }
      renderTasks(retrievedObject);
      dynamicData = [...retrievedObject];
      localStorage.setItem("myDate", String(date));
      localStorage.setItem("myMonth", String(month));
    } catch (error) {
      console.error("Error:", error);
    }
  } else {
    console.log('No data in "myDynamicObject".');
  }
}

/**
 * Shows all tasks within the list
 * 
 * @param {Array} taskList list of tasks to render
 * @returns {null}
 */

function renderTasks(taskList) {
  todoList.innerHTML = "";
  dailyTodoList.innerHTML = "";
  taskList.forEach((element) => {
    renderItem(element);
  });
}

/**
 * Creates and shows a single task
 * 
 * @param {Object} element to  be rendered
 * @returns {null}
 */

function renderItem(element) {
  const newListItem = createListItem();
  const newSpan = createSpan();
  const newInput = createInput();
  const innerSpan = createInnerSpan(element.title, element.urgency);
  const newDiv = createButtonDiv();

  if (element.finished === 1) {
    const title = innerSpan.querySelector(".title");
    title.classList.add("line-through");
    newInput.checked = true;
  }
  if (element.daily) {
    if (dailyTodoList.children.length > 0) {
      newListItem.classList.add("border-t");
    }
    dailyTodoList.appendChild(newListItem);
  } else {
    if (todoList.children.length > 0) {
      newListItem.classList.add("border-t");
    }
    todoList.appendChild(newListItem);
  }
  newListItem.appendChild(newSpan);
  newListItem.appendChild(newDiv);
  newSpan.appendChild(newInput);
  newSpan.appendChild(innerSpan);
}

/**
 * Resets finished state of all daily tasks
 * 
 * @param {Array} taskList list of all tasks
 * @returns {null}
 */

function resetDailyItems(taskList) {
  taskList.forEach((item) => {
    if (item.daily) {
      item.finished = 0;
    }
  });
  try {
    localStorage.setItem("myDynamicObject", JSON.stringify(taskList));
    console.log("Changes Saved");
  } catch (error) {
    console.error("Error:", error);
  }
}

/**
 * Adds a new task to local storage
 * 
 * @param {Object} taskObject new task
 * @returns {null}
 */

function dynamicallySave(taskObject) {
  dynamicData.push(taskObject);
  try {
    localStorage.setItem("myDynamicObject", JSON.stringify(dynamicData));
    console.log("Changes Saved");
  } catch (error) {
    console.error("Error:", error);
  }
}
