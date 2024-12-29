import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

export const checkAuthToken = (
  req: NextApiRequest, 
  res: NextApiResponse
) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization token is required' });
  }

  const token = authHeader.split(' ')[1]; // Extract token from 'Bearer <token>'

  if (!token) {
    return res.status(401).json({ error: 'Bearer token is missing' });
  }

  if (!jwt.verify(token, process.env.JWT_SECRET as string)) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};
