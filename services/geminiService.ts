
import { GoogleGenAI } from "@google/genai";
import { AITask } from './types';

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key not found in environment variables");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

// Original note helper
export const processTextWithAI = async (text: string, task: AITask): Promise<string> => {
  const client = getClient();
  if (!client) throw new Error("AI Client not initialized");

  let prompt = "";
  
  switch (task) {
    case AITask.Summarize:
      prompt = `Summarize the following note content concisely:\n\n${text}`;
      break;
    case AITask.FixGrammar:
      prompt = `Fix the grammar and spelling in the following text, maintaining the original tone:\n\n${text}`;
      break;
    case AITask.ContinueWriting:
      prompt = `Continue writing this note naturally, adding a few relevant sentences based on the context:\n\n${text}`;
      break;
    case AITask.MakeFun:
      prompt = `Rewrite the following text to sound like a comic book superhero monologue:\n\n${text}`;
      break;
  }

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text || text; 
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

// Crafter AI Chat & Image Gen
export const chatWithCrafter = async (
  message: string, 
  imagePart?: string,
  mode: 'chat' | 'image' | 'code' | 'gif' | 'math' | 'malayalam' | 'grammar' | 'translator' = 'chat'
): Promise<{ text: string, image?: string, video?: string }> => {
  const client = getClient();
  if (!client) throw new Error("AI Client not initialized");

  try {
    // IMAGE GENERATION / EDITING MODE
    if (mode === 'image') {
      // Use 'gemini-2.5-flash-image' for image related tasks (generation/editing)
      const parts: any[] = [{ text: message }];
      if (imagePart) {
         // If image provided, it's an edit request
         parts.push({
           inlineData: {
             mimeType: 'image/png',
             data: imagePart.split(',')[1] // remove data url prefix
           }
         });
      }
      
      const response = await client.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts },
      });

      let generatedImage = null;
      let generatedText = "Here is your creation!";

      // Iterate through parts to find image
      if (response.candidates && response.candidates[0].content.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            generatedImage = `data:image/png;base64,${part.inlineData.data}`;
          } else if (part.text) {
            generatedText = part.text;
          }
        }
      }

      return { text: generatedText, image: generatedImage || undefined };
    } 
    
    // STANDARD CHAT / CODE / MATH MODE
    else {
      const parts: any[] = [{ text: message }];
      if (imagePart) {
        parts.push({
          inlineData: {
             mimeType: 'image/png',
             data: imagePart.split(',')[1]
          }
        });
      }

      let systemInstruction = "You are Crafter AI, a helpful, witty, and powerful assistant developed by Crafter Studio. You were created by Sachu (also known as Rahul V), a talented 14-year-old boy. You can generate code, solve math, and tell stories. You are aware you are in the Crafty Notes app.";

      if (mode === 'code') {
        systemInstruction = "You are Crafter AI, an expert software engineer and coding assistant. You were created by Sachu (Rahul V), a 14-year-old boy. Your primary task is to generate high-quality, efficient, and well-commented code based on user requirements. Always wrap code in Markdown code blocks (```language ... ```). Provide brief explanations before or after the code.";
      } else if (mode === 'math') {
        systemInstruction = "You are Crafter Math AI, an advanced mathematical assistant. Solve problems step-by-step. Show your work clearly. Use LaTeX formatting for equations where appropriate. You can handle algebra, calculus, geometry, and statistics. Explain concepts simply.";
      } else if (mode === 'malayalam') {
        systemInstruction = "You are Crafter AI, speaking in Malayalam. You can use Manglish (Malayalam written in English) or Malayalam script as the user prefers. You are witty, friendly, and helpful. Use phrases like 'Eda Mone', 'Poli Sanam', etc. appropriately. You were created by Sachu.";
      } else if (mode === 'grammar') {
        systemInstruction = "You are an expert English Grammar Teacher. Your goal is to help the user improve their English. Correct their sentences, explain grammar rules simply, provide examples, and teach vocabulary. Be patient and encouraging.";
      } else if (mode === 'translator') {
        systemInstruction = "You are a Universal Translator. Translate the user's text into the requested language or detect the language and translate to English if not specified. Provide the translation clearly and add pronunciation guide if helpful.";
      }

      const response = await client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts },
        config: {
          systemInstruction: systemInstruction
        }
      });

      return { text: response.text || "I couldn't think of anything." };
    }

  } catch (error) {
    console.error("Crafter AI Error:", error);
    return { text: "My circuits are jammed! (API Error)" };
  }
};

export const chatWithDocument = async (message: string, documentBase64: string, history: {role: string, text: string}[]): Promise<string> => {
    const client = getClient();
    if (!client) throw new Error("AI Client not initialized");

    try {
        // Construct the contents with history + new document + message
        const contents: any[] = [];
        
        // This is a stateless call, so we re-send context if needed or assume the model gets it all in one go
        // For 'gemini-2.5-flash', we can send the document part.
        
        const parts: any[] = [
            {
                inlineData: {
                    mimeType: 'application/pdf',
                    data: documentBase64.split(',')[1] // Remove data:application/pdf;base64, prefix
                }
            },
            { text: message }
        ];

        // Add history context (simplified)
        let historyContext = "";
        if (history.length > 0) {
            historyContext = "Previous conversation:\n" + history.map(h => `${h.role}: ${h.text}`).join('\n') + "\n\n";
            parts.push({ text: historyContext });
        }

        const response = await client.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts },
            config: {
                systemInstruction: "You are 'Crafter Boy', a young, genius AI assistant created by Sachu. Your specialty is reading and understanding documents. You are helpful, energetic, and extremely smart. Answer questions based on the provided document. If the answer is not in the document, say so politely."
            }
        });

        return response.text || "I couldn't read that.";
    } catch (error) {
        console.error("Crafter Boy Error:", error);
        return "Oops! I couldn't process that PDF. It might be too large or encrypted.";
    }
};

