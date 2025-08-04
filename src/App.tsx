import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { AuthProvider } from './lib/context/AuthContext'
import { LanguageProvider } from './lib/context/LanguageContext'
import { LandingPage } from './pages/LandingPage'
import { HowItWorksPage } from './pages/HowItWorksPage'
import { PricingPage } from './pages/PricingPage'
import { HelpPage } from './pages/HelpPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { AdminLoginPage } from './pages/AdminLoginPage'
import { AdminDashboard } from './pages/AdminDashboard'
import { TeacherHomePage } from './pages/TeacherHomePage'
import { TeacherDashboard } from './pages/TeacherDashboard'
import { TeacherInvitationsPage } from './pages/TeacherInvitationsPage'
import { SchoolHomePage } from './pages/SchoolHomePage'
import { SchoolDashboard } from './pages/SchoolDashboard'
import { TeacherApplications } from './pages/TeacherApplications'
import { SchoolApplications } from './pages/SchoolApplications'
import { SchoolReplacementsHistory } from './pages/SchoolReplacementsHistory'
import { PendingApprovalPage } from './pages/PendingApprovalPage'
import { AdminRoute } from './components/auth/AdminRoute'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { AccountPage } from './pages/AccountPage'
import { MessagesPage } from './pages/MessagesPage'
import { TeacherGuidePage } from './pages/TeacherGuidePage'
import { LegalPage } from './pages/LegalPage'
import { TermsPage } from './pages/TermsPage'
import { SchoolsListPage } from './pages/SchoolsListPage'
import { SchoolProfilePage } from './pages/SchoolProfilePage'

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin-login" element={<AdminLoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/pending-approval" element={<PendingApprovalPage />} />
          <Route path="/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
          <Route path="/messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
          <Route path="/teacher-guide" element={<TeacherGuidePage />} />
          <Route path="/legal" element={<LegalPage />} />
          <Route path="/terms" element={<TermsPage />} />
          
          {/* Routes protégées pour les remplaçants */}
          <Route
            path="/teacher-home"
            element={
              <ProtectedRoute>
                <TeacherHomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher-dashboard"
            element={
              <ProtectedRoute>
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher-applications"
            element={
              <ProtectedRoute>
                <TeacherApplications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher-invitations"
            element={
              <ProtectedRoute>
                <TeacherInvitationsPage />
              </ProtectedRoute>
            }
          />

          {/* Routes protégées pour les écoles */}
          <Route
            path="/school-home"
            element={
              <ProtectedRoute>
                <SchoolHomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school-dashboard"
            element={
              <ProtectedRoute>
                <SchoolDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school-applications"
            element={
              <ProtectedRoute>
                <SchoolApplications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school-history"
            element={
              <ProtectedRoute>
                <SchoolReplacementsHistory />
              </ProtectedRoute>
            }
          />

          {/* Routes pour la liste des écoles */}
          <Route
            path="/schools"
            element={
              <ProtectedRoute>
                <SchoolsListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/schools/:id"
            element={
              <ProtectedRoute>
                <SchoolProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Route protégée pour l'admin */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
        </Routes>
        </Layout>
      </AuthProvider>
    </LanguageProvider>
  )
}