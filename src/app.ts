import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import { container } from './container';
import { BooksRepository } from './repositories/books-repository.abstract';
import { Book } from './entities/book.interface';

const app = express();

// Middleware для парсинга JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Middleware для установки charset
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});

// Middleware для обработки URL encoding
app.use((req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.params) {
      for (const key in req.params) {
        if (typeof req.params[key] === 'string') {
          req.params[key] = decodeURIComponent(req.params[key]);
        }
      }
    }
    next();
  } catch (error) {
    console.error('URL decoding error:', error);
    res.status(400).json({ error: 'Invalid URL encoding' });
  }
});

// Интерфейсы для типизации запросов
interface CreateBookRequest extends Request {
  body: Omit<Book, 'id'>;
}

interface UpdateBookRequest extends Request {
  body: Partial<Book>;
}

// Корневой маршрут
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Library API is running!',
    timestamp: new Date().toISOString(),
    endpoints: [
      'GET /health',
      'GET /api/books',
      'GET /api/books/:id',
      'POST /api/books',
      'PUT /api/books/:id',
      'DELETE /api/books/:id',
      'GET /api/books/search/:title'
    ]
  });
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'OK',
    message: 'Library API is running',
    timestamp: new Date().toISOString()
  });
});

// Получить все книги
app.get('/api/books', async (req: Request, res: Response) => {
  try {
    const repo = container.get(BooksRepository);
    const books = await repo.getBooks();
    res.json(books);
  } catch (error) {
    console.error('Error getting books:', error);
    res.status(500).json({ error: 'Failed to get books' });
  }
});

// Получить книгу по ID
app.get('/api/books/:id', async (req: Request, res: Response) => {
  try {
    const repo = container.get(BooksRepository);
    const book = await repo.getBook(req.params.id);

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json(book);
  } catch (error) {
    console.error('Error getting book:', error);
    res.status(500).json({ error: 'Failed to get book' });
  }
});

// Создать книгу
app.post('/api/books', async (req: CreateBookRequest, res: Response) => {
  try {
    const { title, description, authors, favorite, fileCover, fileName, fileBook } = req.body;

    if (!title || !description || !authors) {
      return res.status(400).json({
        error: 'Title, description and authors are required'
      });
    }

    const repo = container.get(BooksRepository);
    const newBook = await repo.createBook({
      title,
      description,
      authors,
      favorite: favorite || false,
      fileCover,
      fileName,
      fileBook
    });

    res.status(201).json(newBook);
  } catch (error) {
    console.error('Error creating book:', error);
    res.status(500).json({ error: 'Failed to create book' });
  }
});

// Обновить книгу
app.put('/api/books/:id', async (req: UpdateBookRequest, res: Response) => {
  try {
    const repo = container.get(BooksRepository);
    const updatedBook = await repo.updateBook(req.params.id, req.body);

    if (!updatedBook) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json(updatedBook);
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ error: 'Failed to update book' });
  }
});

// Удалить книгу
app.delete('/api/books/:id', async (req: Request, res: Response) => {
  try {
    const repo = container.get(BooksRepository);
    const deleted = await repo.deleteBook(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ error: 'Failed to delete book' });
  }
});

// Поиск книг по названию
app.get('/api/books/search/:title', async (req: Request, res: Response) => {
  try {
    const repo = container.get(BooksRepository);
    const books = await repo.findBooksByTitle(req.params.title);
    res.json(books);
  } catch (error) {
    console.error('Error searching books:', error);
    res.status(500).json({ error: 'Failed to search books' });
  }
});

// Обработчик 404
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    error: 'Route not found',
    availableRoutes: ['/', '/health', '/api/books']
  });
});

// Обработчик ошибок
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: error.message
  });
});

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log('📚 Library API with TypeScript and IoC Container');
});