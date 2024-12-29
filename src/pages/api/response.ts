import supabase from "@/lib/supabase";
import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { checkAuthToken } from "@/lib/checkAuthToken";

type Data = {
  message: string;
};

type ErrorResponse = {
  error: string;
  decode?: Record<string, string|number>;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | ErrorResponse>
) {
  checkAuthToken(req, res);
  
  if (req.method === "POST") {
    // Step 1: Check if the Authorization token is provided
    const authHeader = req.headers.authorization as string;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Authorization token is missing" });
    }

    const token = authHeader.split(" ")[1]; // Extract the token

    try {
      // Step 2: Decode the JWT to get the user_id
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
      // const user_id = decoded.id as string;

      // Step 3: Extract the body from the request
      const { quiz_id, answers } = req.body;

      if (!quiz_id || !answers) {
        return res.status(400).json({ error: "quiz_id and answers are required" });
      }

      // Step 4: Insert the response into the 'response' table
      const { error } = await supabase
        .from("responses")
        .insert([
          {
            quiz_id,
            user_id: decoded.id,
            answers,
          },
        ]);

      if (error) {
        console.error("Error inserting response:", error);
        return res.status(500).json({ error: "Error saving response" });
      }

      // Step 5: Return a success message
      return res.status(201).json({ message: "Response saved successfully" });
    } catch (err) {
      console.error("Error verifying JWT:", err);
      return res.status(401).json({ error: "Invalid or expired token" });
    }
  }

  // Handle unsupported methods (e.g., GET, PUT)
  return res.status(405).json({ error: "Method Not Allowed" });
}
