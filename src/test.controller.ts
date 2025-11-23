import { Controller, Get, Post, Body } from '@nestjs/common';
import { BookCommentsService } from './book-comments/book-comments.service';

@Controller('test')
export class TestController {
  constructor(private readonly bookCommentsService: BookCommentsService) {}
  
  @Get()
  getTest() {
    return { 
      message: 'Server is working!',
      timestamp: new Date().toISOString()
    };
  }
  
  @Post('add-comment')
  addComment(@Body() data: { bookId: number; comment: string }) {
    const newComment = this.bookCommentsService.create(data.bookId, data.comment);
    return {
      success: true,
      comment: newComment
    };
  }
  
  @Get('comments/:bookId')
  getComments(@Body() data: { bookId: number }) {
    const comments = this.bookCommentsService.findAllBookComment(data.bookId);
    return {
      bookId: data.bookId,
      comments: comments
    };
  }
}