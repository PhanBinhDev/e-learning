export interface PdfFile {
  id: string;
  name: string;
  size: string;
  uploadDate: string;
  url?: string;
  thumbnailUrl?: string;
}

export interface Subject {
  id: string;
  name: string;
  icon?: string;
  color?: string;
}

export interface Grade {
  id: string;
  name: string;
  level: number;
}

export interface SubjectData {
  [grade: string]: {
    [subject: string]: PdfFile[];
  };
}