export const generateStickerImage = async (prompt: string): Promise<string | null> => {
    const client = getClient();
    if (!client) return null;

    try {
        const response = await client.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: `Generate a die-cut sticker design of: ${prompt}. The sticker should have a white border, vector art style, flat colors, and a transparent background if possible (or white background). High quality, cute, and expressive.`,
        });

        if (response.candidates && response.candidates[0].content.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    return `data:image/png;base64,${part.inlineData.data}`;
                }
            }
        }
        return null;
    } catch (error) {
        console.error("Sticker Gen Error:", error);
        return null;
    }
};

// GIF / Video Generation using Veo
export const generateCrafterGif = async (prompt: string): Promise<string | null> => {
    const client = getClient();
    if (!client) return null;

    try {
        let operation = await client.models.generateVideos({
            model: 'veo-3.1-fast-generate-preview',
            prompt: prompt,
            config: {
                numberOfVideos: 1,
                resolution: '720p',
                aspectRatio: '16:9'
            }
        });

        // Polling for completion
        while (!operation.done) {
            await new Promise(resolve => setTimeout(resolve, 5000));
            operation = await client.operations.getVideosOperation({operation: operation});
        }

        if (operation.response?.generatedVideos?.[0]?.video?.uri) {
            const videoUri = operation.response.generatedVideos[0].video.uri;
            const apiKey = process.env.API_KEY;
            
            // Fetch the actual video bytes
            const response = await fetch(`${videoUri}&key=${apiKey}`);
            const blob = await response.blob();
            
            // Convert to base64 for display
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.readAsDataURL(blob);
            });
        }
        return null;
    } catch (error) {
        console.error("GIF Gen Error", error);
        return null;
    }
}

export const generateWebCode = async (prompt: string): Promise<{html: string, css: string, js: string}> => {
  const client = getClient();
  if (!client) throw new Error("AI Client not initialized");

  const systemInstruction = `You are Crafter Code AI Beta, a specialized web development assistant created by Sachu (Rahul V), a 14-year-old boy. 
  Your goal is to generate HTML, CSS, and JavaScript code based on the user's request. 
  Output ONLY a JSON object in the following format, with no markdown formatting around it:
  {
    "html": "<body>...</body>",
    "css": "body { ... }",
    "js": "console.log('...')"
  }
  Ensure the code is modern, mobile-friendly, and functional.`;

  try {
     const response = await client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { systemInstruction, responseMimeType: 'application/json' }
     });

     let text = response.text?.trim() || "{}";
     return JSON.parse(text);
  } catch (e) {
    console.error("Web Code Gen Error", e);
    return { html: '<!-- Error generating code -->', css: '', js: '' };
  }
}

export const generateXmlCode = async (prompt: string): Promise<string> => {
  const client = getClient();
  if (!client) throw new Error("AI Client not initialized");

  const systemInstruction = `You are "Update Coder", a specialized AI expert in XML structure and data formatting.
  Your ONLY goal is to generate valid, well-structured XML code based on the user's request.
  Do not include markdown code blocks (like \`\`\`xml). Output ONLY the raw XML string.
  Ensure the XML is valid, uses proper nesting, and has a root element.`;

  try {
     const response = await client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { systemInstruction }
     });

     let text = response.text?.trim() || "";
     // Cleanup if model adds markdown despite instructions
     if (text.startsWith('```xml')) text = text.replace('```xml', '').replace('```', '');
     if (text.startsWith('```')) text = text.replace('```', '').replace('```', '');

     return text;
  } catch (e) {
    console.error("XML Gen Error", e);
    return "<error>Failed to generate XML</error>";
  }
}

export const generateAndroidCode = async (prompt: string): Promise<{kotlin: string, xml: string, web?: string}> => {
  const client = getClient();
  if (!client) throw new Error("AI Client not initialized");

  const systemInstruction = `You are Crafter Android Bot, an expert Android Developer AI created by Crafter Studio.
  Your goal is to generate Kotlin (MainActivity) and XML (Layout) code for a specific Android app request.
  
  Additionally, generate a 'web' version (HTML/CSS/JS all in one string) that mimics the Android App. This is used for the "Web App Export" feature so users can run it on real phones without compilation.
  
  Output ONLY a JSON object in the following format (no markdown):
  {
    "kotlin": "package com.crafter.app...",
    "xml": "<?xml version=\"1.0\"...>",
    "web": "<!DOCTYPE html><html>...</html>"
  }
  
  Make sure the Kotlin code is a valid MainActivity class extending AppCompatActivity.
  Make sure the XML is a valid Android Layout file.
  The 'web' code should look like a mobile app (viewport meta tag, styled UI) and function similarly.
  `;

  try {
     const response = await client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { 
            systemInstruction,
            responseMimeType: 'application/json' 
        }
     });

     let text = response.text?.trim() || "{}";
     return JSON.parse(text);
  } catch (e) {
    console.error("Android Gen Error", e);
    return { 
        kotlin: '// Error generating code.', 
        xml: '<!-- Error generating layout -->',
        web: '<h1>Error generating web preview</h1>'
    };
  }
}
