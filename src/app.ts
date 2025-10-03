import { Book } from './entities/book.interface';
import { MockBooksRepository } from './repositories/mock-books-repository';

async function testRepository() {
  const repository = new MockBooksRepository();

  // Создаем книгу
  const newBook = await repository.createBook({
    title: "TypeScript для профессионалов",
    description: "Подробное руководство по TypeScript",
    authors: "Джон Дойл",
    favorite: true
  });

  console.log('Создана книга:', newBook);

  // Получаем все книги
  const allBooks = await repository.getBooks();
  console.log('Все книги:', allBooks);

  // Проверяем строгий режим (это вызовет ошибку компиляции если strict=true)
  const book: Book = {
    id: "1",
    title: "Тест",
    description: "Описание",
    authors: "Автор",
    favorite: false
    // fileCover, fileName, fileBook - необязательные, можно не указывать
  };

  // Проверяем strictNullChecks=false (это должно работать)
  let possibleNull: string = null; // Разрешено при strictNullChecks=false
  possibleNull = "теперь строка";
}

testRepository().catch(console.error);