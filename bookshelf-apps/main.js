let books = [];
const RENDER_EVENT = 'render-book';
const SAVE_EVENT = 'saved-book';
const STORAGE_KEY = 'Book_app';

function generatedId() {
    return + new Date();
}

function findBookIndex(bookId) {
    for (const index in books) {
        if (books[index].id === bookId) {
            return index
        }
    }

    return null;
}

function findBook(bookId) {
    for(const bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }
    return null;
}

function isStorageExist() /* boolean */ {
    if (typeof (Storage) === undefined) {
      alert('Browser kamu tidak mendukung local storage');
      return false;
    }
    return true;
  }

function saveData() {
    if (isStorageExist()) {
      const parsed /* string */ = JSON.stringify(books);
      localStorage.setItem(STORAGE_KEY, parsed);
      document.dispatchEvent(new Event(SAVE_EVENT));
    }
  }

  function loadDataFromStorage() {
    const serializedData /* string */ = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
  
    if (data !== null) {
      for (const book of data) {
        books.push(book);
      }
    }
  
    document.dispatchEvent(new Event(RENDER_EVENT));
  }


function addBook() {
    const Title = document.getElementById('inputBookTitle').value;
    const Author = document.getElementById('inputBookAuthor').value;
    const Year = document.getElementById('inputBookYear').value;
    const isComplete = document.getElementById('inputBookIsComplete').checked;
    const generatedID = generatedId();
    const booksObject = generateBooksObject(generatedID, Title, Author, Year, isComplete);
    books.push(booksObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function generateBooksObject(id, Title, Author, Year, isComplete) {
    return {
    id,
    Title,
    Author,
    Year,
    isComplete
    }
}

function makeBooks(booksObject) {
    const bookTitle = document.createElement('h3');
    bookTitle.innerText = booksObject.Title;

    const bookAuthor = document.createElement('p');
    bookAuthor.innerText = 'Penulis : ' + booksObject.Author;

    const bookYear = document.createElement('p');
    bookYear.innerText = 'Tahun : ' + booksObject.Year;

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('action');

    const trashButton = document.createElement('button');
    trashButton.classList.add('red');
    trashButton.innerText = 'Hapus';
    trashButton.setAttribute('id', 'button-delete');

    const textContainer = document.createElement('article');
    textContainer.classList.add('book_item');
    textContainer.append(bookTitle, bookAuthor, bookYear, buttonContainer);
    textContainer.setAttribute('id', `book-${booksObject.id}`);

    if (booksObject.isComplete) {
        const undoButton = document.createElement('button');
        undoButton.classList.add('green');
        undoButton.setAttribute('id', 'button-undo');
        undoButton.innerText = 'Undo';
        buttonContainer.append(undoButton, trashButton);

        undoButton.addEventListener('click', function() {
            undoTaskFromCompleted(booksObject.id);
        });

        trashButton.addEventListener('click', function() {
            removeTaskFromComplated(booksObject.id);
        })
        
}   else {
        const finishButton = document.createElement('button');
        finishButton.classList.add('green');
        finishButton.setAttribute('id', 'button-finish');
        finishButton.innerText = 'Selesai';
        buttonContainer.append(finishButton, trashButton);
        finishButton.addEventListener('click', function() {
            addTaskToComplated(booksObject.id);
        });

        trashButton.addEventListener('click', function() {
            removeTaskFromComplated(booksObject.id);    
        });
    }
    return textContainer;    
}

function addTaskToComplated(bookId) {
    const bookTarget = findBook(bookId);
    
    if (bookTarget == null) return;

    bookTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}


function removeTaskFromComplated(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget === -1) return;

    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    alert("Buku Berhasil Dihapus");
}

function undoTaskFromCompleted(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

document.addEventListener(RENDER_EVENT, function () {
    const uncompletedBookList = document.getElementById(
      "incompleteBookshelfList"
    );
    uncompletedBookList.innerHTML = "";
  
    const completedBookList = document.getElementById("completeBookshelfList");
    completedBookList.innerHTML = "";
  
    for (const bookItem of books) {
      const bookElement = makeBooks(bookItem);
  
      if (bookItem.isComplete) {
        completedBookList.append(bookElement);
      } else {
        uncompletedBookList.append(bookElement);
      }
    }
  });

document.addEventListener('DOMContentLoaded', function() {
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function(event) {
        event.preventDefault();
        addBook();
        submitForm.reset()
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

