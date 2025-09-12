'use client';

import {useEffect} from 'react';
import {useRouter} from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/creative-studio');
  }, [router]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <p className="text-foreground">Redirecting...</p>
    </div>
  );
}
