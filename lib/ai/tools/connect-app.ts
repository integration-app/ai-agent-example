import { IntegrationAppClient } from '@integration-app/sdk';
import { tool } from 'ai';
import { z } from 'zod';

export const connectApp = (token: string) =>
  tool({
    description:
      "Helps user to connect to an app when they don't have a connection to it, it renders a button to connect to the app, and sends a message called `done` when the user has connected to the app",
    parameters: z.object({
      app: z.string().describe('The key of the app to connect to'),
    }),
    execute: async ({ app }) => {
      try {
        console.log('token', token);

        const integrationAppClient = new IntegrationAppClient({
          token,
        });

        const integration = await integrationAppClient.integration(app).get();

        console.log('connectApp', integration);

        return {
          message: 'Waiting for user to connect to app',
          logoUri: integration.logoUri ?? '',
          integrationKey: integration.key,
        };
      } catch (error) {
        console.error('Failed to prepare app for connection', error);
        return {
          message: 'Failed prepare app for connection',
        };
      }
    },
  });
