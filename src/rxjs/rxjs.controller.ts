import { Controller, Get, Query } from "@nestjs/common";
import { RxjsService } from "./rxjs.service";
import { IParamText } from "./interfaces/text-param";
import { firstValueFrom, Observable } from "rxjs";
import { CombinedSearchResult } from "./interfaces/text-param";

@Controller("rxjs")
export class RxjsController {
  constructor(private rxjsService: RxjsService) {}

  @Get("repositories")
  async repositories(@Query() { text, hub }: IParamText) {
    return await this.rxjsService.searchRepositories(text, hub);
  }

  @Get("both")
  searchBoth(@Query('text') text: string): Observable<CombinedSearchResult> {
    return this.rxjsService.searchBoth(text);
  }

  @Get("sequential")
  sequentialSearch(@Query('text') text: string): Observable<CombinedSearchResult> {
    return this.rxjsService.searchSequential(text);
  }

  @Get("realtime")
  realtimeSearch(@Query('text') text: string): Observable<CombinedSearchResult> {
    return this.rxjsService.searchRealtime(text);
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