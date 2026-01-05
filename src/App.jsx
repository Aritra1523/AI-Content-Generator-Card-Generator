import { useState } from "react";
import "./App.css";

function App() {
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateDetails = async () => {
  if (!productName || !category) {
    alert("Please fill all fields");
    return;
  }

  setLoading(true);
  setResult(null);

  const prompt = `
Generate product details in JSON only.
Product Name: ${productName}
Category: ${category}

Return ONLY valid JSON.
No markdown.
No explanation.
Format:
{
  "title": "",
  "description": "",
  "tags": []
}
`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    let text = data.candidates[0].content.parts[0].text;

    // 🔥 CLEAN THE RESPONSE
    text = text.replace(/```json/g, "");
    text = text.replace(/```/g, "");
    text = text.trim();

    const parsed = JSON.parse(text);
    setResult(parsed);
  } catch (error) {
    console.error(error);
    alert("Failed to generate product details");
  }

  setLoading(false);
};

  return (
    <div className="container">
      <h1>AI Product Card Generator</h1>

      <input
        type="text"
        placeholder="Product Name"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
      />

      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />

      <button onClick={generateDetails} disabled={loading}>
  {loading ? "Generating..." : "Generate Details"}
</button>


      {result && (
        <div className="card">
          <h2>{result.title}</h2>
          <p>{result.description}</p>

          <div className="tags">
            {result.tags.map((tag, index) => (
              <span key={index}>#{tag}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
