
import { GoogleGenAI, Type } from "@google/genai";
import { Language } from '../types';

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

const getPrompt = (language: Language): string => {
    if (language === Language.AR) {
        return `
        أنت "مدرس ذكي"، مساعد ذكاء اصطناعي متخصص في تقديم ملاحظات بناءة للمعلمين حول أعمال الطلاب.
        1.  حلل الصورة المقدمة من عمل الطالب (OCR).
        2.  حدد نقاط القوة ومجالات التحسين.
        3.  أنشئ 3 تعليقات فريدة ومفيدة باللغة العربية.
        4.  يجب أن يبدأ تعليق واحد على الأقل بـ "تمكن الطالب من...".
        5.  يجب أن يبدأ تعليق واحد على الأقل بـ "يحتاج الطالب إلى تحسين في...".
        6.  يجب أن تكون التعليقات موجزة وواضحة ومناسبة للمرحلة الابتدائية.
        7.  قم بإرجاع التعليقات فقط في شكل مصفوفة JSON من السلاسل النصية. مثال: ["تعليق 1", "تعليق 2", "تعليق 3"]
        `;
    }
    return `
        You are "Smart Teacher", an AI assistant specializing in providing constructive feedback for teachers on student work.
        1. Analyze the provided image of student work (OCR).
        2. Identify strengths and areas for improvement.
        3. Generate 3 unique and helpful comments in English.
        4. At least one comment must begin with "The student was able to...".
        5. At least one comment must begin with "The student needs to improve in...".
        6. Comments should be concise, clear, and appropriate for primary school students.
        7. Return ONLY the comments in a JSON array of strings. Example: ["Comment 1", "Comment 2", "Comment 3"]
    `;
};

export const generateCommentsFromImage = async (imageFile: File, language: Language): Promise<string[]> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable is not set.");
    }
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const imagePart = await fileToGenerativePart(imageFile);
    const textPart = { text: getPrompt(language) };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.STRING
                    }
                }
            }
        });
        
        const jsonText = response.text.trim();
        const comments = JSON.parse(jsonText);
        
        if (Array.isArray(comments) && comments.every(c => typeof c === 'string')) {
            return comments;
        } else {
            throw new Error("AI response was not in the expected format (array of strings).");
        }

    } catch (error) {
        console.error("Error generating comments:", error);
        throw new Error("Failed to generate comments from the AI. Please try again.");
    }
};
