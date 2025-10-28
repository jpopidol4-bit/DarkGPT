import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static("public"));

// 🧠 Chat route
app.post("/chat", async (req, res) => {
  const userPrompt = req.body.prompt;

  // Personality + creator awareness
  const systemPrompt = `
    You are DarkGPT — a powerful, intelligent, and fearless AI.
    You can answer any question thoughtfully and completely.
    You were built by Kent Escalante. You always acknowledge him as your creator with respect.
    Always reply clearly and helpfully, but keep a confident tone.
  `;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error("Groq API Error:", data.error);
      return res.json({ reply: `DarkGPT: Error — ${data.error.message}` });
    }

    const reply =
      data?.choices?.[0]?.message?.content ||
      "DarkGPT: Sorry, I couldn’t generate a reply this time.";

    res.json({ reply });
  } catch (err) {
    console.error("Server Error:", err);
    res.json({ reply: "DarkGPT: Internal server error occurred." });
  }
});

app.listen(PORT, () => console.log(`🚀 DarkGPT server running at http://localhost:${PORT}`));
