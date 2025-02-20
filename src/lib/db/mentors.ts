// import { PrismaClient } from "@prisma/client";
// import { Mentor, Skill, Experience, Education } from "@/types/entities";

// class MentorService {
//   private prisma: PrismaClient;

//   constructor(prisma: PrismaClient) {
//     this.prisma = prisma;
//   }

//   // Create a new mentor profile with error handling
//   async createMentor(
//     userId: string,
//     name: string,
//     image?: string,
//     skills?: Skill[],
//     documents?: string | null, // Changed to string (comma-separated URLs) or null
//     aboutMe?: string,
//     experiences?:  Experience[],
//     educations?: Education[],
//     languages?: string[],
//     phone?: string, // Added phone

//   ): Promise<Mentor | null> {
//     try {
//       // Update the user with name and image if provided
//       await this.prisma.user.update({
//         where: { id: userId },
//         data: {
//           name,
//           image,
//           phone: phone, // Added phone to user update
//         },
//       });

//       // Create mentor profile with related data (skills, experiences, educations)
//       const mentor = await this.prisma.mentor.create({
//         data: {
//           userId,
//           documents: documents ? documents.split(',') : [], // Store as array
//           aboutMe,
//           languages: languages || [],
//           skills: skills?.length
//             ? {
//                 create: skills.map((skill) => ({
//                   skill: {
//                     connect: { id: skill.id },
//                   },
//                 })),
//               }
//             : undefined,
//           experiences: experiences?.length
//             ? {
//                 create: experiences.map((experience) => ({
//                   role: experience.role,
//                   company: experience.company,
//                   startDate: experience.startDate,
//                   endDate: experience.endDate,
//                   description: experience.description,
//                 })),
//               }
//             : undefined,
//           educations: educations?.length
//             ? {
//                 create: educations.map((education) => ({
//                   degree: education.degree,
//                   institution: education.institution,
//                   startDate: education.startDate,
//                   endDate: education.endDate,
//                   description: education.description,
//                 })),
//               }
//             : undefined,

//         },
//         include: {
//           user: true,
//           skills: {
//             include: {
//               skill: true,
//             },
//           },
//           experiences: true,
//           educations: true,
//         },
//       });

//       const transformedMentor: Mentor = {
//         ...mentor,
//         skills: mentor.skills.map((mentorSkill) => mentorSkill.skill),
//       };

//       return transformedMentor;
//     } catch (error) {
//       console.error("Error creating mentor:", error);
//       return null;
//     }
//   }

//   // Update an existing mentor profile with error handling
//   // ... (implementation for updateMentor function, if needed)
// }

// // Export the mentor service for usage in other parts of the app
// export const mentorService = new MentorService(new PrismaClient());

