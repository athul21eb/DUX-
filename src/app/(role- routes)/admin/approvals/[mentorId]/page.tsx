import ApprovalClient from '@/components/layouts/approval';
import { getMentorApprovalById } from '@/lib/actions/admin/approvals/approvalsAction';


// Server-side component to fetch mentor data
export default async function MentorApprovalDetailPage({ params }: any) {
  const { mentorId } = params;

  // Fetch mentor approval details by ID
  const approval = await getMentorApprovalById(mentorId);

  if (!approval?.success) {
    return <div>Error fetching mentor approval.</div>;
  }
console.log(approval?.data)
  const mentor = approval?.data;

  // return <div>hi</div>

  if (!mentor) {
    return <div>Mentor approval not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Mentor Approval Details</h1>
    <ApprovalClient mentor={mentor} mentorId={mentorId}/>
    </div>
  );
}


