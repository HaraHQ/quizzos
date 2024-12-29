import { checkAuthToken } from "@/lib/checkAuthToken";
import supabase from "@/lib/supabase";
import type { NextApiRequest, NextApiResponse } from "next";

export type QuizResponse = {
  quiz: {
    title: string;
    desc: string;
    id: string;
  };
  responses: {
    user: {
      id: number;
      username: string;
    };
    answers: Record<string, string>[];
    created_at: string;
  }[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<QuizResponse | { error: string }>
) {
  checkAuthToken(req, res);

  if (req.method === "GET") {
    const { share_id } = req.query;

    if (!share_id || typeof share_id !== "string") {
      return res.status(400).json({ error: "Share ID is required" });
    }

    // Fetch the quiz details by share_id
    const { data: quizData, error: quizError } = await supabase
      .from("quizzes")
      .select("id, title, desc")
      .eq("share_id", share_id)
      .single(); // Assumes share_id is unique

    if (quizError || !quizData) {
      return res.status(500).json({ error: "Error fetching quiz" });
    }

    // Fetch responses for the quiz by quiz_id
    const { data: responseData, error: responseError } = await supabase
      .from("responses")
      .select(
        `
          id,
          answers,
          user_id,
          created_at
        `
      )
      .eq("quiz_id", share_id);

    if (responseError) {
      return res.status(500).json({ error: "Error fetching responses" });
    }

    // Map responses to include user details and answers
    const responses = await Promise.all(responseData.map(async (response) => {
      const { data: userData, error: userError } = await supabase
      .from("users")
      .select(
        `
          id,
          username
        `
      )
      .eq("id", response.user_id)
      .single();

      if (userError) {
        return res.status(500).json({ error: "Error fetching responses" });
      }

      return {
        user: {
          id: userData.id,
          username: userData.username,
        },
        answers: {
          data: response.answers,
          id: response.id,
          created_at: response.created_at,
        },
      };
    }));

    return res.status(200).json({
      quiz: {
        title: quizData.title,
        desc: quizData.desc,
        id: share_id,
      },
      responses: responses as any[],
    });
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}
