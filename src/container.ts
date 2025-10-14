import 'reflect-metadata';
import { Container } from 'inversify';
import { BooksRepository, IBooksRepository } from './repositories/books-repository.abstract';
import { MockBooksRepository } from './repositories/mock-books-repository';

const container = new Container();

// Регистрируем BooksRepository с типизацией
container.bind<IBooksRepository>(BooksRepository).to(MockBooksRepository).inSingletonScope();

export { container };