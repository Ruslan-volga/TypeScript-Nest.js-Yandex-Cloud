export class BookCommentModel {
  id: number;
  bookId: number;
  comment: string;

  constructor(bookId: number, comment: string, id?: number) {
    this.id = id || Date.now();
    this.bookId = bookId;
    this.comment = comment;
  }
}