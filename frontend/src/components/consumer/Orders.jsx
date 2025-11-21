import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Grid,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
  Alert
} from '@mui/material'
import {
  ShoppingBag,
  MoreVert,
  LocalShipping,
  CheckCircle,
  Cancel,
  Schedule,
  Visibility
} from '@mui/icons-material'
import orderService from '../../services/orderService'

const Orders = () => {
  const [tabValue, setTabValue] = useState(0)
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch orders on component mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        setError(null)
        const statuses = ['processing', 'in-transit', 'delivered', 'cancelled']
        const status = statuses[tabValue] || undefined
        const data = await orderService.getOrders(0, 50, status)
        setOrders(Array.isArray(data) ? data : data.items || [])
      } catch (err) {
        setError(err.message || 'Failed to fetch orders')
        setOrders([])
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [tabValue])

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const handleMenuClick = (event, order) => {
    setAnchorEl(event.currentTarget)
    setSelectedOrder(order)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedOrder(null)
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'processing':
        return <Schedule color="warning" />
      case 'in-transit':
        return <LocalShipping color="info" />
      case 'delivered':
        return <CheckCircle color="success" />
      case 'cancelled':
        return <Cancel color="error" />
      default:
        return <Schedule />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'processing':
        return 'warning'
      case 'in-transit':
        return 'info'
      case 'delivered':
        return 'success'
      case 'cancelled':
        return 'error'
      default:
        return 'default'
    }
  }


  const renderOrderCard = (order) => (
    <Card key={order.id} sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" gutterBottom>
              Order #{order.id}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {order.supplierName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Ordered on {order.orderDate}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {getStatusIcon(order.status)}
            <Chip
              label={order.status.replace('-', ' ').toUpperCase()}
              color={getStatusColor(order.status)}
              size="small"
            />
            <IconButton
              size="small"
              onClick={(e) => handleMenuClick(e, order)}
            >
              <MoreVert />
            </IconButton>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <List dense>
          {order.items.map((item, index) => (
            <ListItem key={index} sx={{ py: 0.5 }}>
              <ListItemText
                primary={item.name}
                secondary={`${item.quantity} ${item.unit} × $${item.price}`}
              />
              <Typography variant="body2">
                ${(item.quantity * item.price).toFixed(2)}
              </Typography>
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              {order.deliveryDate}
            </Typography>
            {order.trackingNumber && (
              <Typography variant="body2" color="primary">
                Tracking: {order.trackingNumber}
              </Typography>
            )}
          </Box>
          <Typography variant="h6" color="primary">
            Total: ${order.totalAmount}
          </Typography>
        </Box>

        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Visibility />}
          >
            View Details
          </Button>
          {order.status === 'processing' && (
            <Button variant="outlined" size="small" color="error">
              Cancel Order
            </Button>
          )}
          {order.status === 'delivered' && (
            <Button variant="contained" size="small">
              Order Again
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  )

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        My Orders
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Processing" />
          <Tab label="In Transit" />
          <Tab label="Delivered" />
          <Tab label="Cancelled" />
        </Tabs>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && orders.length > 0 ? (
        orders.map(renderOrderCard)
      ) : !loading && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <ShoppingBag sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No orders found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {tabValue === 0 && 'You don\'t have any processing orders'}
            {tabValue === 1 && 'You don\'t have any in-transit orders'}
            {tabValue === 2 && 'You haven\'t completed any orders yet'}
            {tabValue === 3 && 'You haven\'t cancelled any orders'}
          </Typography>
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => window.location.href = '/consumer/search-items'}
          >
            Start Shopping
          </Button>
        </Box>
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>View Details</MenuItem>
        <MenuItem onClick={handleMenuClose}>Contact Supplier</MenuItem>
        <MenuItem onClick={handleMenuClose}>Download Invoice</MenuItem>
      </Menu>
    </Box>
  )
}

export default Orders
