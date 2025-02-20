'use client'

import { useRouter } from 'next/navigation';
import React from 'react'

function Approvalstable({data:mentorsApprovals}:{data:any}) {

  const router = useRouter();
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Mentor Approvals</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full  shadow-md rounded-md">
          <thead>
            <tr className="bg-muted">
              <th className="py-2 px-4 border-b text-left">Name</th>
              <th className="py-2 px-4 border-b text-left">Email</th>
              <th className="py-2 px-4 border-b text-left">Skills</th>
              <th className="py-2 px-4 border-b text-left">Submitted On</th>
            </tr>
          </thead>
          <tbody>
            {mentorsApprovals.map((approval: any) => (
              <tr
                key={approval.id}
                className="hover:bg-muted/50 cursor-pointer"
                onClick={() => {
                  router.push(`/admin/approvals/${approval.id}`)
                }}
              >
                <td className="py-2 px-4 border-b">{approval.mentorName}</td>
                <td className="py-2 px-4 border-b">{approval.email}</td>
                <td className="py-2 px-4 border-b">
                  {approval.skills?.join(', ') || 'N/A'}
                </td>
                <td className="py-2 px-4 border-b">
                  {new Date(approval.createdAt).toLocaleDateString('en-IN')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Approvalstable