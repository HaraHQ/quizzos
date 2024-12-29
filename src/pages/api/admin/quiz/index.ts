import { checkAuthToken } from "@/lib/checkAuthToken";
import supabase from "@/lib/supabase";
import type { NextApiRequest, NextApiResponse } from "next";

type Quiz = {
  id: number;
  title: string;
  desc: string;
  use_random: boolean;
  use_score: boolean;
  share_id: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Quiz[] | { error: string }>
) {
  checkAuthToken(req, res);
  
  if (req.method === "GET") {
    // Query the quizzes table and exclude the 'questions' field
    const { data, error } = await supabase
      .from('quizzes')
      .select('id, title, desc, use_random, use_score, share_id') // Specify the columns you want to select
      .order('id', { ascending: true });

    if (error) {
      return res.status(500).json({ error: "Error fetching quizzes" });
    }

    // Return the list of quizzes
    return res.status(200).json(data);
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}
