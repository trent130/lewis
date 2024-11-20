import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';

// Layout
import Layout from './components/layout/Layout';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Support from './pages/Support';
import Donate from './pages/Donate';
import Forum from './pages/Forum';
import Events from './pages/Events';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import Dashboard from './pages/dashboard/Dashboard';

// Auth Guards
import { AuthGuard } from './components/auth/AuthGuard';
import { RequireAuth } from './components/auth/RequireAuth';

// Context
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/support" element={<Support />} />
              <Route path="/donate" element={<Donate />} />
              <Route path="/forum" element={<Forum />} />
              <Route path="/events" element={<Events />} />

              {/* Auth routes - redirect to dashboard if authenticated */}
              <Route
                path="/login"
                element={
                  <AuthGuard>
                    <Login />
                  </AuthGuard>
                }
              />
              <Route
                path="/register"
                element={
                  <AuthGuard>
                    <Register />
                  </AuthGuard>
                }
              />
              <Route
                path="/forgot-password"
                element={
                  <AuthGuard>
                    <ForgotPassword />
                  </AuthGuard>
                }
              />

              {/* Protected routes - require authentication */}
              <Route
                path="/dashboard/*"
                element={
                  <RequireAuth>
                    <Dashboard />
                  </RequireAuth>
                }
              />

              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
