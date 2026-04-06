const mainEventListener = document.querySelector("#mainEventListener");
export const inputModal = document.querySelector("#inputModal");
export const newForm = document.querySelector("#newForm");
export const filterMenuBackground = document.querySelector("#filterMenuBackground");
export const filterMenu = document.querySelector("#filterMenu");


import { manageMainClick, manageModalChange, manageModalClick, manageSubmit, manageFilterClick, loadSave, closeFilterMenu } from "./functions";


// localStorage.clear()

mainEventListener.addEventListener("click", manageMainClick);
inputModal.addEventListener("change", manageModalChange);
inputModal.addEventListener("click", manageModalClick);
newForm.addEventListener("submit", manageSubmit);
filterMenuBackground.addEventListener("click", closeFilterMenu);
filterMenu.addEventListener("click", manageFilterClick);

loadSave()

