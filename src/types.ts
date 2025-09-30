export interface Video {
  description: string;
  sources: string[];
  subtitle: string;
  thumb: string;
  title: string;
}

export interface Category {
  name: string;
  videos: Video[];
}

export interface VideoData {
  categories: Category[];
}
