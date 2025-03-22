import { db } from '@/db';
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation';
import React from 'react'
import { DashboardPage } from '../components/dashboard-page';
import DashBoardPageContent from './dashboard-page-content';

const page = async () => {
  const auth = await currentUser();

  if (!auth) {
    redirect("/sign-in")
  }

  const user = await db.user.findUnique({
    where: {externalId: auth.id}
  });

  if (!user) {
    redirect("/sign-in")
  }


  
  return (
    <div>
      <DashboardPage title='test title'>
        <DashBoardPageContent />
      </DashboardPage>
    </div>
  )
}

export default page
