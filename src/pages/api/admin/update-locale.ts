import { checkAuthToken } from "@/lib/checkAuthToken";
import supabase from "@/lib/supabase";
import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

type Data = {
  message: string;
  success: boolean;
  locale?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  checkAuthToken(req, res);

  const authHeader = req.headers.authorization as string;

  const token = authHeader.split(" ")[1]; // Extract the token

  const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
    id: string;
  };

  if (req.method !== "POST") {
    return res.status(405).json({
      message: "Method not allowed. Only POST requests are accepted.",
      success: false,
    });
  }

  const { locale } = req.body;

  // Validate input
  if (!decoded.id) {
    return res.status(400).json({
      message: "Invalid or missing 'userId'.",
      success: false,
    });
  }

  if (!locale || typeof locale !== "string") {
    return res.status(400).json({
      message: "Invalid or missing 'locale'.",
      success: false,
    });
  }

  try {
    // Update the locale in the users table
    const { error } = await supabase
      .from("users")
      .update({ locale })
      .eq("id", decoded.id);

    if (error) {
      throw error;
    }

    return res.status(200).json({
      message: "Locale updated successfully.",
      success: true,
      locale
    });
  } catch (error: any) {
    console.error("Error updating locale:", error);
    return res.status(500).json({
      message: error.message || "Internal Server Error.",
      success: false,
    });
  }
}
