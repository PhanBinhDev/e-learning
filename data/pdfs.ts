export interface PdfFile {
  id: string;
  name: string;
  size: string;
  uploadDate: string;
  thumbnail: string;
  file: string;
  iframeUrl?: string;
  subject: string;
  grade: string;
}

// PDF data organized by grade and subject
export const pdfData: Record<string, Record<string, PdfFile[]>> = {
  // Mẫu giáo (có dữ liệu thật với interactive URLs)
  "mau-giao": {
    "tieng-anh": [
      {
        id: "1",
        name: "My Little Island - Lesson 1: Basic Theory",
        size: "2.5 MB",
        uploadDate: "2024-01-15",
        thumbnail: "/chapters/chapter1.png",
        file: '/pdfs/bai1.pdf',
        iframeUrl: "https://publuu.com/flip-book/919289/2015138/page/1?embed",
        subject: "Tiếng Anh",
        grade: "Mẫu giáo"
      },
      {
        id: "2",
        name: "My Little Island - Lesson 2: Basic Theory",
        size: "3.2 MB",
        uploadDate: "2024-01-20",
        thumbnail: "/chapters/chapter2.png",
        file: '/pdfs/bai2.pdf',
        iframeUrl: "https://publuu.com/flip-book/919289/2015421/page/1?embed",
        subject: "Tiếng Anh",
        grade: "Mẫu giáo"
      },
      {
        id: "3",
        name: "My Little Island - Lesson 3: Practice Exercises",
        size: "1.8 MB", 
        uploadDate: "2024-01-25",
        thumbnail: "/chapters/chapter3.png",
        file: '/pdfs/bai3.pdf',
        iframeUrl: "https://publuu.com/flip-book/919289/2015422/page/1?embed",
        subject: "Tiếng Anh",
        grade: "Mẫu giáo"
      },
    ],
    "toan-hoc": [],
    "van-hoc": [],
    "khoa-hoc": []
  },
  
  // Lớp 1
  "1": {
    "tieng-viet": [],
    "toan": [],
    "dao-duc": [],
    "am-nhac": [],
    "my-thuat": []
  },
  
  // Lớp 2
  "2": {
    "tieng-viet": [],
    "toan": [],
    "dao-duc": [],
    "am-nhac": [],
    "my-thuat": []
  },
  
  // Lớp 3
  "3": {
    "tieng-viet": [],
    "toan": [],
    "dao-duc": [],
    "am-nhac": [],
    "my-thuat": [],
    "the-duc": []
  },
  
  // Lớp 4
  "4": {
    "tieng-viet": [],
    "toan": [],
    "dao-duc": [],
    "am-nhac": [],
    "my-thuat": [],
    "the-duc": [],
    "tu-nhien-xa-hoi": [],
    "tieng-anh-tieu-hoc": []
  },
  
  // Lớp 5
  "5": {
    "tieng-viet": [],
    "toan": [],
    "dao-duc": [],
    "am-nhac": [],
    "my-thuat": [],
    "the-duc": [],
    "tu-nhien-xa-hoi": [],
    "tieng-anh-tieu-hoc": []
  },
  
  // Lớp 6
  "6": {
    "ngu-van": [],
    "toan": [],
    "tieng-anh": [],
    "lich-su": [],
    "dia-ly": [],
    "gdcd": [],
    "sinh-hoc": [],
    "cong-nghe": [],
    "tin-hoc": [],
    "am-nhac": [],
    "my-thuat": [],
    "the-duc": []
  },
  
  // Lớp 7
  "7": {
    "ngu-van": [],
    "toan": [],
    "tieng-anh": [],
    "lich-su": [],
    "dia-ly": [],
    "gdcd": [],
    "sinh-hoc": [],
    "vat-ly": [],
    "cong-nghe": [],
    "tin-hoc": [],
    "am-nhac": [],
    "my-thuat": [],
    "the-duc": []
  },
  
  // Lớp 8
  "8": {
    "ngu-van": [],
    "toan": [],
    "tieng-anh": [],
    "lich-su": [],
    "dia-ly": [],
    "gdcd": [],
    "sinh-hoc": [],
    "vat-ly": [],
    "hoa-hoc": [],
    "cong-nghe": [],
    "tin-hoc": [],
    "am-nhac": [],
    "my-thuat": [],
    "the-duc": []
  },
  
  // Lớp 9
  "9": {
    "ngu-van": [],
    "toan": [],
    "tieng-anh": [],
    "lich-su": [],
    "dia-ly": [],
    "gdcd": [],
    "sinh-hoc": [],
    "vat-ly": [],
    "hoa-hoc": [],
    "cong-nghe": [],
    "tin-hoc": [],
    "am-nhac": [],
    "my-thuat": [],
    "the-duc": []
  },
  
  // Lớp 10
  "10": {
    "ngu-van": [],
    "toan": [],
    "tieng-anh": [],
    "lich-su": [],
    "dia-ly": [],
    "gdcd": [],
    "sinh-hoc": [],
    "vat-ly": [],
    "hoa-hoc": [],
    "cong-nghe": [],
    "tin-hoc": [],
    "am-nhac": [],
    "my-thuat": [],
    "the-duc": []
  },
  
  // Lớp 11
  "11": {
    "ngu-van": [],
    "toan": [],
    "tieng-anh": [],
    "lich-su": [],
    "dia-ly": [],
    "gdcd": [],
    "sinh-hoc": [],
    "vat-ly": [],
    "hoa-hoc": [],
    "cong-nghe": [],
    "tin-hoc": [],
    "am-nhac": [],
    "my-thuat": [],
    "the-duc": []
  },
  
  // Lớp 12
  "12": {
    "ngu-van": [],
    "toan": [],
    "tieng-anh": [],
    "lich-su": [],
    "dia-ly": [],
    "gdcd": [],
    "sinh-hoc": [],
    "vat-ly": [],
    "hoa-hoc": [],
    "cong-nghe": [],
    "tin-hoc": [],
    "am-nhac": [],
    "my-thuat": [],
    "the-duc": []
  }
};

// Helper function to get PDFs by grade and subject slug
export const getPdfsByGradeAndSubject = (gradeSlug: string, subjectSlug: string): PdfFile[] => {
  return pdfData[gradeSlug]?.[subjectSlug] || [];
};

// Helper function to get PDF by ID
export const getPdfById = (id: string): PdfFile | undefined => {
  for (const grade in pdfData) {
    for (const subject in pdfData[grade]) {
      const pdf = pdfData[grade][subject].find(pdf => pdf.id === id);
      if (pdf) return pdf;
    }
  }
  return undefined;
};

// Helper function to get all PDFs
export const getAllPdfs = (): PdfFile[] => {
  const allPdfs: PdfFile[] = [];
  for (const grade in pdfData) {
    for (const subject in pdfData[grade]) {
      allPdfs.push(...pdfData[grade][subject]);
    }
  }
  return allPdfs;
};
