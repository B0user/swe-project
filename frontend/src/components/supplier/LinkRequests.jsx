import React, { useState } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Tabs,
  Tab,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Divider,
  Chip
} from '@mui/material'
import {
  Person,
  Business,
  CheckCircle,
  Cancel,
  Schedule,
  MoreVert,
  Message,
  LocationOn,
  Star,
  Pending
} from '@mui/icons-material'
import avatarPlaceholder from '../../assets/avatar-placeholder.webp'

const mockLinkRequests = {
  pending: [
    {
      id: 1,
      consumerName: 'John Consumer',
      consumerEmail: 'john@email.com',
      consumerLocation: 'New York',
      requestDate: '2024-01-20',
      message: 'Interested in your organic vegetables for my restaurant',
      rating: 4.5,
      orderCount: 12,
      status: 'pending'
    },
    {
      id: 2,
      consumerName: 'Jane Smith',
      consumerEmail: 'jane@email.com',
      consumerLocation: 'California',
      requestDate: '2024-01-19',
      message: 'Looking for a reliable supplier for fresh produce',
      rating: 4.8,
      orderCount: 8,
      status: 'pending'
    },
    {
      id: 3,
      consumerName: 'Bob Johnson',
      consumerEmail: 'bob@email.com',
      consumerLocation: 'Texas',
      requestDate: '2024-01-18',
      message: 'Need regular supply for grocery store',
      rating: 4.2,
      orderCount: 25,
      status: 'pending'
    }
  ],
  approved: [
    {
      id: 4,
      consumerName: 'Alice Consumer',
      consumerEmail: 'alice@email.com',
      consumerLocation: 'Florida',
      requestDate: '2024-01-15',
      approvedDate: '2024-01-16',
      message: 'Happy with your products quality',
      rating: 4.9,
      orderCount: 18,
      status: 'approved'
    }
  ],
  rejected: [
    {
      id: 5,
      consumerName: 'Charlie Brown',
      consumerEmail: 'charlie@email.com',
      consumerLocation: 'Illinois',
      requestDate: '2024-01-10',
      rejectedDate: '2024-01-11',
      message: 'Looking for bulk supplies',
      rating: 3.5,
      orderCount: 3,
      status: 'rejected',
      rejectionReason: 'Minimum order requirements not met'
    }
  ]
}

