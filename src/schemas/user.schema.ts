import { Schema } from 'mongoose';

// Создаем класс User который можно использовать и как тип и как значение
export class User {
  name: string;
  email: string;
  age: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}

export const UserSchema = new Schema<User>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true,
});