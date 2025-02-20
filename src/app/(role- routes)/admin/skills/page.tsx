import AdminSkillManagementClient from '@/components/layouts/AdminSkillsManagementClient'
import { getAllSkills } from '@/lib/actions/admin/skillsManagement/skillsManagementActions'

async function SkillsManagementPage() {
  // Get initial skills from the server
  const initialData = await getAllSkills(1, 5); // Fetching the first page of skills
  if (!initialData.success) return null;

  return (
    <div>
      <AdminSkillManagementClient
        initialSkills={initialData.data.skills}
        totalPages={initialData.data.totalPages}
        currentPage={initialData.data.currentPage}
      />
    </div>
  );
}

export default SkillsManagementPage;