const LinkRequests = () => {
  const [tabValue, setTabValue] = useState(0)
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [dialogType, setDialogType] = useState('') // 'approve', 'reject', 'message'
  const [rejectionReason, setRejectionReason] = useState('')
  const [message, setMessage] = useState('')

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const handleMenuClick = (event, request) => {
    setAnchorEl(event.currentTarget)
    setSelectedRequest(request)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedRequest(null)
  }

  const handleApprove = () => {
    setDialogType('approve')
    setOpenDialog(true)
  }

  const handleReject = () => {
    setDialogType('reject')
    setOpenDialog(true)
  }

  const handleMessage = () => {
    setDialogType('message')
    setOpenDialog(true)
  }

  const handleConfirmAction = () => {
    // In a real app, this would make API calls
    console.log(`${dialogType} request:`, selectedRequest.id)
    setOpenDialog(false)
    setRejectionReason('')
    setMessage('')
    handleMenuClose()
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Schedule color="warning" />
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

  const getRequestData = () => {
    switch (tabValue) {
      case 0:
        return mockLinkRequests.pending
      case 1:
        return mockLinkRequests.approved
      case 2:
        return mockLinkRequests.rejected
      default:
        return []
    }
  }

  const renderRequestCard = (request) => (
    <Card key={request.id} sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexGrow: 1 }}>
            <Avatar 
                    src={avatarPlaceholder}
                    alt={request.consumerName}
                    sx={{ mr: 2, width: 48, height: 48 }}
                  />
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6" gutterBottom>
                {request.consumerName}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <LocationOn sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                  {request.consumerLocation}
                </Typography>
                <Star sx={{ fontSize: 16, mr: 0.5, color: 'warning.main' }} />
                <Typography variant="body2" sx={{ mr: 2 }}>
                  {request.rating}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {request.orderCount} orders
                </Typography>
              </Box>
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {request.consumerEmail}
              </Typography>
              
              <Typography variant="body1" sx={{ mb: 2 }}>
                "{request.message}"
              </Typography>
              
              <Typography variant="caption" color="text.secondary">
                Requested: {request.requestDate}
                {request.approvedDate && ` • Approved: ${request.approvedDate}`}
                {request.rejectedDate && ` • Rejected: ${request.rejectedDate}`}
              </Typography>
              
              {request.rejectionReason && (
                <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                  Reason: {request.rejectionReason}
                </Typography>
              )}
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
            {getStatusIcon(request.status)}
            <Chip
              label={request.status.charAt(0).toUpperCase() + request.status.slice(1)}
              color={getStatusColor(request.status)}
              size="small"
              sx={{ ml: 1 }}
            />
            <IconButton
              size="small"
              onClick={(e) => handleMenuClick(e, request)}
              sx={{ ml: 1 }}
            >
              <MoreVert />
            </IconButton>
          </Box>
        </Box>
        
        {request.status === 'pending' && (
          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              color="success"
              size="small"
              onClick={() => {
                setSelectedRequest(request)
                handleApprove()
              }}
            >
              Approve
            </Button>
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => {
                setSelectedRequest(request)
                handleReject()
              }}
            >
              Reject
            </Button>
            <Button
              variant="outlined"
              size="small"
              startIcon={<Message />}
              onClick={() => {
                setSelectedRequest(request)
                handleMessage()
              }}
            >
              Message
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
          <Tab label={`Pending (${mockLinkRequests.pending.length})`} />
          <Tab label={`Approved (${mockLinkRequests.approved.length})`} />
          <Tab label={`Rejected (${mockLinkRequests.rejected.length})`} />
        </Tabs>
      </Box>

      {getRequestData().length > 0 ? (
        getRequestData().map(renderRequestCard)
      ) : (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Business sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No {tabValue === 0 ? 'pending' : tabValue === 1 ? 'approved' : 'rejected'} requests
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {tabValue === 0 && 'No new link requests to review'}
            {tabValue === 1 && 'No approved requests yet'}
            {tabValue === 2 && 'No rejected requests'}
          </Typography>
        </Box>
      )}

      {/* Action Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {dialogType === 'approve' && 'Approve Link Request'}
          {dialogType === 'reject' && 'Reject Link Request'}
          {dialogType === 'message' && 'Send Message'}
        </DialogTitle>
        <DialogContent>
          {dialogType === 'approve' && (
            <Typography>
              Are you sure you want to approve the link request from {selectedRequest?.consumerName}?
            </Typography>
          )}
          
          {dialogType === 'reject' && (
            <Box>
              <Typography gutterBottom>
                Please provide a reason for rejecting this request:
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter rejection reason..."
              />
            </Box>
          )}
          
          {dialogType === 'message' && (
            <Box>
              <Typography gutterBottom>
                Send a message to {selectedRequest?.consumerName}:
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={handleConfirmAction}
            variant="contained"
            color={dialogType === 'reject' ? 'error' : 'primary'}
            disabled={dialogType === 'reject' && !rejectionReason.trim()}
          >
            {dialogType === 'approve' && 'Approve'}
            {dialogType === 'reject' && 'Reject'}
            {dialogType === 'message' && 'Send'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          handleApprove()
          handleMenuClose()
        }}>
          <CheckCircle sx={{ mr: 1 }} /> Approve
        </MenuItem>
        <MenuItem onClick={() => {
          handleReject()
          handleMenuClose()
        }}>
          <Cancel sx={{ mr: 1 }} /> Reject
        </MenuItem>
        <MenuItem onClick={() => {
          handleMessage()
          handleMenuClose()
        }}>
          <Message sx={{ mr: 1 }} /> Send Message
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default LinkRequests
