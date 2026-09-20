import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Public Components
import Header from './components/Header';
import Home from './pages/Home';
import About from './pages/About';
import Articles from './pages/Articles';
import Contact from './pages/Contact';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import RouteScrollToTop from './components/RouteScrollToTop';
import ArticleDetail from './pages/ArticleDetail';

// Admin Components
import Login from './pages/admin/Login';
import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import EditProfile from './pages/admin/EditProfile';
import ArticleManager from './pages/admin/ArticleManager';

const Portfolio = () => (
  <div className="app-container">
    <div className="ambient-bg" aria-hidden="true">
      <div className="ambient-orb ambient-orb--1" />
      <div className="ambient-orb ambient-orb--2" />
      <div className="ambient-orb ambient-orb--3" />
    </div>
    <Header />
    <main>
      <section id="home">
        <Home />
      </section>
      <section id="about">
        <About />
      </section>
      <section id="articles">
        <Articles />
      </section>
      <section id="contact">
        <Contact />
      </section>
    </main>
    <ScrollToTop />
    <Footer />
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Toaster position="bottom-center" richColors />
      <RouteScrollToTop />
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Portfolio />} />
        <Route path="/article/:id" element={<ArticleDetail />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<Login />} />

        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} /> {/* Default to Dashboard */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<EditProfile />} />
          <Route path="articles" element={<ArticleManager />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
