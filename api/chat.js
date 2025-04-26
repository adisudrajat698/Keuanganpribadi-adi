export default async function handler(req, res) {
  const userInput = req.body.input;

  // Tambahin template biar AI diarahkan
  const prompt = `Kamu adalah asisten keuangan pribadi. Jawab pertanyaan ini dengan singkat, jelas, dan profesional:\n\n${userInput}`;

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
          max_new_tokens: 150, // Sedikit tambah biar cukup jawab
          temperature: 0.4      // Lebih fokus
        }
      })
    });

    const data = await response.json();

    let result = "Maaf, belum bisa jawab 😅";

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
