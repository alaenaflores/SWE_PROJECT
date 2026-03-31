console.log("Loaded API key:", process.env.GEMINI_API_KEY ? "YES" : "NO");
const calculateNutrition = async (params) => {
  const { height, weight, age, gender, activityLevel, goal } = params;

  const prompt = `
You are a nutritionist. Calculate daily nutritional goals based on these metrics:
- Age: ${age}
- Gender: ${gender}
- Height: ${height} cm
- Weight: ${weight} lbs
- Activity Level: ${activityLevel}
- Goal: ${goal}

Return ONLY a JSON object with this exact structure. Do not claim to be a certified nutritionist and include a statement that the advice is an estimate based on the provided information:
{"calories": number, "protein_g": number, "carbs_g": number, "fats_g": number, "advice": "string"}
`;

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is not defined");

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    if (!res.ok) {
        const errorData = await res.text();
        console.error("GEMINI RAW ERROR:", errorData);
        throw new Error(`Gemini API responded with status ${res.status}`);
    }

    const data = await res.json();

    const parts = data?.candidates?.[0]?.content?.parts || [];
    let rawText = parts.map(p => p.text || "").join("\n").trim();

    if (!rawText) {
      throw new Error("Gemini returned no text content");
    }

    rawText = rawText.replace(/```json|```/g, "").trim();

    const startIdx = rawText.indexOf("{");
    const endIdx = rawText.lastIndexOf("}");

    if (startIdx === -1 || endIdx === -1) {
      console.error("Raw text received:", rawText);
      throw new Error("Gemini response did not contain valid JSON");
    }

    const cleanedJson = rawText.substring(startIdx, endIdx + 1);

    return JSON.parse(cleanedJson);

  } catch (err) {
    console.error("Detailed Gemini Utility Error:", err.message);

    return {
      calories: 2000,
      protein_g: 150,
      carbs_g: 220,
      fats_g: 70,
      advice: "We're currently using standard nutritional estimates while our AI assistant is unavailable."
    };
  }
};

module.exports = { calculateNutrition };