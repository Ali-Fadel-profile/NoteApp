export default class NoteManager {
    constructor() {
        this.notes = getDateFromStorage();
    }

    addNote(note) {
        this.notes.push(note);
        saveDataInStorage(this.notes)
    }

    deleteNote(id) {
        this.notes = this.notes.filter((note) => note.id != id);
        saveDataInStorage(this.notes)
    }

    updateNote(updatedNote) {
        const index = findNoteIndex(this.notes, updatedNote.id);
        if (index !== -1) {
            this.notes[index] = updatedNote;
            saveDataInStorage(this.notes)
        }
    }

    filterNotesByTitle(desiredTitle) {
        return this.notes.filter(note => note.title.includes(desiredTitle));
    }

    getNotes() {
        return this.notes;
    }
}

export const getDateFromStorage = () => {
    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    return notes;
};

export const saveDataInStorage = (notes) => {
    localStorage.setItem("notes", JSON.stringify(notes));
}

const findNoteIndex = (notes, id) => {
    let noteIndex = -1;
    notes.forEach((note, index) => {
        note.id == id ? noteIndex = index : ""
    });
    return noteIndex;
}