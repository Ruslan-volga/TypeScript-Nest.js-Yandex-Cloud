export interface Book {
  id: string;
  title: string;
  description: string;
  authors: string;
  favorite: boolean;
  fileCover?: string;  // Необязательное поле
  fileName?: string;   // Необязательное поле
  fileBook?: string;   // Необязательное поле
}