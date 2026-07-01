'use client';

import { useLogout } from '../../hooks/useAuth';
import SystemsHub from "./components/SystemsHub/SystemsHub";
import ProtectedRoute from '../routes/ProtectedRoute';

export default function AdminPage() {
  const logout = useLogout();

  return (
    <ProtectedRoute>
    <div className="px-8">
      <SystemsHub />
    </div>
    </ProtectedRoute>
  );
}