import { z } from 'zod';
import { analyzeFocusSchema } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  focus: {
    analyze: {
      method: 'POST' as const,
      path: '/api/analyze-focus',
      input: analyzeFocusSchema,
      responses: {
        200: z.object({
          isOnTrack: z.boolean(),
          relevanceScore: z.number(),
          reason: z.string(),
        }),
        500: errorSchemas.internal,
      },
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
