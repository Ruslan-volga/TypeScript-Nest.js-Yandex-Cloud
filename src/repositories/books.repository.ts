import { injectable } from 'inversify';
import { MongoClient, ObjectId } from 'mongodb';
import { BooksRepository } from './books-repository.abstract';
import { Book } from '../entities/book.interface';

@injectable()
export class MongoDBBooksRepository extends BooksRepository {
  private client: MongoClient | null = null;
  private db: any = null;
  private collection: any = null;
  private isConnected = false;
  private connectionString = 'mongodb://admin:password@localhost:27017/library?authSource=admin';

  constructor() {
    super();
    this.connect();
  }

  private async connect(): Promise<void> {
    try {
      this.client = new MongoClient(this.connectionString);
      await this.client.connect();
      this.db = this.client.db('library');
      this.collection = this.db.collection('books');
      this.isConnected = true;
      console.log('✅ Successfully connected to MongoDB');
    } catch (error) {
      console.error('❌ MongoDB connection error:', error);
      this.isConnected = false;
    }
  }

  private async ensureConnection(): Promise<void> {
    if (!this.isConnected) {
      await this.connect();
    }
  }

  async createBook(bookData: Omit<Book, 'id'>): Promise<Book> {
    await this.ensureConnection();
    
    const bookToInsert = {
      ...bookData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await this.collection.insertOne(bookToInsert);
    const createdBook = await this.collection.findOne({ _id: result.insertedId });
    
    return {
      id: createdBook._id.toString(),
      title: createdBook.title,
      description: createdBook.description,
      authors: createdBook.authors,
      favorite: createdBook.favorite,
      fileCover: createdBook.fileCover,
      fileName: createdBook.fileName,
      fileBook: createdBook.fileBook
    };
  }

  async getBook(id: string): Promise<Book | null> {
    await this.ensureConnection();
    
    if (!ObjectId.isValid(id)) {
      return null;
    }
    
    const book = await this.collection.findOne({ _id: new ObjectId(id) });
    if (!book) return null;
    
    return {
      id: book._id.toString(),
      title: book.title,
      description: book.description,
      authors: book.authors,
      favorite: book.favorite,
      fileCover: book.fileCover,
      fileName: book.fileName,
      fileBook: book.fileBook
    };
  }

  async getBooks(): Promise<Book[]> {
    await this.ensureConnection();
    
    const books = await this.collection.find().sort({ createdAt: -1 }).toArray();
    return books.map((book: any) => ({
      id: book._id.toString(),
      title: book.title,
      description: book.description,
      authors: book.authors,
      favorite: book.favorite,
      fileCover: book.fileCover,
      fileName: book.fileName,
      fileBook: book.fileBook
    }));
  }

  async updateBook(id: string, updates: Partial<Book>): Promise<Book | null> {
    await this.ensureConnection();
    
    if (!ObjectId.isValid(id)) {
      return null;
    }
    
    const updateData = {
      ...updates,
      updatedAt: new Date()
    };
    
    // Удаляем id из обновлений, так как он не должен меняться
    delete (updateData as any).id;
    
    const result = await this.collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    );
    
    if (!result.value) return null;
    
    const updatedBook = result.value;
    return {
      id: updatedBook._id.toString(),
      title: updatedBook.title,
      description: updatedBook.description,
      authors: updatedBook.authors,
      favorite: updatedBook.favorite,
      fileCover: updatedBook.fileCover,
      fileName: updatedBook.fileName,
      fileBook: updatedBook.fileBook
    };
  }

  async deleteBook(id: string): Promise<boolean> {
    await this.ensureConnection();
    
    if (!ObjectId.isValid(id)) {
      return false;
    }
    
    const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }

  async findBooksByTitle(title: string): Promise<Book[]> {
    await this.ensureConnection();
    
    const books = await this.collection.find({ 
      title: { $regex: title, $options: 'i' } 
    }).sort({ createdAt: -1 }).toArray();
    
    return books.map((book: any) => ({
      id: book._id.toString(),
      title: book.title,
      description: book.description,
      authors: book.authors,
      favorite: book.favorite,
      fileCover: book.fileCover,
      fileName: book.fileName,
      fileBook: book.fileBook
    }));
  }
}