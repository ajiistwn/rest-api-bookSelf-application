const { nanoid } = require('nanoid')
const books = require('./books');

const addBook = (request, h) => {
    // Validasi payload
    if (!request.payload) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Data tidak valid.',
        });
        response.code(400);
        return response;
    }

    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

    // Validasi nama buku
    if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }

    // Validasi pageCount dan readPage
    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }

    // Menambahkan buku baru
    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = pageCount === readPage;

    const newBook = {
        id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt,
    };

    books.push(newBook);

    // Validasi keberhasilan penambahan buku
    const isSuccess = books.some((book) => book.id === id);

    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        });
        response.code(201);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Gagal menambahkan buku.',
    });
    response.code(400);
    return response;
}


//get all books
const getAllBooks = (request, h) => {   
    const { name, reading, finished } = request.query;

    //query books for name
    let filteredBooks = books;
    if (name) {
        filteredBooks = books.filter((book) =>
            book.name.toLowerCase().includes(name.toLowerCase())
        );
    }

    //query books for reading
    if (reading) {
        const isReading = reading === '1';
        filteredBooks = books.filter((book) => book.reading === isReading );
    }

    //query books for finished
    if (finished) {
        const isFinished = finished === '1';
        filteredBooks = books.filter((book) => book.finished === isFinished );
    }

    let newBook = filteredBooks.map(({id, name, publisher}) => ({id, name, publisher}));

    const response = h.response({
        status: 'success',
        data: {
            books: newBook,
        },
    });
    response.code(200);
    return response;
};

// get book by id
const getBookById = (request, h) => {
    const { id } = request.params;
  
    const book = books.filter((n) => n.id === id)[0];
  
    if (book !== undefined) {
      return {
        status: 'success',
        data: {
          book,
        },
      };
    }
  
    const response = h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
};

//edit book by id
const editBookById = (request, h) => {
    const { id } = request.params;
  
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    if(!name){
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }

    if(readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }

    const updatedAt = new Date().toISOString();
  
    const index = books.findIndex((book) => book.id === id);
  
    if (index !== -1) {
      books[index] = {
        ...books[index],
        name,
        year,
        author,
        summary, 
        publisher, 
        pageCount, 
        readPage, 
        reading,
        updatedAt,
      };
  
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
      });
      response.code(200);
      return response;
    }
  
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

// delete book by id
const deleteBookById = (request, h) => {
    const { id } = request.params;
  
    const index = books.findIndex((book) => book.id === id);
  
    if (index !== -1) {
      books.splice(index, 1);
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil dihapus',
      });
      response.code(200);
      return response;
    }
  
    const response = h.response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};



module.exports = { addBook, getAllBooks, getBookById, editBookById, deleteBookById}