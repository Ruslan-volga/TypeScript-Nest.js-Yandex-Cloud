import 'reflect-metadata';
import express from 'express';
import { container } from './container';
import { BooksRepository } from './repositories/books-repository.abstract';

console.log('🔧 Starting application initialization...');

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  try {
    // Декодируем URL параметры
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

// Корневой маршрут
app.get('/', (req, res) => {
  console.log('✅ GET / - serving root route');
  res.json({
    message: 'Library API is running!',
    timestamp: new Date().toISOString()
  });
});

// Health check
app.get('/health', (req, res) => {
  console.log('✅ GET /health - serving health check');
  res.json({ 
    status: 'OK', 
    message: 'Library API is running',
    timestamp: new Date().toISOString()
  });
});

// Получить все книги
app.get('/api/books', async (req, res) => {
  try {
    console.log('🔄 GET /api/books - getting repository from container');
    const repo = container.get(BooksRepository);
    console.log('✅ Repository obtained from container');
    
    console.log('🔄 Calling getBooks() method');
    const books = await repo.getBooks();
    console.log(`✅ getBooks() returned ${books.length} books`);
    
    res.json(books);
  } catch (error) {
    console.error('❌ Error in GET /api/books:', error);
    console.error('❌ Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to get books',
      details: error.message 
    });
  }
});

// Создать книгу
app.post('/api/books', async (req, res) => {
  try {
    console.log('🔄 POST /api/books - received data:', req.body);
    
    const { title, description, authors, favorite } = req.body;
    
    if (!title || !description || !authors) {
      console.log('❌ Missing required fields');
      return res.status(400).json({ 
        error: 'Title, description and authors are required' 
      });
    }
    
    console.log('🔄 Getting repository from container');
    const repo = container.get(BooksRepository);
    console.log('✅ Repository obtained from container');
    
    console.log('🔄 Calling createBook() method');
    const newBook = await repo.createBook({
      title,
      description,
      authors,
      favorite: favorite || false
    });
    
    console.log('✅ createBook() returned:', newBook);
    res.status(201).json(newBook);
  } catch (error) {
    console.error('❌ Error in POST /api/books:', error);
    console.error('❌ Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to create book',
      details: error.message 
    });
  }
});

// Получить книгу по ID
app.get('/api/books/:id', async (req, res) => {
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

// Обновить книгу
app.put('/api/books/:id', async (req, res) => {
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
app.delete('/api/books/:id', async (req, res) => {
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
app.get('/api/books/search/:title', async (req, res) => {
  try {
    const repo = container.get(BooksRepository);
    const books = await repo.findBooksByTitle(req.params.title);
    res.json(books);
  } catch (error) {
    console.error('Error searching books:', error);
    res.status(500).json({ error: 'Failed to search books' });
  }
});
const PORT = process.env.PORT || 3003;

// Проверяем контейнер при запуске
console.log('🔧 Testing container initialization...');
try {
  const testRepo = container.get(BooksRepository);
  console.log('✅ Container initialized successfully');
} catch (error) {
  console.error('❌ Container initialization failed:', error);
}

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log('📚 Library API with IoC Container');
});