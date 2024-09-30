'use client';

import { SessionProvider as Session } from 'next-auth/react';

export const SessionProvider = ({children} : any) => {

  return (
    <Session>
        {children}
    </Session>
  )
}