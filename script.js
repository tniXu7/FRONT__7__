const noteText = document.getElementById('note-text');
const addNoteButton = document.getElementById('add-note');
const notesList = document.getElementById('notes');
const offlineMessage = document.getElementById('offline-message');

let notes = [];

// Загрузка заметок из локального хранилища
function loadNotes() {
  const storedNotes = localStorage.getItem('notes');
  if (storedNotes) {
    notes = JSON.parse(storedNotes);
  }
  renderNotes();
}

// Сохранение заметок в локальное хранилище
function saveNotes() {
  localStorage.setItem('notes', JSON.stringify(notes));
}

// Отображение заметок
function renderNotes() {
  notesList.innerHTML = ''; // Очищаем список перед перерисовкой
  notes.forEach((note, index) => {
    const li = document.createElement('li');

    // Контейнер для текста заметки
    const noteTextContainer = document.createElement('div');
    noteTextContainer.classList.add('note-text-container');
    noteTextContainer.textContent = note;
    li.appendChild(noteTextContainer);

    // Контейнер для кнопок
    const noteButtonsContainer = document.createElement('div');
    noteButtonsContainer.classList.add('note-buttons-container');

    // Кнопки (Редактировать и Удалить)
    const editButton = document.createElement('button');
    editButton.textContent = 'Редактировать';
    editButton.classList.add('button', 'secondary-button');
    editButton.addEventListener('click', () => showEditForm(index, li));

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Удалить';
    deleteButton.classList.add('button', 'danger-button');
    deleteButton.addEventListener('click', () => deleteNote(index));

    noteButtonsContainer.appendChild(editButton);
    noteButtonsContainer.appendChild(deleteButton);

    li.appendChild(noteButtonsContainer);

    notesList.appendChild(li);
  });
}

// Функция для показа формы редактирования
function showEditForm(index, listItem) {
  const note = notes[index];
  const editForm = document.createElement('div');
  editForm.innerHTML = `
    <textarea class="note-input">${note}</textarea>
    <div class="add-button-container">
      <button class="button primary-button save-edit">Сохранить</button>
      <button class="button secondary-button cancel-edit">Отмена</button>
    </div>
  `;

  listItem.innerHTML = '';
  listItem.appendChild(editForm);

  const saveEditButton = editForm.querySelector('.save-edit');
  const cancelEditButton = editForm.querySelector('.cancel-edit');
  const editTextarea = editForm.querySelector('.note-input');

  saveEditButton.addEventListener('click', () => {
    const newText = editTextarea.value.trim();
    if (newText !== '') {
      notes[index] = newText;
      saveNotes();
      renderNotes();
    }
  });

  cancelEditButton.addEventListener('click', () => {
    renderNotes();
  });
}

// Добавление заметки
function addNote() {
  const text = noteText.value.trim();
  if (text !== '') {
    notes.push(text);
    saveNotes();
    renderNotes();
    noteText.value = '';
  }
}

// Удаление заметки
function deleteNote(index) {
  notes.splice(index, 1);
  saveNotes();
  renderNotes();
}

// Проверка статуса сети
function updateOnlineStatus() {
  if (navigator.onLine) {
    offlineMessage.classList.add('hidden');
  } else {
    offlineMessage.classList.remove('hidden');
  }
}

// Обработчики событий
addNoteButton.addEventListener('click', addNote);
window.addEventListener('load', loadNotes);
window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

// Инициализация статуса сети
updateOnlineStatus();