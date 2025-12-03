import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { DispatchProvider } from '@/contexts/DispatchContext';
import routes from './routes';

function ProtectedRoute({ children, requiresAuth }: { children: React.ReactNode; requiresAuth?: boolean }) {
  const { isAuthenticated } = useAuth();

  if (requiresAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!requiresAuth && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <DispatchProvider>
          <Toaster position="top-right" />
          <Routes>
            {routes.map((route, index) => (
              <Route
                key={index}
                path={route.path}
                element={
                  <ProtectedRoute requiresAuth={route.requiresAuth}>
                    {route.element}
                  </ProtectedRoute>
                }
              />
            ))}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </DispatchProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
