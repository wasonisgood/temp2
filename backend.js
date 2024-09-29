const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());

app.post('/detect', async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'No text provided' });
  }


  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: "你是一個詐騙檢測助手。請判斷以下訊息是否為詐騙訊息。只回覆 'pass' 或詳細說明原因。",
          },
          { role: 'user', content: `訊息: ${text}\n回覆:` },
        ],
        max_tokens: 100,
        temperature: 0,
      },
      {
        headers: {
          Authorization: `Bearer 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`, // 這裡是固定的 API 密鑰
        },
      }
    );
    res.json({ result: response.data.choices[0].message.content.trim() });
  } catch (error) {
    res.status(500).json({ error: 'API 檢測失敗' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
