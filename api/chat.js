// api/chat.js

let chatHistory = [];

export default async function handler(req, res) {
  const userInput = req.body.input;

  // Batas jumlah history biar gak terlalu panjang
  if (chatHistory.length > 10) {
    chatHistory.shift();
  }

  // Tambahkan input user ke history
  chatHistory.push(`User: ${userInput}`);

  // Gabungkan history untuk dijadikan prompt
  const prompt = `Kamu adalah chatbot yang santai, suka bercanda dikit, tapi tetap sopan. Jawab dengan gaya ringan.\n\n${chatHistory.join("\n")}\nBot:`;

  try {
    const response = await fetch('https://api-inference.huggingface.co/models/google/flan-t5-small', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HF_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 150,
          temperature: 0.3
        }
      })
    });

    const data = await response.json();

    let result = "Maaf, aku lagi bengong 🤣";

    if (Array.isArray(data) && data[0]?.generated_text) {
      result = data[0].generated_text.replace(/.*Bot:/s, '').trim();
    } else if (typeof data === 'object' && data.generated_text) {
      result = data.generated_text.replace(/.*Bot:/s, '').trim();
    } else if (typeof data === 'string') {
      result = data;
    } else if (data.error) {
      result = `❌ Error dari AI: ${data.error}`;
    }

    // Tambahkan respon bot ke history
    chatHistory.push(`Bot: ${result}`);

    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ result: `❌ Terjadi kesalahan: ${error.message}` });
  }
}
