export interface BlogPost {
  title: string;
  description: string;
  date: string;
  path: string;
  body?: {
    toc?: {
      links?: { id: string; text: string; depth: number }[];
    };
  };
  image?: {
    src: string;
    alt?: string;
  };
  badge?: {
    label: string;
    color?: string;
  };
  readingTime?: number;
  headline?: string;
  icon?: string;
  authors?: {
    name: string;
    description?: string;
    to?: string;
    avatar?: {
      src: string;
    };
  }[];
}
