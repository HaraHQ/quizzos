import supabase from "@/lib/supabase";
import type { NextApiRequest, NextApiResponse } from "next";
import { Quiz } from "./admin/quiz/[share_id]";
import { checkAuthToken } from "@/lib/checkAuthToken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Quiz | { error: string }>
) {
  checkAuthToken(req, res);
  
  const { share_id } = req.query;

  if (req.method === "GET") {
    if (!share_id || typeof share_id !== "string") {
      return res.status(400).json({ error: "Invalid or missing share_id" });
    }

    try {
      // Retrieve the quiz data by share_id
      const { data, error } = await supabase
        .from("quizzes")
        .select("*")
        .eq("share_id", share_id)
        .single(); // We expect a single result

      if (error) {
        console.error("Error fetching quiz:", error);
        return res.status(500).json({ error: "Error fetching quiz" });
      }

      // Return the quiz data
      return res.status(200).json(data);
    } catch (err) {
      console.error("Unexpected error:", err);
      return res.status(500).json({ error: "Unexpected error occurred" });
    }
  }

  // Handle unsupported methods (e.g., POST, PUT)
  return res.status(405).json({ error: "Method Not Allowed" });
}
