import React from 'react'
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
  ShoppingCart,
  Link,
  Chat,
  Star,
  Inventory,
  Business,
  AttachMoney
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../layout/DashboardLayout'

const mockStats = {
  activeOrders: 5,
  completedOrders: 23,
  linkedSuppliers: 8,
  unreadMessages: 3,
  totalSpent: 1247.50,
  avgRating: 4.6
}

const recentActivity = [
  { type: 'order', message: 'Order #1234 delivered', time: '2 hours ago' },
  { type: 'message', message: 'New message from Fresh Farms', time: '3 hours ago' },
  { type: 'link', message: 'Link request approved by Organic Goods', time: '1 day ago' },
]

const quickActions = [
  { title: 'Search Items', icon: <Inventory />, path: '/consumer/search-items', color: '#4CAF50' },
  { title: 'Find Suppliers', icon: <Business />, path: '/consumer/search-suppliers', color: '#2196F3' },
  { title: 'Send Link Request', icon: <Link />, path: '/consumer/link-requests', color: '#FF9800' },
  { title: 'View Orders', icon: <ShoppingCart />, path: '/consumer/orders', color: '#9C27B0' },
  { title: 'Chat', icon: <Chat />, path: '/consumer/chat', color: '#00BCD4' },
  { title: 'Checkout', icon: <AttachMoney />, path: '/consumer/checkout', color: '#795548' },
]

const ConsumerDashboard = () => {
  const navigate = useNavigate()

  return (
    <>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Welcome back, Consumer!
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Here's what's happening with your supply chain today
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <ShoppingCart />
                <Typography variant="h4" component="div">
                  {mockStats.activeOrders}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Active Orders
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white',
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(240, 147, 251, 0.3)'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <TrendingUp />
                <Typography variant="h4" component="div">
                  {mockStats.completedOrders}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Completed Orders
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white',
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(79, 172, 254, 0.3)'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Business />
                <Typography variant="h4" component="div">
                  {mockStats.linkedSuppliers}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Linked Suppliers
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            color: 'white',
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(250, 112, 154, 0.3)'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Chat />
                <Typography variant="h4" component="div">
                  {mockStats.unreadMessages}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Unread Messages
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions & Recent Activity */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 2, boxShadow: '0 2px 12px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                Quick Actions
              </Typography>
              <Grid container spacing={2}>
                {quickActions.map((action) => (
                  <Grid item xs={12} sm={6} md={4} key={action.title}>
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

        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 2, boxShadow: '0 2px 12px rgba(0,0,0,0.1)' }}>
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
                                     activity.type === 'message' ? '#2196F3' : '#FF9800'
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
        </Grid>
      </Grid>
      
    </>
  )
}

export default ConsumerDashboard
