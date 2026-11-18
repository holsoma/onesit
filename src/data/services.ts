export type Service = {
  id: string;
  name: string;
  description: string;
  category: "Study" | "Campus" | "Life" | "Career";
  status: "available" | "soon";
  url?: string;
  icon: string;
  iconLabel?: string;
};

export const services: Service[] = [
  {
    id: "in4sit",
    name: "IN4SIT",
    description: "Student records & admin",
    category: "Study",
    status: "available",
    url: "https://in4sit.singaporetech.edu.sg/",
    icon: "in4sit",
  },
  {
    id: "xsite",
    name: "xSiTe",
    description: "Learning & course materials",
    category: "Study",
    status: "available",
    url: "https://xsite.singaporetech.edu.sg/",
    icon: "xsite",
  },
  {
    id: "rbs",
    name: "RBS",
    description: "Book a campus space",
    category: "Campus",
    status: "available",
    url: "https://rbs.singaporetech.edu.sg/",
    icon: "rooms",
  },
  {
    id: "map",
    name: "Campus Map",
    description: "Find your way around",
    category: "Campus",
    status: "available",
    url: "https://www.singaporetech.edu.sg/campus-wayfinder",
    icon: "map",
  },
  {
    id: "intranet",
    name: "Student intranet",
    description: "Notices & student resources",
    category: "Study",
    status: "available",
    url: "https://sitsingaporetechedu.sharepoint.com/sites/Students",
    icon: "intranet",
  },
  {
    id: "calendar",
    name: "Academic calendar",
    description: "Published trimester dates",
    category: "Study",
    status: "available",
    url: "https://www.singaporetech.edu.sg/admissions/undergraduate/academic-calendar-sit-and-joint-programmes",
    icon: "calendar",
  },
  {
    id: "readytalent",
    name: "ReadyTalent",
    description: "Internships & career opportunities",
    category: "Career",
    status: "available",
    url: "https://readytalent2.singaporetech.edu.sg/",
    icon: "career",
  },
  {
    id: "cates",
    name: "Cates",
    description: "Food court ordering",
    category: "Life",
    status: "soon",
    icon: "cates",
  },
  {
    id: "wholesome",
    name: "Wholesome",
    description: "Food ordering QR codes",
    category: "Life",
    status: "soon",
    icon: "food",
  },
  {
    id: "transport",
    name: "Punggol transport",
    description: "Train & bus arrival times",
    category: "Campus",
    status: "soon",
    icon: "transport",
  },
  {
    id: "medihub",
    name: "MediHub",
    description: "Student healthcare access",
    category: "Life",
    status: "soon",
    icon: "health",
  },
  {
    id: "facilities",
    name: "Campus facilities",
    description: "Rooms, studios, sports & printing",
    category: "Campus",
    status: "soon",
    icon: "facilities",
  },
  {
    id: "community",
    name: "Useful links",
    description: "Student tools & community channels",
    category: "Life",
    status: "soon",
    icon: "community",
  },
];

export const defaultFavourites = ["in4sit", "xsite", "rbs", "map"];
export const categories = ["All", "Study", "Campus", "Life", "Career"] as const;
