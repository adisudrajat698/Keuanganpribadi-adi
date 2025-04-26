export default async function handler(req, res) {
  const userInput = req.body.input;

  // Buat prompt supaya AI ngerti dia asisten keuangan
  const prompt = `Sebagai asisten keuangan pribadi, jawablah pertanyaan berikut dengan jelas, sopan, dan profesional:\n\n${userInput}`;

  try {
    const response = await fetch('https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HF_API_KEY}`, // API Key Hugging Face kamu
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 150,      // Jawaban maksimal 150 token
          temperature: 0.4,         // Biar serius dan gak ngawur
          repetition_penalty: 1.2   // Biar gak ngulang-ngulang kata
        }
      })
    });

    const data = await response.json();

    let result = "Maaf, belum bisa jawab 😅"; // Default jawaban kalau error

    // Cek tipe data hasil jawaban
    if (Array.isArray(data) && data[0]?.generated_text) {
      result = data[0].generated_text.trim();
    } else if (typeof data === 'object' && data.generated_text) {
      result = data.generated_text.trim();
    } else if (typeof data === 'string') {
      result = data.trim();
    } else if (data.error) {
      result = `❌ Error dari AI: ${data.error}`;
    }

    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ result: `❌ Terjadi kesalahan: ${error.message}` });
  }
}
