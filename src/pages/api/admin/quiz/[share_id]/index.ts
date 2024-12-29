import { checkAuthToken } from "@/lib/checkAuthToken";
import supabase from "@/lib/supabase";
import type { NextApiRequest, NextApiResponse } from "next";

type Options = {
  id: string;
  isCorrect: boolean;
  text: string;
}

type Questions = {
  id: string;
  isScored: boolean;
  score: number;
  title: string;
  options: Options[];
}

export type Quiz = {
  id?: number;
  title: string;
  desc: string;
  use_random: boolean;
  use_score: boolean;
  questions: Questions[];
  share_id?: string;
  created_at?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Quiz | { error: string }>
) {
  checkAuthToken(req, res);

  if (req.method === "GET") {
    const { share_id } = req.query;  // Get the share_id from the query params

    if (!share_id || typeof share_id !== "string") {
      return res.status(400).json({ error: "Share ID is required" });
    }

    // Query the quizzes table by share_id and include the questions field
    const { data, error } = await supabase
      .from('quizzes')
      .select('*')  // Get all columns, including the 'questions' field
      .eq('share_id', share_id)
      .single();  // Assuming 'share_id' is unique, we use single to return a single quiz

    if (error) {
      return res.status(500).json({ error: "Error fetching quiz" });
    }

    // Return the quiz data
    return res.status(200).json(data);
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}
