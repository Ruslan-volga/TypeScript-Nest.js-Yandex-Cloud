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
const mock_books_repository_1 = require("./repositories/mock-books-repository");
function testRepository() {
    return __awaiter(this, void 0, void 0, function* () {
        const repository = new mock_books_repository_1.MockBooksRepository();
        // Создаем книгу
        const newBook = yield repository.createBook({
            title: "TypeScript для профессионалов",
            description: "Подробное руководство по TypeScript",
            authors: "Джон Дойл",
            favorite: true
        });
        console.log('Создана книга:', newBook);
        // Получаем все книги
        const allBooks = yield repository.getBooks();
        console.log('Все книги:', allBooks);
        // Проверяем строгий режим (это вызовет ошибку компиляции если strict=true)
        const book = {
            id: "1",
            title: "Тест",
            description: "Описание",
            authors: "Автор",
            favorite: false
            // fileCover, fileName, fileBook - необязательные, можно не указывать
        };
        // Проверяем strictNullChecks=false (это должно работать)
        let possibleNull = null; // Разрешено при strictNullChecks=false
        possibleNull = "теперь строка";
    });
}
testRepository().catch(console.error);
