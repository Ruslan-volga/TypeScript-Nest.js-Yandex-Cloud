import { Controller, Get, Query } from "@nestjs/common";
import { RxjsService } from "./rxjs.service";
import { IParamText } from "./interfaces/text-param";
import { firstValueFrom } from "rxjs";

@Controller("rxjs")
export class RxjsController {
  constructor(private rxjsService: RxjsService) {}

  @Get("repositories")
  async repositories(@Query() { text, hub }: IParamText) {
    return await this.rxjsService.searchRepositories(text, hub);
  }

  @Get("both")
  async searchBoth(@Query('text') text: string) {
    return await this.rxjsService.searchBoth(text);
  }

  @Get("sequential")
  async sequentialSearch(@Query('text') text: string) {
    return await firstValueFrom(this.rxjsService.searchSequential(text));
  }

  @Get("github")
  async githubOnly(@Query('text') text: string) {
    return await this.rxjsService.searchRepositories(text, 'github');
  }

  @Get("gitlab")
  async gitlabOnly(@Query('text') text: string) {
    return await this.rxjsService.searchRepositories(text, 'gitlab');
  }
}