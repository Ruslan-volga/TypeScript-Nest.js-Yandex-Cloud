import { Module } from "@nestjs/common";
import { HttpModule } from '@nestjs/axios';
import { RxjsService } from "./rxjs.service";
import { RxjsController } from "./rxjs.controller";

@Module({
  imports: [HttpModule],
  controllers: [RxjsController],
  providers: [RxjsService],
  exports: [RxjsService],
})
export class RxjsModule {}