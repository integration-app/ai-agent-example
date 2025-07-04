import { tool } from 'ai';
import { z } from 'zod';
import { searchIndexAndSuggestApps } from './utils/search-Index-and-suggest-apps';

/**
 * Search membrane index for relevant apps related to the user query
 */
export const suggestMoreApps = tool({
  description: `When you already tried to get list of relevant apps for a user query using suggestApps but we didn't find any or they seem irrelevant, we should use this tool to do a more detailed search.
  `,
  parameters: z.object({
    query: z
      .string()
      .describe(
        `The query that was used to get the list of relevant apps, we should use this query to get more relevant apps`,
      ),
  }),
  execute: async ({ query }) => {
    const result = await searchIndexAndSuggestApps({
      query,
      index: 'membrane',
    });

    return result;
  },
});
