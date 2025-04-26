export default async function handler(req, res) {
  const input = req.body.input;

  const response = await fetch('https://api-inference.huggingface.co/models/google/flan-t5-small', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.HF_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ inputs: input })
  });

  const data = await response.json();

  let result = "Maaf, belum bisa jawab 😅";

  if (Array.isArray(data) && data[0]?.generated_text) {
    result = data[0].generated_text;
  } else if (typeof data === 'object' && data.hasOwnProperty('generated_text')) {
    result = data.generated_text;
  } else if (typeof data === 'string') {
    result = data;
  }

  res.status(200).json({ result });
}
