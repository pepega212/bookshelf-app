document.addEventListener("DOMContentLoaded", function () {
  const inputBookForm = document.getElementById("inputBook");
  const incompleteBookshelfList = document.getElementById(
    "incompleteBookshelfList"
  );
  const completeBookshelfList = document.getElementById(
    "completeBookshelfList"
  );
  const searchBookForm = document.getElementById("searchBook");
  const books = JSON.parse(localStorage.getItem("books")) || [];
  renderBooks();

  inputBookForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const title = document.getElementById("inputBookTitle").value;
    const author = document.getElementById("inputBookAuthor").value;
    const year = parseInt(document.getElementById("inputBookYear").value, 10);
    const isComplete = document.getElementById("inputBookIsComplete").checked;

    const newBook = {
      id: +new Date(),
      title: title,
      author: author,
      year: year,
      isComplete: isComplete,
    };

    if (isComplete) {
      books.push(newBook);
    } else {
      books.unshift(newBook);
    }

    localStorage.setItem("books", JSON.stringify(books));
    inputBookForm.reset();
    renderBooks();
  });

  searchBookForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const searchTerm = document
      .getElementById("searchBookTitle")
      .value.toLowerCase();
    const filteredBooks = books.filter((book) =>
      book.title.toLowerCase().includes(searchTerm)
    );
    if (filteredBooks.length === 0) {
      incompleteBookshelfList.style.display = "none";
      completeBookshelfList.style.display = "none";
    } else {
      incompleteBookshelfList.style.display = "block";
      completeBookshelfList.style.display = "block";
      renderBooks(filteredBooks);
    }
  });

  const editBookForm = document.getElementById("editBookForm");
  editBookForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const editedTitle = document.getElementById("editBookTitle").value;
    const editedAuthor = document.getElementById("editBookAuthor").value;
    const editedYear = document.getElementById("editBookYear").value;

    const selectedBookId = editBookForm.getAttribute("data-id");
    const index = books.findIndex((book) => book.id == selectedBookId);

    if (index !== -1) {
      books[index].title = editedTitle;
      books[index].author = editedAuthor;
      books[index].year = editedYear;
      localStorage.setItem("books", JSON.stringify(books));
      renderBooks();
    }

    const backdrop = document.querySelector(".backdrop");
    if (backdrop) {
      document.body.removeChild(backdrop);
    }

    const editModal = document.getElementById("editBookModal");
    editModal.style.display = "none";
  });

  function openEditModal(book) {
    const modal = document.getElementById("editBookModal");
    const titleInput = document.getElementById("editBookTitle");
    const authorInput = document.getElementById("editBookAuthor");
    const yearInput = document.getElementById("editBookYear");

    const backdrop = document.createElement("div");
    backdrop.classList.add("backdrop");
    document.body.appendChild(backdrop);

    titleInput.value = book.title;
    authorInput.value = book.author;
    yearInput.value = book.year;

    editBookForm.setAttribute("data-id", book.id);

    modal.style.display = "block";

    const closeButton = document.getElementById("closeEdit");
    closeButton.addEventListener("click", () => {
      modal.style.display = "none";
      document.body.removeChild(backdrop);
    });
  }

  function renderBooks(filteredBooks = []) {
    incompleteBookshelfList.innerHTML = "";
    completeBookshelfList.innerHTML = "";

    const booksToRender = filteredBooks.length > 0 ? filteredBooks : books;

    booksToRender.forEach(function (book) {
      const bookItem = document.createElement("article");
      bookItem.classList.add("book_item");
      bookItem.innerHTML = `
        <h3>${book.title}</h3>
        <p>Penulis: ${book.author}</p>
        <p>Tahun: ${book.year}</p>
        <div class="action">
          <button class="${
            book.isComplete ? "red" : "green"
          } complete data-id="${book.id}">${
        book.isComplete ? "Belum selesai di Baca" : "Selesai dibaca"
      }</button>
          <button class="red delete" data-id="${book.id}">Hapus buku</button>
          <button class="blue edit" data-id="${book.id}">Edit buku</button>
        </div>
      `;

      const deleteButton = bookItem.querySelector(".delete");
      deleteButton.addEventListener("click", () => {
        const index = books.findIndex((b) => b.id === book.id);
        if (index !== -1) {
          Swal.fire({
            title: "Apa anda yakin?",
            text: "Buku akan terhapus dari list",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Ya",
            cancelButtonText: "Batal",
          }).then((result) => {
            if (result.isConfirmed) {
              books.splice(index, 1);
              localStorage.setItem("books", JSON.stringify(books));
              renderBooks();
            }
          });
        }
      });

      const editButton = bookItem.querySelector(".edit");
      editButton.addEventListener("click", () => {
        const index = books.findIndex((b) => b.id === book.id);
        openEditModal(books[index]);
      });

      const completeButton = bookItem.querySelector(".complete");
      completeButton.addEventListener("click", () => {
        const index = books.findIndex((b) => b.id === book.id);
        if (index !== -1) {
          books[index].isComplete = !books[index].isComplete;
          localStorage.setItem("books", JSON.stringify(books));
          renderBooks();
        }

        localStorage.setItem("books", JSON.stringify(books));
        renderBooks();
      });

      if (book.isComplete) {
        completeBookshelfList.appendChild(bookItem);
      } else {
        incompleteBookshelfList.appendChild(bookItem);
      }
    });
  }
});
