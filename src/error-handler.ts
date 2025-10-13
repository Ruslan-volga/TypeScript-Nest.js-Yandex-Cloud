export function handleError(error: any): never {
  console.error('❌ Application error:', error);
  throw error;
}