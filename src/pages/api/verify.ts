import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: 'Token is required' });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET as string);
    return res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: 'Invalid token' });
  }
}