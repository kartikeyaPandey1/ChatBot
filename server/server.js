import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Chatbot API is running');
});

app.post('/api/chat', async (req, res) => {
  try {
    const { prompt } = req.body;
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [{ role: "user", content: prompt }]
      })
    });
    const data = await response.json();
    res.json({ bot: data.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI service error" });
  }
});

// 404 Handler
app.use((req, res) => {
  res.status(404).send("Route not found");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});