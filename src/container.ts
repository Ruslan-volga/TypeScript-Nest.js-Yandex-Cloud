import 'reflect-metadata';
import { Container } from 'inversify';
import { BooksRepository } from './repositories/books-repository.abstract';
import { MockBooksRepository } from './repositories/mock-books-repository';

const container = new Container();
container.bind<BooksRepository>(BooksRepository).to(MockBooksRepository).inSingletonScope();

export { container };