import { Schema } from 'mongoose';

export interface Book {
  title: string;
  author: string;
  year: number;
  isAvailable?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export const BookSchema = new Schema<Book>({
  title: { type: String, required: true },
  author: { type: String, required: true },
  year: { type: Number, required: true },
  isAvailable: { type: Boolean, default: true },
}, {
  timestamps: true,
});