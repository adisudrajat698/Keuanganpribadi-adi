export default async function handler(req, res) {
  const input = req.body.input;

  const response = await fetch('https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.HF_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ inputs: input })
  });

  const data = await response.json();
  const result = Array.isArray(data) ? data[0].generated_text : data.generated_text || "Maaf, belum bisa jawab 😅";

  res.status(200).json({ result });
}
