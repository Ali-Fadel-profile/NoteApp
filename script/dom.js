const burgerBtn = document.querySelector(".header__menu");
const navegation = document.querySelector(".headerNav");
const showAddNoteSecBtn = document.querySelector(".headerNav__addNote-btn");
const showNotesSecBtn = document.querySelector(".headerNav__showNote-btn");
export const noteFormSec = document.querySelector(".noteForm");
export const noteSec = document.querySelector(".note");
export const notesArchieve = document.querySelector(".notesArchieve");
const closeMenuBtn = document.querySelector(".headerNav__closeMenu");
export const searchBtn = document.querySelector(".header__search");
const searchForm = document.querySelector(".headerForm");

function showNav() {
  navegation.classList.toggle("showNav");
}

export function toggleForm() {
  searchForm.classList.toggle("showForm");
  searchForm.parentElement.classList.toggle("showFormBackground");
  searchBtn.classList.toggle("closeHeaderSearch");
}

export const isDesktop = window.matchMedia("(min-width: 1000px)").matches;

function showDomForMobile(secToShow, secsToHide) {
  secsToHide.forEach((sec) => {
    sec.style.display = "none";
    sec.classList.remove("fade-in");
  });
  secToShow.style.display = "block";
  secToShow.classList.add("fade-in");
}

export function toggleSections(secToShow, ...secsToHide) {

  if (secToShow === noteFormSec) {
    showAddNoteSecBtn.classList.add("active__link")
    showNotesSecBtn.classList.remove("active__link")
  } else {
    showAddNoteSecBtn.classList.remove("active__link")
    showNotesSecBtn.classList.add("active__link")
  }

  if (!isDesktop) {
    // Mobile-specific behavior
    showDomForMobile(secToShow, secsToHide);
    return
  };
  if (secToShow === noteFormSec) {
    showDomForMobile(secToShow, secsToHide)
  } else if (secToShow === notesArchieve) {
    noteFormSec.style.display = "none";
    notesArchieve.style.display = "block";
    notesArchieve.classList.add("fade-in");
  } else if (secToShow === noteSec) {
    noteSec.style.display = "block";
    noteSec.classList.add("fade-in");
  }
};


burgerBtn.addEventListener("click", showNav);
closeMenuBtn.addEventListener("click", showNav);

searchBtn.addEventListener("click", toggleForm);

showAddNoteSecBtn.addEventListener("click", (event) => {
  showNav();
  toggleSections(noteFormSec, noteSec, notesArchieve);
});

showNotesSecBtn.addEventListener("click", (event) => {
  showNav();
  toggleSections(notesArchieve, noteFormSec, noteSec);
});


export function generateNotesArchieveHTML() {
  return `  
         <p class="notes__label text">Pinned</p>
        <div class="notes__section" id="pinnedNotes">
        </div>
          <p class="notes__label text" id="reagularNotes__label">Notes</p>
        <div class="notes__section" id="regularNotes">
          </div>
        </div>
  `;
}

export function generateNoteHTML(note) {
  return `
    <div class="notes__item" data-id="${note.id}">
      <div class="notes__item-content">
        <h2 class="notes__title title">${note.title}</h2>
        <p class="notes__content text">${note.note}</p>
      </div>
      <div class="notes__control">
        <p class="notes__date text">${note.date}</p>
        <button class="notes__button text">Delete</button>
      </div>
    </div>
  `;
}


export function generateEmptyNoteHTML() {
  return `
    <div class="emptyNote fade-in">
      <img src="img/notepad.png" alt="emptyNote" class="emptyNote__img" />
      <div class="emptyNote__add">
        <button class="emptyNote__button text">
           Add Your First Note
        </button>
      </div>
    </div>
  `;
}

// Function to create HTML for rendering a specific note
export function generateRenderedNoteHTML(note) {
  return `
    <h2 class="note__title title">${note.title}</h2>
    <p class="note__meta text">${note.date} / By ${note.author}</p>
    <p class="note__content text">${note.note}</p>
    <button class="note__editBtn">
      <img src="../img/editIcon.png" alt="edit icon" class="note__editBtn-img" />
    </button>
  `;
}

export function generateEditNoteHTML(note) {
  return `
     <section class="editNote__module">
        <form class="noteForm__form editNote__form" id="update-note">
          <h2 class="title module__title">Edit your note</h2>
          <label for="title" class="noteForm__label text">Title*</label>
          <input
            type="text"
            id="title"
            class="noteForm__input text"
            value="${note.title}"
            required
          />
          <label for="note" class="noteForm__label text">Your Note*</label>
          <textarea id="note" class="noteForm__textarea text" required>
${note.note}</textarea
          >
          <div class="noteForm__actions">
            <button
              type="submit"
              class="noteForm__button text"
              id="updateNote"
            >
              Update Note
            </button>
            <button
              type="submit"
              class="noteForm__button text"
              id="cancelUpdate"
            >
              Cancel
            </button>
          </div>
        </form>
      </section>
  `;
}

// Function to create the HTML for an empty search result
export function generateEmptySearchHTML() {
  return `
    <div class="emptyNote fade-in">
      <img src="img/notepad.png" alt="emptyNote" class="emptyNote__img" />
      <div class="emptyNote__add">
        <p class="title">No notes matched!</p>
      </div>
    </div>
  `;
}
