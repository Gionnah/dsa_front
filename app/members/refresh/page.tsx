import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Refresh() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function check() {
      const res = await fetch('/api/refresh');
      if (!res.ok) router.push('/login')
        setLoading(false);
    }
    check();
  }, [router])

  return { loading }
}