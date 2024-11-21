import {
  generateEmptyNoteHTML, generateNoteHTML, generateRenderedNoteHTML, generateEditNoteHTML, generateNotesArchieveHTML,
  generateEmptySearchHTML, toggleSections, noteFormSec, noteSec, notesArchieve, searchBtn, toggleForm, isDesktop
} from "./dom.js";
import NoteManager from "./notes.js";
const noteForm = document.querySelector(".noteForm__form");
const FormInputs = document.querySelectorAll(".noteForm__form input,.noteForm__textarea");

const noteManager = new NoteManager();


// add notes 
async function addNote(event) {
  const note = createNoteFromForm(event);
  noteManager.addNote(note);
  await showSuccessAlert("Note Added!", "Your note was added successfully.")
  toggleSections(notesArchieve, noteFormSec, noteSec);
  showNotes(noteManager.getNotes());
}

function createNoteFromForm(event) {
  event.preventDefault();
  const date = new Date(Date.now());
  const formattedDate = date.toLocaleDateString("en-us", {
    month: "short",
    day: "numeric",
    year: "numeric"
  })
  const note = {
    id: Date.now(),
    type: event.submitter.id === "addRegularNote" ? "regular" : "pinned",
    date: formattedDate,
  };

  FormInputs.forEach((input) => (note[input.id] = input.value.trim()));
  FormInputs.forEach((input) => (input.value = ""));
  return note;
}

function showSuccessAlert(title, message) {
  return Swal.fire({
    position: "center",
    icon: "success",
    title: title,
    html: `<span class="custom-text">${message}</span>`,
    showConfirmButton: false,
    timer: 1500,
    customClass: {
      popup: "custom-popup",
      title: "custom-title",
    },
    showClass: {
      popup: 'fade-in',
    }
  })
}
noteForm.addEventListener("submit", addNote);

// Display all notes or show an empty state if no notes exist
function showNotes(notes) {

  if (notes.length === 0) {
    notesArchieve.innerHTML = "";
    notesArchieve.innerHTML = "";
    isDesktop ? notesArchieve.classList.add("notesArchieve__empty") : "";
    const emptyNoteHTML = generateEmptyNoteHTML();
    notesArchieve.innerHTML = emptyNoteHTML;
    const addNoteBtn = document.querySelector(".emptyNote__button");
    addNoteBtn.addEventListener("click", () => {
      toggleSections(noteFormSec, noteSec, notesArchieve);
    });
  } else {
    isDesktop ? notesArchieve.classList.remove("notesArchieve__empty") : "";
    notesArchieve.innerHTML = "";
    notesArchieve.insertAdjacentHTML("afterbegin", generateNotesArchieveHTML());
    const regularNotes = document.getElementById("regularNotes");
    const pinnedNotes = document.getElementById("pinnedNotes");
    regularNotes.innerHTML = "";
    pinnedNotes.innerHTML = "";
    notes.forEach(note => {
      const noteHTML = generateNoteHTML(note);
      const targetSection = note.type == "pinned" ? pinnedNotes : regularNotes;
      targetSection.insertAdjacentHTML("afterbegin", noteHTML);
      addNoteEventListeners(notes);
    });
  }
}

function addNoteEventListeners(notes) {
  const deleteNoteButtons = document.querySelectorAll(".notes__button");
  deleteNoteButtons.forEach(button => button.addEventListener("click", (e) => deleteNote(e)));
  const noteContents = document.querySelectorAll(".notes__item-content");
  noteContents.forEach(element => element.addEventListener("click", (e) => {
    const id = e.target.closest(".notes__item").getAttribute("data-id");
    const note = notes.filter((note) => note.id == id ? note : "");
    if (searchBtn.classList.contains("closeHeaderSearch")) {
      toggleForm();
    }
    renderNote(...note);
    resetSearch()
  }))
}

// delete Notes
function deleteNote(e) {
  Swal.fire({
    title: "Are you sure?",
    html: '<span class="custom-text">This action cannot be undone.</span>',
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete note!",
    cancelButtonText: "Cancel",
    customClass: {
      title: "custom-title",
      confirmButton: "custom-confirm-button",
      cancelButton: "custom-cancel-button",
      popup: "custom-popup",
    },
    showClass: {
      popup: 'fade-in',
    }
  }).then((result) => {
    if (result.isConfirmed) {
      // Remove the note
      const noteId = e.target.closest(".notes__item").getAttribute("data-id");
      noteManager.deleteNote(noteId);
      noteSec.innerHTML = "";
      showNotes(noteManager.getNotes());
    }
  });
}


// search Notes
function resetSearch() {
  showNotes(noteManager.getNotes());
  searchInput.value = '';
}

function searchNotes(title) {
  const matchedNotes = noteManager.filterNotesByTitle(title);
  if (matchedNotes.length === 0) {
    regularNotes.innerHTML = "";
    pinnedNotes.innerHTML = "";
    const emptySearchHtml = generateEmptySearchHTML();
    regularNotes.insertAdjacentHTML("beforeend", emptySearchHtml);
    searchBtn.addEventListener("click", () => {
      resetSearch();
    });
  } else {
    showNotes(matchedNotes);
    searchBtn.addEventListener("click", () => {
      resetSearch();
    });
  }
}

const searchInput = document.querySelector(".headerForm__searchInput");
let debounceTimer;
searchInput.addEventListener("input", (e) => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => searchNotes(e.target.value), 300)
});

// render note 
function renderNote(note, toggle) {
  toggle === false ? "" : toggleSections(noteSec, notesArchieve, noteFormSec,);
  noteSec.innerHTML = "";
  let htmlElements = generateRenderedNoteHTML(note);
  noteSec.insertAdjacentHTML("beforeend", htmlElements);
  const editNoteBtn = document.querySelector(".note__editBtn");
  editNoteBtn.addEventListener("click", () => editNote(note));
  showNotes(noteManager.getNotes())
}


function showEditNoteModule(note) {
  const moduleHTML = generateEditNoteHTML(note);

  document.body.insertAdjacentHTML("beforeend", moduleHTML);

  const moduleElement = document.querySelector(".editNote__module");

  moduleElement.style.animation = "slideDown var(--transition-timing) ease-in-out forwards";
}

function hideEditNoteModule() {
  const moduleElement = document.querySelector(".editNote__module");

  if (moduleElement) {
    moduleElement.style.animation = "slideUp var(--transition-timing) ease-in-out forwards";

    moduleElement.addEventListener("animationend", () => {
      moduleElement.remove();
    });
  }
}

// Edit note functionality
function editNote(note) {
  showEditNoteModule(note);

  const noteFormEle = document.getElementById("update-note");

  noteSec.classList.remove("fade-in");

  noteFormEle.addEventListener("submit", (event) => {
    event.preventDefault();
    if (event.submitter.id === "updateNote") {
      updateNote(event, note);
      hideEditNoteModule();
    } else {
      renderNote(note, false);
      hideEditNoteModule();
    }
  });
}

function updateNote(e, note) {
  const title = e.target.elements.title.value;
  const noteContent = e.target.elements.note.value;

  note.title = title;
  note.note = noteContent;
  noteManager.updateNote(note);
  renderNote(note);
  showNotes(noteManager.getNotes());
}
function intialApp() {
  showNotes(noteManager.getNotes());
}
intialApp();