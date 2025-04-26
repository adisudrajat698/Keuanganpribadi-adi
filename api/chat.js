export default async function handler(req, res) {
  const input = req.body.input;

  const prompt = `Kamu adalah CADASBot, chatbot keuangan pribadi yang sopan dan pintar. Jawab pertanyaan berikut dengan jelas dan relevan.\n\nUser: ${input}\nCADASBot:`;

  try {
    const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HF_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_length: 100,
          temperature: 0.7,
          top_p: 0.9,
          do_sample: true
        }
      })
    });

    const data = await response.json();

    let result = "Maaf, aku belum bisa menjawab.";
    
    if (Array.isArray(data) && data[0]?.generated_text) {
      result = data[0].generated_text.replace(prompt, "").trim();
    } else if (typeof data === 'object' && data.generated_text) {
      result = data.generated_text.replace(prompt, "").trim();
    } else if (typeof data === 'string') {
      result = data;
    } else if (data.error) {
      result = `❌ Error dari AI: ${data.error}`;
    }

    // Kalau jawaban kosong atau aneh
    if (!result || result.length < 5) {
      result = "Maaf, aku kurang paham. Bisa ulangi?";
    }

    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ result: `❌ Terjadi kesalahan: ${error.message}` });
  }
}
