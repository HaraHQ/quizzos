import supabase from "@/lib/supabase";
import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";

type Data = {
  message?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    try {
      const { username, password, confirm_password } = req.body;

      // Validate the input
      if (!username || !password || !confirm_password) {
        return res.status(400).json({ error: "Please provide username, password, and confirm password" });
      }

      // Check if the password and confirm password match
      if (password !== confirm_password) {
        return res.status(400).json({ error: "Passwords do not match" });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Check if the user already exists
      const { data: existingUser, error: userError } = await supabase
        .from('users')
        .select('username')
        .eq('username', username)
        .maybeSingle();

      if (userError) {
        return res.status(500).json({ error: "Error checking existing users", message: userError.message });
      }

      if (existingUser) {
        return res.status(400).json({ error: "Username already exists" });
      }

      // Insert the new user into the database
      const { error } = await supabase
        .from('users')
        .insert([{ username, password: hashedPassword }])
        .maybeSingle();

      if (error) {
        return res.status(500).json({ error: "Error creating user", message: error.message });
      }

      return res.status(201).json({ message: "User created successfully" });
    
    } catch (error) {
      console.error("Error during registration:", error);
      return res.status(500).json({ error: "Error during registration" });
    }
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}
