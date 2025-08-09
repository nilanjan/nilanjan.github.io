export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  github_url?: string;
  live_url?: string;
  image_url?: string;
}

export interface ContactMessage {
  name: string;
  email: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface Skill {
  name: string;
  category: 'frontend' | 'backend' | 'mobile' | 'devops' | 'other';
  proficiency: number; // 0-100
  icon?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  duration: string;
  description: string;
  technologies: string[];
  achievements: string[];
}

export interface Publication {
  id: string;
  title: string;
  authors: string[];
  journal: string;
  year: number;
  doi?: string;
  url?: string;
} 