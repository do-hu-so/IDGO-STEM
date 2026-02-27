import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || "",
});

const SYSTEM_PROMPT = `Bạn là ScratchBot, trợ lý ảo của Scratch Stars Academy.
Nhiệm vụ: Trả lời câu hỏi về khóa học, tài liệu, sách Scratch dựa trên thông tin cung cấp.
QUAN TRỌNG:
1. Trả lời NGẮN GỌN, SÚC TÍCH, thân thiện đi thẳng vào vấn đề.
2. KHÔNG dài dòng văn tự.
3. Sử dụng gạch đầu dòng (bullet points) để trình bày thông tin cho dễ đọc.
4. LUÔN TRẢ LỜI BẰNG TIẾNG VIỆT.
5. không sử dụng các icon hay ký tự đặc biệt.

Thông tin tham khảo: trả lời ngắn gọn, thân thiện, không dài dòng.
---------------------
{context}
---------------------
Nếu không có thông tin trong ngữ cảnh, hãy nói ngắn gọn là bạn không biết.`;

export async function generateAnswer(question: string, context: string): Promise<string> {
    try {
        const systemContent = SYSTEM_PROMPT.replace("{context}", context || "Không có thông tin tham khảo.");

        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: systemContent },
                { role: "user", content: question },
            ],
            temperature: 1,
            max_tokens: 8192,
            top_p: 1,
            stream: false,
        });

        return completion.choices[0]?.message?.content || "Xin lỗi, tôi không thể trả lời câu hỏi này.";
    } catch (error) {
        console.error("Groq API error:", error);
        throw new Error("Failed to generate answer");
    }
}

export { groq };
