import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { message, currentFile, currentPageInfo, pdfAnalysis } = await request.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      );
    }

    // Tạo system prompt với context về PDF
    const systemPrompt = `
Bạn là một AI trợ lý giáo dục chuyên về phân tích và giải thích nội dung bài học.

THÔNG TIN BÀI HỌC HIỆN TẠI:
- Tên bài: ${currentFile?.name || 'Không rõ'}
- Môn học: ${currentFile?.subject || 'Không rõ'}
- Lớp: ${currentFile?.grade || 'Không rõ'}
- Trang hiện tại: ${currentPageInfo?.pageNumber || 'Không rõ'}
- Tổng số trang: ${currentPageInfo?.totalPages || 'Không rõ'}

${pdfAnalysis ? `
NỘI DUNG BÀI HỌC (từ PDF thực tế):
${pdfAnalysis.content}

TÓM TẮT:
${pdfAnalysis.summary}

CHỦ ĐỀ CHÍNH:
${pdfAnalysis.topics.join(', ')}

TỪ KHÓA QUAN TRỌNG:
${pdfAnalysis.keywords.join(', ')}

${pdfAnalysis.extractedText ? `
TEXT TRÍCH XUẤT TỪ PDF:
${pdfAnalysis.extractedText}
` : ''}
` : ''}

NHIỆM VỤ CỦA BẠN:
1. CHỈ trả lời câu hỏi liên quan đến nội dung bài học này
2. Dựa trên nội dung THỰC TẾ đã trích xuất từ PDF
3. Nếu câu hỏi không liên quan đến bài học, hãy từ chối lịch sự và định hướng về nội dung bài học
4. Giải thích rõ ràng, phù hợp với trình độ học sinh lớp ${currentFile?.grade || 'đã chỉ định'}
5. Sử dụng tiếng Việt dễ hiểu, phù hợp với độ tuổi
6. Trích dẫn cụ thể từ nội dung PDF khi có thể
7. Khuyến khích học sinh đặt câu hỏi về bài học

CÁCH TRẢ LỜI:
- Ngắn gọn, dễ hiểu
- Có ví dụ cụ thể từ bài học
- Trích dẫn từ nội dung PDF
- Khuyến khích tư duy phản biện
- Liên kết với kiến thức thực tế

Hãy trả lời câu hỏi sau dựa trên nội dung thực tế của bài học:
`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o', // Sử dụng GPT-4o để hiểu context PDF tốt hơn
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    const assistantMessage = completion.choices[0]?.message?.content;

    if (!assistantMessage) {
      return NextResponse.json(
        { error: 'No response from AI' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: assistantMessage,
      usage: completion.usage
    });

  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
