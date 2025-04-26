export default async function handler(req, res) {
  const userInput = req.body.input;

  const prompt = `
Kamu adalah chatbot santai bernama CADASBot 🤖. 
Tugasmu adalah menjawab pertanyaan user dengan gaya santai, kadang bercanda sedikit, tapi tetap sopan dan to the point.
Kalau ada pertanyaan aneh, jawab aja dengan lucu tapi jangan ngaco.
Jawaban maksimal 3 kalimat.

Pertanyaan: ${userInput}
Jawaban:
`;

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
      result = data[0].generated_text.split('Jawaban:')[1]?.trim() || result;
    } else if (typeof data === 'object' && data.generated_text) {
      result = data.generated_text.split('Jawaban:')[1]?.trim() || result;
    } else if (typeof data === 'string') {
      result = data;
    } else if (data.error) {
      result = `❌ Error dari AI: ${data.error}`;
    }

    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ result: `❌ Terjadi kesalahan: ${error.message}` });
  }
}
