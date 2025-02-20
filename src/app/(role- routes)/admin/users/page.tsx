import UsersTable from '@/components/layouts/userTable';
import { getAllUsersWithPagination } from '@/lib/db/user';
import React from 'react';


async function UsersPage() {
  const result = await getAllUsersWithPagination(1,5);

  return (
    <div className="container mx-auto py-6">
      <UsersTable initialData={result} />
    </div>
  );
}

export default UsersPage;