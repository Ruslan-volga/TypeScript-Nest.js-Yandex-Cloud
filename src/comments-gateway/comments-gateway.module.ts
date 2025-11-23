import { Module } from '@nestjs/common';
import { CommentsGateway } from './comments.gateway';
import { BookCommentsModule } from '../book-comments/book-comments.module';

@Module({
  imports: [BookCommentsModule],
  providers: [CommentsGateway],
})
export class CommentsGatewayModule {}