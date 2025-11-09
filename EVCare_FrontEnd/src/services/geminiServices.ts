// export async function callGemini(data: string, prompt: string, retries: number, delay: number) {
//   const key = import.meta.env.VITE_GEMINI_KEY;
//   const url = import.meta.env.VITE_GEMINI_URL + key;

//   const systemInstruction = {
//     parts: [{ text: prompt }],
//   };

//   const payload = {
//     contents: [
//       {
//         parts: [
//           {
//             text: data,
//           },
//         ],
//       },
//     ],
//     systemInstruction: systemInstruction,
//     generationConfig: {
//       responseMimeType: "application/json",
//       responseSchema: {
//         type: "OBJECT",
//         properties: {
//           description: { type: "STRING" },
//           duration: { type: "NUMBER" },
//         },
//         required: ["description", "duration"],
//       },
//     },
//   };

//   try {
//     const response = await fetch(url, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     });

//     if (!response.ok) {
//       if ((response.status === 429 || response.status === 500) && retries > 0) {
//         await new Promise((resolve) => setTimeout(resolve, delay));
//         return await callGemini(data, prompt, retries - 1, delay * 2);
//       }
//       throw new Error(`API GEMINI Error: ${response.status} ${response.statusText}`);
//     }

//     const result = await response.json();
//     const candidates = result.candidates?.[0];

//     if (candidates && candidates.content.parts[0].text) {
//       return JSON.parse(candidates.content.parts[0].text);
//     } else {
//       throw new Error("Invalid response structure from Gemini.");
//     }
//   } catch (error) {
//     console.error("Gemini call failed:", error);
//     if (retries > 0) {
//       await new Promise((resolve) => setTimeout(resolve, delay));
//       return await callGemini(data, prompt, retries - 1, delay * 2);
//     }
//     return null;
//   }
// }

// ==================
const PROXY_URL = "/api/gemini";

export async function callGemini(data: string, prompt: string, retries: number, delay: number) {
  const systemInstruction = {
    parts: [{ text: prompt }],
  };

  const payload = {
    contents: [
      {
        parts: [{ text: data }],
      },
    ],
    systemInstruction: systemInstruction,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: {
          description: { type: "STRING" },
          duration: { type: "NUMBER" },
        },
        required: ["description", "duration"],
      },
    },
  };

  try {
    const response = await fetch(PROXY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      if ((response.status === 429 || response.status === 500) && retries > 0) {
        await new Promise((resolve) => setTimeout(resolve, delay));
        return await callGemini(data, prompt, retries - 1, delay * 2);
      }
      const errorData = await response.json();
      throw new Error(`API GEMINI Error: ${response.status} ${errorData.error || response.statusText}`);
    }

    const result = await response.json();

    const candidates = result.candidates?.[0];
    if (candidates && candidates.content.parts[0].text) {
      return JSON.parse(candidates.content.parts[0].text);
    } else {
      throw new Error("Invalid response structure from Proxy.");
    }
  } catch (error) {
    console.error("Gemini call failed:", error);
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
      return await callGemini(data, prompt, retries - 1, delay * 2);
    }
    return null;
  }
}
