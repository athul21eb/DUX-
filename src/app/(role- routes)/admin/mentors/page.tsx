import UsersTable from '@/components/layouts/userTable';
import { getAllUsersWithPagination } from '@/lib/db/user';
import React from 'react';


async function MentorsPage() {
  const result = await getAllUsersWithPagination(1,5,"mentor");

  return (
    <div className="container mx-auto py-6">
      <UsersTable initialData={result} role={'mentor'} />
    </div>
  );
}

export default MentorsPage;