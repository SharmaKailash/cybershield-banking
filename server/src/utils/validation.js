import { AppError } from './errors.js';

export function parseBody(schema, body) {
  const result = schema.safeParse(body);
  if (!result.success) {
    const message = result.error.issues.map((issue) => issue.message).join('; ');
    throw new AppError(400, message);
  }
  return result.data;
}
