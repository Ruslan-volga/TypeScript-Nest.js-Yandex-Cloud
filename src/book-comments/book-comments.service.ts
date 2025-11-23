import { Injectable, NotFoundException } from '@nestjs/common';
import { BookCommentModel } from './models/book-comment.model';

@Injectable()
export class BookCommentsService {
  private comments: BookCommentModel[] = [];
  private idCounter = 1;

  create(bookId: number, comment: string): BookCommentModel {
    const newComment = new BookCommentModel(bookId, comment, this.idCounter++);
    this.comments.push(newComment);
    return newComment;
  }

  findAllBookComment(bookId: number): BookCommentModel[] {
    return this.comments.filter(comment => comment.bookId === bookId);
  }

  findOne(id: number): BookCommentModel {
    const comment = this.comments.find(comment => comment.id === id);
    if (!comment) {
      throw new NotFoundException(`Comment with id ${id} not found`);
    }
    return comment;
  }

  update(id: number, comment: string): BookCommentModel {
    const existingComment = this.findOne(id);
    existingComment.comment = comment;
    return existingComment;
  }

  remove(id: number): BookCommentModel {
    const index = this.comments.findIndex(comment => comment.id === id);
    if (index === -1) {
      throw new NotFoundException(`Comment with id ${id} not found`);
    }
    const [deletedComment] = this.comments.splice(index, 1);
    return deletedComment;
  }

  findAll(): BookCommentModel[] {
    return [...this.comments];
  }
}