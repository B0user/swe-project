import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Container, Box } from '@mui/material'

// Auth Components
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'

// Layout Components
import DashboardLayout from './components/layout/DashboardLayout'

// Consumer Components
import ConsumerDashboard from './components/consumer/Dashboard'
import SearchItems from './components/consumer/SearchItems'
import SearchSuppliers from './components/consumer/SearchSuppliers'
import LinkRequests from './components/consumer/LinkRequests'
import Chat from './components/consumer/Chat'
import Orders from './components/consumer/Orders'
import Checkout from './components/consumer/Checkout'

// Supplier Components
import SupplierDashboard from './components/supplier/Dashboard'
import TeamManagement from './components/supplier/TeamManagement'
import ItemManagement from './components/supplier/ItemManagement'
import SupplierLinkRequests from './components/supplier/LinkRequests'

// Context for user authentication
import { AuthProvider } from './contexts/AuthContext'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Consumer Routes with Layout */}
          <Route path="/consumer/*" element={
            <DashboardLayout userType="consumer">
              <Routes>
                <Route path="dashboard" element={<ConsumerDashboard />} />
                <Route path="search-items" element={<SearchItems />} />
                <Route path="search-suppliers" element={<SearchSuppliers />} />
                <Route path="link-requests" element={<LinkRequests />} />
                <Route path="chat" element={<Chat />} />
                <Route path="orders" element={<Orders />} />
                <Route path="checkout" element={<Checkout />} />
              </Routes>
            </DashboardLayout>
          } />
          
          {/* Supplier Routes with Layout */}
          <Route path="/supplier/*" element={
            <DashboardLayout userType="supplier">
              <Routes>
                <Route path="dashboard" element={<SupplierDashboard />} />
                <Route path="team" element={<TeamManagement />} />
                <Route path="items" element={<ItemManagement />} />
                <Route path="link-requests" element={<SupplierLinkRequests />} />
              </Routes>
            </DashboardLayout>
          } />
          
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
