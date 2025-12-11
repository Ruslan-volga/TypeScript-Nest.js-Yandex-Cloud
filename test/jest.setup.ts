// Добавляем глобальные типы для Jest
import '@types/jest';

// Или создаем простую типизацию если не установлены @types/jest
declare global {
  const jest: any;
  const describe: any;
  const it: any;
  const expect: any;
  const beforeEach: any;
  const afterEach: any;
  const beforeAll: any;
  const afterAll: any;
}