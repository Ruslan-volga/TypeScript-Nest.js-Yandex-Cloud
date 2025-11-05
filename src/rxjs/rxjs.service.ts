import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { HttpService } from '@nestjs/axios';
import {
  firstValueFrom,
  toArray,
  from,
  map,
  mergeAll,
  take,
  Observable,
  catchError,
  of,
  switchMap,
} from "rxjs";
import { GitHubRepository, GitLabProject, GitHubApiResponse } from "./interfaces/text-param";

@Injectable()
export class RxjsService {
  private readonly githubURL = "https://api.github.com/search/repositories?q=";
  private readonly gitlabURL = "https://gitlab.com/api/v4/projects?search=";

  constructor(private readonly httpService: HttpService) {}

  // Задание 1: GitHub API с использованием RxJS
  private getGithub(text: string, count: number): Observable<GitHubRepository> {
    return this.httpService.get<GitHubApiResponse>(`${this.githubURL}${text}`)
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
    return this.httpService.get<GitLabProject[]>(`${this.gitlabURL}${text}&per_page=${count}`)
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

  // Обновленный метод для поиска репозиториев
  async searchRepositories(text: string, hub: string): Promise<any> {
    console.log("Searching for:", text, "on hub:", hub);

    if (!text) {
      throw new HttpException('Search text is required', HttpStatus.BAD_REQUEST);
    }

    try {
      if (hub === 'gitlab') {
        // Запрос к GitLab API
        const data$ = this.getGitlab(text, 10).pipe(toArray());
        return await firstValueFrom(data$);
      } else {
        // По умолчанию GitHub API
        const data$ = this.getGithub(text, 10).pipe(toArray());
        return await firstValueFrom(data$);
      }
    } catch (error) {
      throw new HttpException(
        `Failed to search repositories: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Дополнительный метод: поиск в обоих API одновременно
  async searchBoth(text: string): Promise<{ github: GitHubRepository[], gitlab: GitLabProject[] }> {
    if (!text) {
      throw new HttpException('Search text is required', HttpStatus.BAD_REQUEST);
    }

    try {
      const github$ = this.getGithub(text, 5).pipe(toArray());
      const gitlab$ = this.getGitlab(text, 5).pipe(toArray());

      const [githubResults, gitlabResults] = await Promise.all([
        firstValueFrom(github$),
        firstValueFrom(gitlab$)
      ]);

      return {
        github: githubResults,
        gitlab: gitlabResults
      };
    } catch (error) {
      throw new HttpException(
        `Failed to search both APIs: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Метод с использованием switchMap для последовательных запросов
  searchSequential(text: string): Observable<any> {
    return this.getGithub(text, 3).pipe(
      toArray(),
      switchMap(githubResults => 
        this.getGitlab(text, 3).pipe(
          toArray(),
          map(gitlabResults => ({
            github: githubResults,
            gitlab: gitlabResults,
            sequential: true
          }))
        )
      ),
      catchError(error => {
        console.error('Sequential search error:', error);
        return of({ error: error.message });
      })
    );
  }
}