import React, { useState } from 'react'
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
  ListItemIcon,
  Avatar,
  Divider
} from '@mui/material'
import {
  PersonAdd,
  Business,
  Schedule,
  CheckCircle,
  Cancel,
  Pending
} from '@mui/icons-material'

const mockLinkRequests = {
  sent: [
    {
      id: 1,
      supplierName: 'Green Farms',
      supplierLocation: 'California',
      status: 'pending',
      sentDate: '2024-01-15',
      message: 'Interested in your organic vegetables'
    },
    {
      id: 2,
      supplierName: 'Bakery Co',
      supplierLocation: 'New York',
      status: 'approved',
      sentDate: '2024-01-10',
      message: 'Would like to order bread regularly'
    },
    {
      id: 3,
      supplierName: 'Seafood Direct',
      supplierLocation: 'Seattle',
      status: 'rejected',
      sentDate: '2024-01-08',
      message: 'Looking for seafood supplier'
    }
  ],
  received: [
    {
      id: 4,
      supplierName: 'Dairy Fresh',
      supplierLocation: 'Texas',
      status: 'pending',
      receivedDate: '2024-01-16',
      message: 'We would like to connect with you'
    }
  ]
}

const LinkRequests = () => {
  const [tabValue, setTabValue] = useState(0)

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Pending color="warning" />
      case 'approved':
        return <CheckCircle color="success" />
      case 'rejected':
        return <Cancel color="error" />
      default:
        return <Schedule />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning'
      case 'approved':
        return 'success'
      case 'rejected':
        return 'error'
      default:
        return 'default'
    }
  }

  const renderRequestCard = (request) => (
    <Card key={request.id} sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
            <Business />
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6">{request.supplierName}</Typography>
            <Typography variant="body2" color="text.secondary">
              {request.supplierLocation}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {getStatusIcon(request.status)}
            <Chip
              label={request.status.charAt(0).toUpperCase() + request.status.slice(1)}
              color={getStatusColor(request.status)}
              size="small"
              sx={{ ml: 1 }}
            />
          </Box>
        </Box>
        
        <Typography variant="body2" gutterBottom>
          {request.message}
        </Typography>
        
        <Typography variant="caption" color="text.secondary">
          {request.sentDate ? `Sent: ${request.sentDate}` : `Received: ${request.receivedDate}`}
        </Typography>
        
        {request.status === 'pending' && (
          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
            <Button variant="outlined" size="small">
              Withdraw
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  )

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Link Requests
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Sent Requests" />
          <Tab label="Received Requests" />
        </Tabs>
      </Box>

      {tabValue === 0 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Requests You've Sent
          </Typography>
          {mockLinkRequests.sent.length > 0 ? (
            mockLinkRequests.sent.map(renderRequestCard)
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography color="text.secondary">
                You haven't sent any link requests yet.
              </Typography>
            </Box>
          )}
        </Box>
      )}

      {tabValue === 1 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Requests You've Received
          </Typography>
          {mockLinkRequests.received.length > 0 ? (
            mockLinkRequests.received.map(renderRequestCard)
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography color="text.secondary">
                No received link requests.
              </Typography>
            </Box>
          )}
        </Box>
      )}
    </Box>
  )
}

export default LinkRequests
