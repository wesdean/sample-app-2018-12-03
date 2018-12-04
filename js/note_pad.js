(function () {
  const noteList = document.getElementById("noteList");
  const noteForm = document.getElementById("noteForm");
  const newNote = document.getElementById("newNote");
  const noteId = document.getElementById("noteId");
  const noteTitle = document.getElementById("noteTitle");
  const noteText = document.getElementById("noteText");
  const deleteNoteBtn = document.getElementById("deleteNote");
  const noteExport = document.getElementById("noteExport");
  const noteImport = document.getElementById("noteImport");
  const notePersistenceText = document.getElementById("notePersistenceText");
  const colorSelector = document.getElementById("noteColorSelector");
  const noteContainer = document.getElementById("noteContainer");

  const colorList = {
    color1: "#ee232a",
    color2: "#ff12de",
    color3: "#694023",
  };

  const noteDefaultBorderColor = "#666666";

  // This is the notes array. It's where your notes are kept.
  let notes = [
    {
      id: 0,
      title: "Note 1",
      text: "This is a note!",
    },
    {
      id: 1,
      title: "Note 2",
      text: "You guessed it! Another note!",
      color: "#ffaa22",
    },
    {
      id: 2,
      title: "Not a Note",
      text: "Sorry to disappoint. This is just another note.",
    }
  ];

  noteForm.addEventListener("submit", event => {
    event.preventDefault();
    saveNote();
    loadNote();
  });

  newNote.addEventListener("click", event => {
    event.preventDefault();
    loadNote();
  }, false);

  deleteNoteBtn.addEventListener("click", event => {
    event.preventDefault();

    let id = parseInt(noteId.innerText);
    deleteNote(getNoteIndexById(id));
  }, false);

  noteExport.addEventListener("click", event => {
    event.preventDefault();

    notePersistenceText.value = JSON.stringify(notes);
  }, false);

  noteImport.addEventListener("click", event => {
    event.preventDefault();

    let noteArray = JSON.parse(notePersistenceText.value);
    if (validateNotesArray(noteArray)) {
      notes = noteArray;
      loadNote();
      loadNoteList();
    } else {
      alert("Invalid notes input.");
    }
  }, false);

  // Load a stored note or reset the note form if no note is selected.
  function loadNote(id) {
    id = parseInt(id);

    if (isNaN(id)) {
      id = null;
    }

    let note;
    if (id === null) {
      note = {
        id: "New Note",
        title: "",
        text: "",
      };
      deleteNoteBtn.disabled = true;
    } else {
      let index = getNoteIndexById(id);
      if (index === null) {
        alert("Failed to load note");
        return;
      }
      note = notes[index];
      deleteNoteBtn.disabled = false;
    }

    let borderColor = note.color;
    setNoteContainerBorderColor(borderColor);

    noteId.innerText = note.id;
    noteTitle.value = note.title;
    noteText.value = note.text;
  }

  // Save a note, editing the loaded note or creating a new note if it doesn't exist.
  function saveNote() {
    let id = parseInt(noteId.innerText);
    let title = noteTitle.value;
    let text = noteText.value;
    let color = noteContainer.style.borderColor;

    if (!title) {
      alert("Missing note title");
      return;
    }

    let note = {
      id: id,
      title: title,
      text: text,
      color: color,
    };

    let index = getNoteIndexById(id);
    if (index === null) {
      note.id = noteListNextId();
      notes.push(note);
    } else {
      notes[index] = note;
    }

    loadNoteList();
  }

  // Delete a note from the notes array.
  function deleteNote(index) {
    index = parseInt(index);

    if (!isNaN(index)) {
      notes.splice(index, 1);
    }

    loadNote();
    loadNoteList();
  }

  // Find a note by its ID.
  // We use a separate ID attribute instead of the array index.
  // This allows us to sort the array and alter it without affecting the note IDs.
  function getNoteIndexById(id) {
    id = parseInt(id);
    if (isNaN(id)) {
      return null;
    }

    let index = null;
    notes.forEach((v, k) => {
      if (v.id === id) {
        index = k;
      }
    });
    return index;
  }

  // Find out what the next note ID should be.
  function noteListNextId() {
    let maxId = -1;
    notes.forEach(note => {
      let id = parseInt(note.id);
      if (!isNaN(id)) {
        maxId = Math.max(maxId, id);
      }
    });

    return maxId + 1;
  }

  // Load the notes array into the HTML list in the DOM.
  function loadNoteList() {
    noteList.innerHTML = "";
    for (let i = 0; i < notes.length; i++) {
      noteList.appendChild(createNoteListNode(i));
    }
  }

  // Creates the DOM nodes to use in the HTML note list.
  function createNoteListNode(index) {
    let note = notes[index];
    let div = document.createElement("div");
    div.classList.add("note-item");
    div.innerHTML = note.title;
    div.dataset.noteId = note.id;

    if (note.color) {
      div.style.border = `4px ${note.color} solid`;
    }

    div.addEventListener("click", event => {
      event.preventDefault();
      event.stopPropagation();
      loadNote(div.dataset.noteId);
    }, false);

    return div;
  }

  // Validate an imported note array.
  // We do some simple checks to avoid breaking the app when importing bad data.
  function validateNotesArray(notesArray) {
    if (!Array.isArray(notesArray)) {
      return false;
    }

    let pass = true;
    notesArray.forEach((v, k) => {
      let index = parseInt(k);
      if (isNaN(index)) {
        pass = false;
        return false;
      }
      if (typeof v !== "object") {
        pass = false;
        return false;
      }

      let id = parseInt(v.id);
      if (isNaN(id)) {
        pass = false;
        return false;
      }
      if (typeof v.title === "undefined") {
        pass = false;
        return false;
      }
      if (typeof v.text === "undefined") {
        pass = false;
        return false;
      }
    });

    return pass;
  }

  function buildColorSelector() {
    colorSelector.innerHTML = "";

    let keys = Object.keys(colorList);
    for (let i = 0; i < keys.length; i++) {
      let k = keys[i];
      let v = colorList[k];
      if (colorList.hasOwnProperty(k)) {
        let div = document.createElement("div");
        div.dataset.color = v;
        div.classList.add("color-item");
        div.style.backgroundColor = v;

        div.addEventListener("click", event => {
          event.preventDefault();
          setNoteContainerBorderColor(div.dataset.color);
        }, false);

        colorSelector.appendChild(div);
      }
    }
  }

  function setNoteContainerBorderColor(borderColor) {
    if (!borderColor) {
      borderColor = noteDefaultBorderColor;
    }
    noteContainer.style.borderColor = borderColor;
  }

  buildColorSelector();
  loadNoteList();
  loadNote();
})();