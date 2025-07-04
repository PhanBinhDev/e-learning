import { slugify } from "@/lib/slugify";

export interface Subject {
  slug: string;
  name: string;
}

export interface Grade {
  slug: string;
  name: string;
  subjects: Subject[];
}

// Create subjects with both slug and name
const createSubjects = (names: string[]): Subject[] => {
  return names.map(name => ({
    slug: slugify(name),
    name: name
  }));
};

// Define subjects for each grade
export const grades: Grade[] = [
  {
    slug: "mau-giao",
    name: "Mẫu giáo",
    subjects: createSubjects([
      "Tiếng Anh",
      "Toán học",
      "Văn học",
      "Khoa học"
    ])
  },
  {
    slug: "1",
    name: "1",
    subjects: createSubjects([
      "Tiếng Việt",
      "Toán",
      "Đạo đức",
      "Âm nhạc",
      "Mỹ thuật"
    ])
  },
  {
    slug: "2",
    name: "2",
    subjects: createSubjects([
      "Tiếng Việt",
      "Toán",
      "Đạo đức",
      "Âm nhạc",
      "Mỹ thuật",
      "Tiếng Anh"
    ])
  },
  {
    slug: "3",
    name: "3",
    subjects: createSubjects([
      "Tiếng Việt",
      "Toán",
      "Đạo đức",
      "Âm nhạc",
      "Mỹ thuật",
      "Tiếng Anh",
      "Thể dục"
    ])
  },
  {
    slug: "4",
    name: "4",
    subjects: createSubjects([
      "Tiếng Việt",
      "Toán",
      "Đạo đức",
      "Âm nhạc",
      "Mỹ thuật",
      "Tiếng Anh",
      "Thể dục",
      "Khoa học"
    ])
  },
  {
    slug: "5",
    name: "5",
    subjects: createSubjects([
      "Tiếng Việt",
      "Toán",
      "Đạo đức",
      "Âm nhạc",
      "Mỹ thuật",
      "Tiếng Anh",
      "Thể dục",
      "Khoa học",
      "Lịch sử và Địa lý"
    ])
  },
  {
    slug: "6",
    name: "6",
    subjects: createSubjects([
      "Ngữ văn",
      "Toán",
      "Tiếng Anh",
      "Khoa học tự nhiên",
      "Lịch sử",
      "Địa lý",
      "Giáo dục công dân",
      "Công nghệ",
      "Tin học",
      "Âm nhạc",
      "Mỹ thuật",
      "Thể dục"
    ])
  },
  {
    slug: "7",
    name: "7",
    subjects: createSubjects([
      "Ngữ văn",
      "Toán",
      "Tiếng Anh",
      "Vật lý",
      "Hóa học",
      "Sinh học",
      "Lịch sử",
      "Địa lý",
      "Giáo dục công dân",
      "Công nghệ",
      "Tin học",
      "Âm nhạc",
      "Mỹ thuật",
      "Thể dục"
    ])
  },
  {
    slug: "8",
    name: "8",
    subjects: createSubjects([
      "Ngữ văn",
      "Toán",
      "Tiếng Anh",
      "Vật lý",
      "Hóa học",
      "Sinh học",
      "Lịch sử",
      "Địa lý",
      "Giáo dục công dân",
      "Công nghệ",
      "Tin học",
      "Âm nhạc",
      "Mỹ thuật",
      "Thể dục"
    ])
  },
  {
    slug: "9",
    name: "9",
    subjects: createSubjects([
      "Ngữ văn",
      "Toán",
      "Tiếng Anh",
      "Vật lý",
      "Hóa học",
      "Sinh học",
      "Lịch sử",
      "Địa lý",
      "Giáo dục công dân",
      "Công nghệ",
      "Tin học",
      "Âm nhạc",
      "Mỹ thuật",
      "Thể dục"
    ])
  },
  {
    slug: "10",
    name: "10",
    subjects: createSubjects([
      "Ngữ văn",
      "Toán",
      "Tiếng Anh",
      "Vật lý",
      "Hóa học",
      "Sinh học",
      "Lịch sử",
      "Địa lý",
      "Giáo dục công dân",
      "Giáo dục kinh tế và pháp luật",
      "Công nghệ",
      "Tin học",
      "Âm nhạc",
      "Mỹ thuật",
      "Thể dục",
      "Giáo dục quốc phòng"
    ])
  },
  {
    slug: "11",
    name: "11",
    subjects: createSubjects([
      "Ngữ văn",
      "Toán",
      "Tiếng Anh",
      "Vật lý",
      "Hóa học",
      "Sinh học",
      "Lịch sử",
      "Địa lý",
      "Giáo dục công dân",
      "Giáo dục kinh tế và pháp luật",
      "Công nghệ",
      "Tin học",
      "Âm nhạc",
      "Mỹ thuật",
      "Thể dục",
      "Giáo dục quốc phòng"
    ])
  },
  {
    slug: "12",
    name: "12",
    subjects: createSubjects([
      "Ngữ văn",
      "Toán",
      "Tiếng Anh",
      "Vật lý",
      "Hóa học",
      "Sinh học",
      "Lịch sử",
      "Địa lý",
      "Giáo dục công dân",
      "Giáo dục kinh tế và pháp luật",
      "Công nghệ",
      "Tin học",
      "Âm nhạc",
      "Mỹ thuật",
      "Thể dục",
      "Giáo dục quốc phòng"
    ])
  }
];

// Helper functions to find grade and subject by slug
export const findGradeBySlug = (slug: string): Grade | undefined => {
  return grades.find(grade => grade.slug === slug);
};

export const findSubjectBySlug = (gradeSlug: string, subjectSlug: string): Subject | undefined => {
  const grade = findGradeBySlug(gradeSlug);
  return grade?.subjects.find(subject => subject.slug === subjectSlug);
};

// Create lookup tables for slug to name conversion
export const gradeSlugToName: Record<string, string> = {};
export const subjectSlugToName: Record<string, string> = {};

grades.forEach(grade => {
  gradeSlugToName[grade.slug] = grade.name;
  grade.subjects.forEach(subject => {
    subjectSlugToName[subject.slug] = subject.name;
  });
});