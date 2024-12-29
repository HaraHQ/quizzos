import supabase from "@/lib/supabase";
import type { NextApiRequest, NextApiResponse } from "next";
import { Quiz } from "../[share_id]";
import { checkAuthToken } from "@/lib/checkAuthToken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  checkAuthToken(req, res);
  // Only allow PUT requests for updating
  if (req.method === "PUT") {
    const { share_id } = req.query;
    const {
      title,
      desc,
      use_random,
      use_score,
      questions,
    }: Quiz = req.body;

    if (!share_id || typeof share_id !== "string") {
      return res.status(400).json({ error: "Invalid or missing share_id" });
    }

    // Prepare the update object
    const updateData: Quiz = {
      desc: "",
      title: "",
      use_random: false,
      use_score: false,
      questions: [],
    };

    if (title !== undefined) updateData.title = title;
    if (desc !== undefined) updateData.desc = desc;
    if (use_random !== undefined) updateData.use_random = use_random;
    if (use_score !== undefined) updateData.use_score = use_score;
    if (questions !== undefined) updateData.questions = questions;

    try {
      // Update the quiz in the database by the share_id
      const { error } = await supabase
        .from("quizzes")
        .update(updateData)
        .eq("share_id", share_id)
        .single(); // `.single()` returns a single object, not an array

      // Handle potential errors from Supabase
      if (error) {
        console.error("Error updating quiz:", error);
        return res.status(500).json({ error: "Error updating quiz" });
      }

      return res.status(200).json({ message: "Quiz is updated" });
    } catch (err) {
      console.error("Unexpected error:", err);
      return res.status(500).json({ error: "Unexpected error occurred" });
    }
  }

  // Handle unsupported methods (e.g., POST, GET)
  return res.status(405).json({ error: "Method Not Allowed" });
}
