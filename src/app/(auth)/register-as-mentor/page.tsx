import MentorProfileForm from '@/components/forms/registerAsMentorForm'
import { auth } from '@/lib/auth/auth';
import { skillService } from '@/lib/db/skills'
import { getUserByIdConnectMentor } from '@/lib/db/user';
import { Skill } from '@/types/skills';
import { redirect } from 'next/navigation';


async function RegisterAsMentor() {
  const skills: Skill[] = (await skillService.getAllSkills()) ?? [];

  const session = await auth();

   const  user = await getUserByIdConnectMentor(session?.user?.id??"")
 if(user?.mentorProfile?.userId) return redirect('/')

  return (
    <div>
      <MentorProfileForm availableSkills={skills} />
    </div>
  )
}

export default RegisterAsMentor