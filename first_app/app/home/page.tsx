'use client';
import { useRouter } from 'next/navigation';
import CardLinks from './components/Links';

export default function Home() {
  const router = useRouter();
  
  const handleClick = () => {
    router.push('/home/cause_list');
  };
  
  return (
    <main>
    <CardLinks />
    </main>
  );
}