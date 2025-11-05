export interface IParamText {
  text: string;
  hub: string;
}

export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string;
  stargazers_count: number;
  language: string;
}

export interface GitLabProject {
  id: number;
  name: string;
  description: string;
  web_url: string;
  star_count: number;
  forks_count: number;
  namespace: {
    name: string;
  };
}

export interface GitHubApiResponse {
  total_count: number;
  items: GitHubRepository[];
}