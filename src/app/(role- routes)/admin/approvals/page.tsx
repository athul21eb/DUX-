

import Approvalstable from '@/components/forms/approvalstable';
import { getAllMentorsApprovals } from '@/lib/actions/admin/approvals/approvalsAction';
import React from 'react';


async function ApprovalsPage() {
  const approvals = await getAllMentorsApprovals();

  if (!approvals.success) return <div>Failed to fetch approvals.</div>;

  const mentorsApprovals = approvals?.data?.mentorsApprovals;

  if (!mentorsApprovals || mentorsApprovals.length === 0) {
    return <div>No mentor approvals found.</div>;
  }

  return (
   <Approvalstable data={mentorsApprovals}/>
  );
}

export default ApprovalsPage;