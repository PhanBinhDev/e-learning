import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { pdfName, subject, grade, pdfPath } = await request.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      );
    }

    // Đọc file PDF từ public folder
    const pdfFilePath = path.join(process.cwd(), 'public', pdfPath);
    
    console.log('Looking for PDF at:', pdfFilePath);
    console.log('PDF path from request:', pdfPath);
    
    if (!fs.existsSync(pdfFilePath)) {
      console.error('PDF file not found at:', pdfFilePath);
      return NextResponse.json(
        { error: `PDF file not found at: ${pdfFilePath}` },
        { status: 404 }
      );
    }

    // Đọc file PDF
    const pdfBuffer = fs.readFileSync(pdfFilePath);
    
    // Convert PDF to base64
    const pdfBase64 = pdfBuffer.toString('base64');
    
    console.log('PDF file read successfully:', pdfName, 'Size:', pdfBuffer.length, 'bytes');

    // Extract text from PDF using pdfjs-dist
    let extractedText = '';
    try {
      // Dynamic import pdfjs-dist để tránh lỗi
      const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
      
      const uint8Array = new Uint8Array(pdfBuffer);
      const pdf = await pdfjsLib.getDocument({ data: uint8Array }).promise;
      
      const totalPages = pdf.numPages;
      console.log('Total pages:', totalPages);
      
      // Lấy text từ tất cả các trang
      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        
        const pageText = textContent.items
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((item: any) => item.str)
          .join(' ');
        
        extractedText += pageText + '\n';
        console.log(`Page ${pageNum} text length:`, pageText.length);
      }
      
      console.log('Total extracted text length:', extractedText.length);
      
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      extractedText = `Không thể trích xuất text từ PDF. File: ${pdfName}`;
    }

    // Tạo analysis prompt với nội dung thực tế của PDF
    const analysisPrompt = `
Hãy phân tích nội dung bài học dựa trên text được trích xuất từ PDF sau:

**Thông tin bài học:**
- Tên: ${pdfName}
- Môn học: ${subject}
- Lớp: ${grade}

**Nội dung PDF:**
${extractedText.length > 0 ? extractedText : 'Không thể trích xuất text từ PDF'}

**Yêu cầu phân tích:**
1. Tóm tắt nội dung chính của bài học (2-3 câu)
2. Liệt kê 5-7 chủ đề chính được đề cập
3. Trích xuất 10-15 từ khóa quan trọng
4. Tạo mô tả chi tiết về nội dung bài học

**Định dạng phản hồi JSON:**
{
  "summary": "Tóm tắt ngắn gọn về bài học",
  "topics": ["chủ đề 1", "chủ đề 2", ...],
  "keywords": ["từ khóa 1", "từ khóa 2", ...],
  "content": "Nội dung chi tiết về bài học",
  "extractedText": "Text trích xuất từ PDF (truncated nếu quá dài)"
}

Hãy phân tích dựa trên nội dung thực tế của PDF, phù hợp với trình độ học sinh lớp ${grade}.
`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o', // Sử dụng GPT-4o thay vì mini để đọc PDF
      messages: [
        {
          role: 'system',
          content: 'Bạn là một chuyên gia giáo dục, chuyên phân tích nội dung bài học từ PDF. Hãy phân tích chính xác dựa trên nội dung được cung cấp và trả lời theo định dạng JSON.'
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: analysisPrompt
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:application/pdf;base64,${pdfBase64}`,
                detail: "high"
              }
            }
          ]
        }
      ],
      temperature: 0.3,
      max_tokens: 4000,
    });

    const assistantMessage = completion.choices[0]?.message?.content;

    if (!assistantMessage) {
      return NextResponse.json(
        { error: 'No response from AI' },
        { status: 500 }
      );
    }

    try {
      // Parse JSON response
      const analysisData = JSON.parse(assistantMessage);
      
      // Thêm base64 data vào response
      analysisData.pdfBase64 = pdfBase64;
      analysisData.extractedTextLength = extractedText.length;
      
      return NextResponse.json({
        success: true,
        analysis: analysisData,
        usage: completion.usage
      });
    } catch {
      // Fallback nếu không parse được JSON
      return NextResponse.json({
        success: true,
        analysis: {
          summary: `Bài học ${pdfName} - ${subject} lớp ${grade}`,
          topics: ['Nội dung chính', 'Bài tập', 'Ứng dụng'],
          keywords: ['học tập', 'kiến thức', 'bài tập'],
          content: extractedText.length > 0 ? extractedText.substring(0, 500) + '...' : 'Không thể trích xuất nội dung',
          extractedText: extractedText.substring(0, 1000),
          pdfBase64: pdfBase64,
          extractedTextLength: extractedText.length
        },
        usage: completion.usage
      });
    }

  } catch (error) {
    console.error('Error in analyze API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}