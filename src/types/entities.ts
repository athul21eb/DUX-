export interface User {
  id: string;
  name: string | null;
  email: string;
  emailVerified: Date | null;
  isBlocked: boolean;
  password: string | null;
  image: string | null;
  dob: Date | null;
  gender: string | null;
  phone: string | null;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  accounts: Account[];
  mentorProfile: Mentor | null; // Corrected type
}

export interface Account {
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token: string | null;
  access_token: string | null;
  expires_at: number | null;
  token_type: string | null;
  scope: string | null;
  id_token: string | null;
  session_state: string | null;
  createdAt: Date;
  updatedAt: Date;
  user: User;
}

export interface VerificationToken {
  id: string;
  email: string;
  token: string;
  expires: Date;
}

export interface OTP {
  id: number;
  token: string;
  email: string;
  createdAt: Date;
  expiresAt: Date;
}

export interface Mentor {
  id: string;
  userId: string;
  user: User;
  skills: MentorSkill[];
  documents: string[];
  aboutMe: string | null;
  experiences: Experience[];
  educations: Education[];
  languages: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Experience {
  id: string;
  mentorId: string;
  role: string;
  company: string;
  startDate: Date;
  endDate: Date | null;
  description: string | null;
  mentor: Mentor;
}

export interface Education {
  id: string;
  mentorId: string;
  degree: string;
  institution: string;
  startDate: Date;
  endDate: Date | null;
  description: string | null;
  mentor: Mentor;
}

export interface Skill {
  id: string;
  name: string;
  description: string | null;
  mentors: MentorSkill[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MentorSkill {
  mentorId: string;
  skillId: string;
  mentor: Mentor;
  skill: Skill;
}

// export interface Booking {
//     id: string;
//     mentorId: string;
//     userId: string;
//     date: Date;
//     duration: number;
//     status: string;
//     createdAt: Date;
//     updatedAt: Date;
//     mentor: Mentor;
//     user: User;
//   }