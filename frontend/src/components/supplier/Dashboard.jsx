import React, { useState, useEffect, useContext } from 'react'
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Paper,
  LinearProgress
} from '@mui/material'
import {
  TrendingUp,
  Inventory,
  People,
  Link,
  AttachMoney,
  Star,
  Business,
  ShoppingCart,
  Message
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

import DashboardLayout from '../layout/DashboardLayout'
import dashboardService from '../../services/dashboardService'

const mockStats = {
  totalItems: 45,
  activeOrders: 12,
  teamMembers: 8,
  pendingRequests: 3,
  totalRevenue: 8450.75,
  avgRating: 4.8
}

const mockRecentActivity = [
  { type: 'order', message: 'New order received from Consumer Co', time: '1 hour ago' },
  { type: 'link', message: 'Link request from Fresh Market', time: '2 hours ago' },
  { type: 'team', message: 'New team member joined', time: '3 hours ago' },
]

const quickActions = [
  { title: 'Manage Items', icon: <Inventory />, path: '/supplier/items', color: '#4CAF50' },
  { title: 'Team Management', icon: <People />, path: '/supplier/team', color: '#2196F3' },
  { title: 'Link Requests', icon: <Link />, path: '/supplier/link-requests', color: '#FF9800' },
]

const mockRecentOrders = [
  { id: '#ORD-001', customer: 'Consumer Co', amount: 245.50, status: 'processing' },
  { id: '#ORD-002', customer: 'Fresh Market', amount: 189.00, status: 'shipped' },
  { id: '#ORD-003', customer: 'Local Store', amount: 412.75, status: 'pending' },
]

const SupplierDashboard = () => {
  const navigate = useNavigate()
  
  const { user } = useAuth()
  const [stats, setStats] = useState(mockStats)
  const [recentActivity, setRecentActivity] = useState(mockRecentActivity)
  const [recentOrders, setRecentOrders] = useState(mockRecentOrders)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch dashboard data on component mount and when user changes
  useEffect(() => {
    if (user && user.id) {
      fetchDashboardData()
    }
  }, [user])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      if (!user || !user.id) {
        throw new Error('User not authenticated')
      }
      const data = await dashboardService.getSupplierDashboard(user.id)
      setStats(data.stats || {})
      setRecentActivity(data.recentActivity || [])
      setRecentOrders(data.recentOrders || [])
    } catch (err) {
      setError(err.message)
      console.error('Failed to fetch dashboard data:', err)
      // Fallback to mock data if API fails
      setStats(mockStats)
      setRecentActivity(mockRecentActivity)
      setRecentOrders(mockRecentOrders)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'processing': return '#FF9800'
      case 'shipped': return '#4CAF50'
      case 'pending': return '#2196F3'
      default: return '#757575'
    }
  }

  return (
    <>
      {loading && <LinearProgress />}
      {error && (
        <Box sx={{ mb: 2, p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
          <Typography color="error">Error: {error}</Typography>
        </Box>
      )}
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Welcome back, Supplier!
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Here's what's happening with your business today
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Inventory />
                <Typography variant="h4" component="div">
                  {stats.totalItems || 0}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Total Items
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white',
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(240, 147, 251, 0.3)'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <ShoppingCart />
                <Typography variant="h4" component="div">
                  {stats.activeOrders || 0}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Active Orders
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white',
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(79, 172, 254, 0.3)'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <People />
                <Typography variant="h4" component="div">
                  {stats.teamMembers || 0}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Team Members
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            color: 'white',
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(250, 112, 154, 0.3)'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Link />
                <Typography variant="h4" component="div">
                  {stats.pendingRequests || 0}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Pending Requests
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions & Recent Activity */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ borderRadius: 2, boxShadow: '0 2px 12px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                Quick Actions
              </Typography>
              <Grid container spacing={2}>
                {quickActions.map((action) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={action.title}>
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={() => navigate(action.path)}
                      sx={{
                        p: 2,
                        height: '100%',
                        display: 'block',
                        textAlign: 'center',
                        gap: 1,
                        textTransform: 'none',
                        borderRadius: 2,
                        border: `2px solid ${action.color}20`,
                        '&:hover': {
                          backgroundColor: `${action.color}10`,
                          borderColor: action.color,
                        }
                      }}
                    >
                      <Box sx={{ color: action.color, fontSize: 32, mb: 1 }}>
                        {action.icon}
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        {action.title}
                      </Typography>
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ borderRadius: 2, boxShadow: '0 2px 12px rgba(0,0,0,0.1)', mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                Recent Activity
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {recentActivity.map((activity, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ 
                      width: 8, 
                      height: 8, 
                      borderRadius: '50%',
                      backgroundColor: activity.type === 'order' ? '#4CAF50' : 
                                     activity.type === 'link' ? '#2196F3' : '#FF9800'
                    }} />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                        {activity.message}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {activity.time}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 2, boxShadow: '0 2px 12px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                Recent Orders
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {recentOrders.map((order) => (
                  <Box key={order.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        {order.id}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {order.customer}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        ${order.amount}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: getStatusColor(order.status),
                          textTransform: 'capitalize'
                        }}
                      >
                        {order.status}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  )
}

export default SupplierDashboard
