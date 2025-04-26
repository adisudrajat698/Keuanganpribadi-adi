export default async function handler(req, res) {
  const input = req.body.input;

  try {
    const response = await fetch('https://api-inference.huggingface.co/models/google/flan-t5-small', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HF_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: input,
        parameters: {
          max_new_tokens: 100,
          temperature: 0.7
        }
      })
    });

    const data = await response.json();

    let result = "Maaf, belum bisa jawab 😅";

    if (Array.isArray(data) && data[0]?.generated_text) {
      result = data[0].generated_text;
    } else if (typeof data === 'object' && data.generated_text) {
      result = data.generated_text;
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
