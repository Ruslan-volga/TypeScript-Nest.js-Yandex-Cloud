import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { BookCommentsModule } from './book-comments/book-comments.module';
import { CommentsGatewayModule } from './comments-gateway/comments-gateway.module';

@Module({
  imports: [
    BookCommentsModule,
    CommentsGatewayModule,
  ],
  controllers: [CommentsController],
})
export class AppModule {}