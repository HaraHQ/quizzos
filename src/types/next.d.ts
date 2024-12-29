// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { NextApiRequest } from 'next';

declare module 'next' {
  interface NextApiRequest {
    user?: {
      username: string;
      id: number;
    }; // This will hold the decoded JWT data (you can replace `any` with a more specific type if needed)
  }
}