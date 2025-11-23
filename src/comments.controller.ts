import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { BookCommentsService } from './book-comments/book-comments.service';

@Controller('comments')
export class CommentsController {
  constructor(private readonly bookCommentsService: BookCommentsService) {}

  @Get()
  getAllComments() {
    return this.bookCommentsService.findAll();
  }

  @Get('book/:bookId')
  getBookComments(@Param('bookId') bookId: number) {
    return this.bookCommentsService.findAllBookComment(bookId);
  }

  @Post()
  createComment(@Body() createCommentDto: { bookId: number; comment: string }) {
    return this.bookCommentsService.create(createCommentDto.bookId, createCommentDto.comment);
  }
}