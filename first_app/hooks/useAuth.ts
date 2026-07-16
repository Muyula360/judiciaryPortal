import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { setToken, removeToken } from '@/lib/auth';


export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { email: string; password: string; redirectTo?: string }) => {
      const res = await api.post('/auth/login', data);
      return { ...res.data, redirectTo: data.redirectTo || '/' };
    },
    onSuccess: (data) => {
      setToken(data.token);
      queryClient.invalidateQueries({ queryKey: ['user'] });
      router.push(data.redirectTo); 
    },
  });
};

// Register hook uncommented for future use, currently not needed in the project
// export const useRegister = () => {
//   const router = useRouter();

//   return useMutation({
//     mutationFn: async (data: { email: string; password: string }) => {
//       const res = await api.post('/auth/register', data);
//       return res.data;
//     },
//     onSuccess: () => {
//       router.push('/home/login');
//     },
//     onError: (error: any) => {
//       console.error('Registration failed:', error.response?.data?.message || error.message);
//     },
//   });
// };

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return () => {
    const token = localStorage.getItem('token');
    removeToken();
    queryClient.clear();
    router.push('/home');
  };
};