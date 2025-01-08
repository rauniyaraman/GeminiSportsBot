import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { generativeModel } from "./models/geminiModel.js";
import { questionSports } from "./extensions/support-utils.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

let chatHistory = [];

app.post("/api/query", async (req, res) => {
  const userQuery = req.body.query;

  if (!userQuery) {
    return res.status(400).json({ error: "No query provided." });
  }

  try {
    const chat = generativeModel.startChat({
      apiKey: process.env.GOOGLE_API_KEY,
      history: chatHistory.map((entry) => ({
        role: entry.role,
        parts: [entry.text], // Ensure 'parts' is an array
      })),
    });

    chatHistory.push({ role: "user", text: userQuery });

    const result = await chat.sendMessage([{ text: userQuery }]); // Ensure payload is an array
    const response = result.response;

    if (response.functionCalls) {
      const requestedFunctions = await response.functionCalls();
      const aiSelfCall = requestedFunctions[0];

      if (aiSelfCall && questionSports[aiSelfCall.name]) {
        const functionResult = await questionSports[aiSelfCall.name]();
        console.log("Function Result:", functionResult);

        if (functionResult.error) {
          chatHistory.push({
            role: "assistant",
            text: "I couldn't fetch the live matches. Please try again later.",
          });
          return res.json({
            response: "I couldn't fetch the live matches. Please try again later.",
          });
        }

        const followUp = await chat.sendMessage([
          {
            functionResponse: {
              name: aiSelfCall.name,
              response: { message: functionResult.response }, // Wrap in an object
            },
          },
        ]);

        const finalResponse = followUp.response.text();
        chatHistory.push({ role: "assistant", text: finalResponse });
        return res.json({ response: finalResponse });
      } else {
        console.error("Unsupported function call:", aiSelfCall.name);
        return res.status(400).json({ error: "Unsupported function call." });
      }
    } else {
      const modelText = response.text();
      chatHistory.push({ role: "assistant", text: modelText });
      return res.json({ response: modelText });
    }
  } catch (error) {
    console.error("Error handling query:", error.message, error.stack);
    res.status(500).json({ error: "An internal server error occurred." });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
