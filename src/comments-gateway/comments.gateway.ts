import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { BookCommentsService } from '../book-comments/book-comments.service';

@WebSocketGateway({
  cors: {
    origin: "*",
  }
})
export class CommentsGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly bookCommentsService: BookCommentsService) {}

  @SubscribeMessage('addComment')
  handleAddComment(@MessageBody() data: { bookId: number; comment: string }) {
    console.log('📨 WebSocket: addComment received', data);
    
    const newComment = this.bookCommentsService.create(data.bookId, data.comment);
    
    // Отправляем ответ всем подключенным клиентам
    this.server.emit('newComment', newComment);
    
    console.log('✅ Comment created:', newComment);
    return { event: 'commentAdded', data: newComment };
  }

  @SubscribeMessage('getAllComments')
  handleGetAllComments(@MessageBody() data: { bookId: number }) {
    console.log('📨 WebSocket: getAllComments received for book', data.bookId);
    
    const comments = this.bookCommentsService.findAllBookComment(data.bookId);
    
    return { event: 'allComments', data: comments };
  }
}