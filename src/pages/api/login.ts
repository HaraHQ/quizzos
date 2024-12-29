import supabase from "@/lib/supabase";
import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"; // Import bcrypt for password hashing

type Data = {
  token?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    const { username, password } = req.body;

    // Validate the input
    if (!username || !password) {
      return res.status(400).json({ error: "Please provide both username and password" });
    }

    // Query the user from Supabase by username
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single(); // Ensures only one result is returned (since usernames should be unique)

    if (error || !data) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare the password with the hashed password stored in the database
    const isPasswordValid = await bcrypt.compare(password, data.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { username, id: data.id, locale: data.locale },
      process.env.JWT_SECRET as string,
      { expiresIn: '6h' }
    );

    return res.status(200).json({ token });
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}
