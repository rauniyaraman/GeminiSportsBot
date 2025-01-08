import { GoogleGenerativeAI } from "@google/generative-ai";
import { getLiveMatchesFunctionDeclaration } from "../extensions/support-utils.js";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const generativeModel = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  tools: {
    functionDeclarations: [getLiveMatchesFunctionDeclaration],
  },
});

export { generativeModel };
