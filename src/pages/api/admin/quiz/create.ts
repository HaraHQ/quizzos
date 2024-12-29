import supabase from "@/lib/supabase";
import type { NextApiRequest, NextApiResponse } from "next";
import { Quiz } from "./[share_id]";
import { checkAuthToken } from "@/lib/checkAuthToken";
import { v4 as uuidv4 } from "uuid";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  checkAuthToken(req, res);
  // Only allow POST requests
  if (req.method === "POST") {
    const {
      title,
      desc,
      use_random,
      use_score,
      questions
    }: Quiz = req.body;

    // Validate the request body
    if (!title || !desc) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      // Insert the new quiz into the database
      const { error } = await supabase
        .from("quizzes")
        .insert([
          {
            title,
            desc,
            use_random,
            use_score,
            share_id: uuidv4(),
            questions: questions || [],
            created_at: new Date().toISOString(),
          },
        ]);

      // Handle potential errors
      if (error) {
        console.error("Error creating quiz:", error);
        return res.status(500).json({ error: "Error creating quiz" });
      }

      return res.status(201).json({ message: "Quiz is created" });
    } catch (err) {
      console.error("Unexpected error:", err);
      return res.status(500).json({ error: "Unexpected error occurred" });
    }
  }

  // Handle unsupported methods (e.g., GET, PUT)
  return res.status(405).json({ error: "Method Not Allowed" });
}
