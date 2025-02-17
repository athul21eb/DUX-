import AdminSkillManagementClient from '@/components/layouts/AdminSkillsManagementClient'
import { getAllSkills } from '@/lib/actions/admin/skillsManagement/skillsManagementActions'

async function SkillsManagementPage() {


  const skills = await getAllSkills(1,2)

  console.log(skills);

  return (
    <div><AdminSkillManagementClient /></div>
  )
}

export default SkillsManagementPage