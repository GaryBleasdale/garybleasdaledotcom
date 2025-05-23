export interface CV {
  readonly basics?: Basics;
  readonly work?: Work[]
  readonly volunteer?: Volunteer[];
  readonly education?: Education[];
  readonly awards?: Awards[];
  readonly certificates?: Certificates[];
  readonly publications?: Publications[];
  readonly skills?: Skills[];
  readonly languages?: Languages[];
  readonly interests?: Interests[];
  readonly references?: References[];
  readonly projects?: Projects[];

}

interface Basics {
  name: string;
  label:? string;
  image?: string;
  email?: string;
  phone?: string;
  url?: string;
  summary?: string;
  location?: Location;
  profiles?: Profiles[];
}

interface Location {
  address?: string;
  postalCode?: string;
  city?: string;
  region?: string;
  country?: string;
  countryCode?: string;
}

interface Profiles {
  network: string;
  username?: string;
  url?: string;
}

interface Work {
  name: string;
  position: string;
  url?: string;
  startDate: DateStr;
  display: boolean;
  endDate?: DateStr;
  summary: string;
  highlights: Highlights;
}

interface Volunteer {
  organization: string;
  position: string;
  url?: string;
  startDate: DateStr;
  endDate?: DateStr;
  summary?: string;
  highlights?: Highlights;
}

interface Education {
  institution: string;
  url?: string;
  area: string;
  studyType?: string;
  highlights?:string[];
  startDate: DateStr;
  endDate?: DateStr;
  score?: string;
  courses?: string[];
}

interface Awards {
  title: string;
  date: string;
  awarder: string;
  summary?: string;
}

interface Certificates {
  name: string;
  date: DateStr;
  issuer: string;
  url?: string;
}

interface Publications {
  name: string;
  publisher: string;
  releaseDate: DateStr;
  url?: string;
  summary?: string;
}

interface Skills {
  name: string;
  level?: string;
  keywords?: string[];
}

interface Languages {
  language: Language;
  fluency?: string;
  isoCode: string;
}

type Languages =
  "English"
  | "Spanish"
  | "French"
  | "German"
  | "Italian"
  | "Korean"
  | "Portuguese"
  | "Chinese"
  | "Japanese"
  | "Arabic"
  | "Dutch"
  | "Finnish"
  | "Russian"
  | "Turkish"
  | "Hindi"
  | "Bengali"
  | string;
  // Add more languages as needed

  interface Interests {
    name: string;
    keywords?: string[];
  }

  interface References {
    name: string;
    reference?: string;
  }

interface Project {
  name: string;
  id: string;
  description: string;
  year_published: number;
  last_updated: number;
  still_participating: boolean;
  isActive: boolean;
  highlights: string[];
  github: string;
  has_full_description: boolean;
  url: string;
}

type DateStr = `${string}-${string}-${string}`;

type Highlights = string[];

declare module "@cv" {
  const value: CV;
  export = value;
}