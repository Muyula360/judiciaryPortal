'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';

import StaffWrapper from "../context/StaffContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
   const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/home/login');
    }
  }, [router]);

  return (
    <>
       <StaffWrapper>
         <main>{children}</main>
       </StaffWrapper>
    </>
  );
}