import { Routes, Route } from 'react-router-dom'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ProtectedRoute } from '@/components/ProtectedRoute'

// Pages
import { LandingPage } from '@/pages/LandingPage'
import LoginPage from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage'
import { ExplorePage } from '@/pages/products/ExplorePage'
import { ProductDetailPage } from '@/pages/products/ProductDetailPage'
import { ListItemPage } from '@/pages/products/ListItemPage'
import EditListingPage from '@/pages/products/EditListingPage'
import DashboardPage from '@/pages/dashboard/DashboardPage'
import MyListingsPage from '@/pages/dashboard/MyListingsPage'
import MyRequestsPage from '@/pages/dashboard/MyRequestsPage'
import IncomingRequestsPage from '@/pages/dashboard/IncomingRequestsPage'
import FavoritesPage from '@/pages/dashboard/FavoritesPage'
import InboxPage from '@/pages/messages/InboxPage'
import ConversationPage from '@/pages/messages/ConversationPage'
import NotificationsPage from '@/pages/dashboard/NotificationsPage'
import PublicProfilePage from '@/pages/profile/PublicProfilePage'
import SettingsPage from '@/pages/settings/SettingsPage'
import AdminDashboardPage from '@/pages/admin/AdminDashboardPage'
import AboutPage from '@/pages/static/AboutPage'
import HowItWorksPage from '@/pages/static/HowItWorksPage'
import CommunityGuidelinesPage from '@/pages/static/CommunityGuidelinesPage'
import PrivacyPage from '@/pages/static/PrivacyPage'
import TermsPage from '@/pages/static/TermsPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/community-guidelines" element={<CommunityGuidelinesPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/profile/:id" element={<PublicProfilePage />} />

          {/* Protected routes */}
          <Route path="/list-item" element={<ProtectedRoute><ListItemPage /></ProtectedRoute>} />
          <Route path="/products/:id/edit" element={<ProtectedRoute><EditListingPage /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          {/* /dashboard/* sub-routes — same pages, two URL patterns */}
          <Route path="/dashboard/my-listings" element={<ProtectedRoute><MyListingsPage /></ProtectedRoute>} />
          <Route path="/dashboard/my-requests" element={<ProtectedRoute><MyRequestsPage /></ProtectedRoute>} />
          <Route path="/dashboard/incoming-requests" element={<ProtectedRoute><IncomingRequestsPage /></ProtectedRoute>} />
          <Route path="/dashboard/favorites" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
          <Route path="/dashboard/messages" element={<ProtectedRoute><InboxPage /></ProtectedRoute>} />
          <Route path="/dashboard/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
          {/* Legacy flat routes — redirect-equivalent aliases */}
          <Route path="/my-listings" element={<ProtectedRoute><MyListingsPage /></ProtectedRoute>} />
          <Route path="/my-requests" element={<ProtectedRoute><MyRequestsPage /></ProtectedRoute>} />
          <Route path="/incoming-requests" element={<ProtectedRoute><IncomingRequestsPage /></ProtectedRoute>} />
          <Route path="/favorites" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
          <Route path="/messages" element={<ProtectedRoute><InboxPage /></ProtectedRoute>} />
          <Route path="/messages/:id" element={<ProtectedRoute><ConversationPage /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

          {/* Admin */}
          <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminDashboardPage /></ProtectedRoute>} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
