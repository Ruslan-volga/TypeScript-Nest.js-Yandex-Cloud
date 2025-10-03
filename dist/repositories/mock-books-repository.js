"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockBooksRepository = void 0;
const books_repository_abstract_1 = require("./books-repository.abstract");
class MockBooksRepository extends books_repository_abstract_1.BooksRepository {
    constructor() {
        super(...arguments);
        this.books = [];
        this.idCounter = 1;
    }
    createBook(book) {
        return __awaiter(this, void 0, void 0, function* () {
            const newBook = Object.assign(Object.assign({}, book), { id: String(this.idCounter++) });
            this.books.push(newBook);
            return newBook;
        });
    }
    getBook(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.books.find(book => book.id === id) || null;
        });
    }
    getBooks() {
        return __awaiter(this, void 0, void 0, function* () {
            return [...this.books];
        });
    }
    updateBook(id, updates) {
        return __awaiter(this, void 0, void 0, function* () {
            const bookIndex = this.books.findIndex(book => book.id === id);
            if (bookIndex === -1)
                return null;
            this.books[bookIndex] = Object.assign(Object.assign({}, this.books[bookIndex]), updates);
            return this.books[bookIndex];
        });
    }
    deleteBook(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const initialLength = this.books.length;
            this.books = this.books.filter(book => book.id !== id);
            return this.books.length < initialLength;
        });
    }
    findBooksByTitle(title) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.books.filter(book => book.title.toLowerCase().includes(title.toLowerCase()));
        });
    }
}
exports.MockBooksRepository = MockBooksRepository;
