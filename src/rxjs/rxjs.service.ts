import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { HttpService } from '@nestjs/axios';
import {
  firstValueFrom,
  toArray,
  map,
  mergeAll,
  take,
  Observable,
  catchError,
  of,
  switchMap,
  forkJoin,
} from "rxjs";
import { 
  GitHubRepository, 
  GitLabProject, 
  CombinedSearchResult 
} from "./interfaces/text-param";

@Injectable()
export class RxjsService {
  private readonly githubURL = "https://api.github.com/search/repositories?q=";
  private readonly gitlabURL = "https://gitlab.com/api/v4/projects?search=";
  
  // Выносим магические числа в константы
  private readonly DEFAULT_RESULTS_COUNT = 10;
  private readonly COMBINED_SEARCH_RESULTS_COUNT = 5;

  constructor(private readonly httpService: HttpService) {}

  // Задание 1: GitHub API с использованием RxJS
  private getGithub(text: string, count: number): Observable<GitHubRepository> {
    return this.httpService.get<any>(`${this.githubURL}${text}`)
      .pipe(
        map((response) => response.data.items),
        mergeAll(),
        take(count),
        map((item: any) => ({
          id: item.id,
          name: item.name,
          full_name: item.full_name,
          html_url: item.html_url,
          description: item.description,
          stargazers_count: item.stargazers_count,
          language: item.language
        })),
        catchError(error => {
          console.error('GitHub API Error:', error.message);
          throw new HttpException(
            'Failed to fetch from GitHub API', 
            HttpStatus.BAD_GATEWAY
          );
        })
      );
  }

  // Задание 2: GitLab API с использованием RxJS
  private getGitlab(text: string, count: number): Observable<GitLabProject> {
    return this.httpService.get<any>(`${this.gitlabURL}${text}&per_page=${count}`)
      .pipe(
        map((response) => response.data),
        mergeAll(),
        take(count),
        map((project: any) => ({
          id: project.id,
          name: project.name,
          description: project.description,
          web_url: project.web_url,
          star_count: project.star_count,
          forks_count: project.forks_count,
          namespace: {
            name: project.namespace?.name || 'Unknown'
          }
        })),
        catchError(error => {
          console.error('GitLab API Error:', error.message);
          throw new HttpException(
            'Failed to fetch from GitLab API', 
            HttpStatus.BAD_GATEWAY
          );
        })
      );
  }

  // Обновленный метод для поиска репозиториев с явной проверкой hub
  async searchRepositories(text: string, hub: string): Promise<any> {
    console.log("Searching for:", text, "on hub:", hub);

    if (!text) {
      throw new HttpException('Search text is required', HttpStatus.BAD_REQUEST);
    }

    // Явная проверка допустимых значений hub
    if (hub === 'gitlab') {
      const data$ = this.getGitlab(text, this.DEFAULT_RESULTS_COUNT).pipe(toArray());
      return await firstValueFrom(data$);
    } else if (hub === 'github') {
      const data$ = this.getGithub(text, this.DEFAULT_RESULTS_COUNT).pipe(toArray());
      return await firstValueFrom(data$);
    } else {
      throw new HttpException(
        'Invalid hub parameter. Use "github" or "gitlab"', 
        HttpStatus.BAD_REQUEST
      );
    }
  }

  // Исправленный метод: поиск в обоих API одновременно с использованием forkJoin (RxJS аналог Promise.all)
  searchBoth(text: string): Observable<CombinedSearchResult> {
    if (!text) {
      throw new HttpException('Search text is required', HttpStatus.BAD_REQUEST);
    }

    const github$ = this.getGithub(text, this.COMBINED_SEARCH_RESULTS_COUNT).pipe(toArray());
    const gitlab$ = this.getGitlab(text, this.COMBINED_SEARCH_RESULTS_COUNT).pipe(toArray());

    // Используем forkJoin - RxJS аналог Promise.all
    return forkJoin({
      github: github$,
      gitlab: gitlab$
    }).pipe(
      catchError(error => {
        console.error('Combined search error:', error);
        throw new HttpException(
          'Failed to search both APIs', 
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      })
    );
  }

  // Метод с использованием switchMap для последовательных запросов
  searchSequential(text: string): Observable<CombinedSearchResult> {
    if (!text) {
      throw new HttpException('Search text is required', HttpStatus.BAD_REQUEST);
    }

    return this.getGithub(text, this.COMBINED_SEARCH_RESULTS_COUNT).pipe(
      toArray(),
      switchMap(githubResults => 
        this.getGitlab(text, this.COMBINED_SEARCH_RESULTS_COUNT).pipe(
          toArray(),
          map(gitlabResults => ({
            github: githubResults,
            gitlab: gitlabResults
          }))
        )
      ),
      catchError(error => {
        console.error('Sequential search error:', error);
        throw new HttpException(
          'Sequential search failed', 
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      })
    );
  }

  // Дополнительный метод: используем combineLatest для реального времени
  searchRealtime(text: string): Observable<CombinedSearchResult> {
    if (!text) {
      throw new HttpException('Search text is required', HttpStatus.BAD_REQUEST);
    }

    const github$ = this.getGithub(text, this.COMBINED_SEARCH_RESULTS_COUNT).pipe(toArray());
    const gitlab$ = this.getGitlab(text, this.COMBINED_SEARCH_RESULTS_COUNT).pipe(toArray());

    // combineLatest испускает значения когда любой из потоков обновится
    return forkJoin({
      github: github$,
      gitlab: gitlab$
    });
  }
}