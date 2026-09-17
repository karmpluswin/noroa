export const seedUniversity = {
  name: "Gujarat Technological University",
  shortName: "GTU",
};

export const seedProgram = {
  name: "Bachelor of Engineering",
};

export const seedBranch = {
  name: "Computer Engineering",
  code: "CE",
};

export const seedScheme = {
  name: "New Syllabus 2021",
  year: 2021,
};

type SeedSubject = {
  name: string;
  code: string;
  credits: number;
  topics: string[];
};

export const seedSubjects: Record<number, SeedSubject[]> = {
  5: [
    {
      name: "Web Programming",
      code: "3150713",
      credits: 4,
      topics: [
        "Introduction to Web Technologies",
        "HTML5 and CSS3",
        "JavaScript Fundamentals",
        "DOM Manipulation",
        "PHP Basics",
        "Working with MySQL",
        "Sessions and Cookies",
        "Introduction to Node.js",
      ],
    },
    {
      name: "Database Management Systems",
      code: "3150703",
      credits: 4,
      topics: [
        "Introduction to DBMS",
        "ER Model",
        "Relational Model and Algebra",
        "SQL",
        "Normalization",
        "Transactions and Concurrency Control",
        "Indexing and Query Optimization",
      ],
    },
  ],
  6: [
    {
      name: "Mobile Application Development",
      code: "3160714",
      credits: 4,
      topics: [
        "Introduction to Mobile Platforms",
        "Android Application Components",
        "UI Design for Mobile",
        "Data Storage on Android",
        "Networking and APIs",
        "Publishing Applications",
      ],
    },
    {
      name: "Design Engineering – 2A",
      code: "3160002",
      credits: 2,
      topics: ["Problem Identification", "Ideation", "Prototyping", "Testing and Validation"],
    },
  ],
};