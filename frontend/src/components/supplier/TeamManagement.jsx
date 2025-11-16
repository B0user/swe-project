import React, { useState } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select
} from '@mui/material'
import {
  Add,
  PersonAdd,
  MoreVert,
  Edit,
  Delete,
  Visibility,
  AdminPanelSettings,
  Inventory,
  LocalShipping,
  Assignment
} from '@mui/icons-material'
import avatarPlaceholder from '../../assets/avatar-placeholder.webp'

const mockTeamMembers = [
  {
    id: 1,
    name: 'Alice Manager',
    email: 'alice@company.com',
    role: 'Manager',
    department: 'Operations',
    status: 'Active',
    joinDate: '2023-01-15',
    permissions: ['Manage Items', 'View Orders', 'Manage Team']
  },
  {
    id: 2,
    name: 'Bob Sales',
    email: 'bob@company.com',
    role: 'Sales Person',
    department: 'Sales',
    status: 'Active',
    joinDate: '2023-03-20',
    permissions: ['View Items', 'Manage Orders', 'Chat with Customers']
  },
  {
    id: 3,
    name: 'Carol Sales',
    email: 'carol@company.com',
    role: 'Sales Person',
    department: 'Sales',
    status: 'Active',
    joinDate: '2023-06-10',
    permissions: ['View Items', 'Manage Orders', 'Chat with Customers']
  },
  {
    id: 4,
    name: 'David Manager',
    email: 'david@company.com',
    role: 'Manager',
    department: 'Finance',
    status: 'Inactive',
    joinDate: '2022-11-01',
    permissions: ['View Reports', 'Manage Pricing', 'Approve Orders']
  }
]

const TeamManagement = () => {
  const [teamMembers, setTeamMembers] = useState(mockTeamMembers)
  const [openDialog, setOpenDialog] = useState(false)
  const [editingMember, setEditingMember] = useState(null)
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedMember, setSelectedMember] = useState(null)
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Sales Person',
    department: 'Sales',
    permissions: []
  })

  const handleAddMember = () => {
    setEditingMember(null)
    setFormData({
      name: '',
      email: '',
      role: 'Sales Person',
      department: 'Sales',
      permissions: []
    })
    setOpenDialog(true)
  }

  const handleEditMember = (member) => {
    setEditingMember(member)
    setFormData({
      name: member.name,
      email: member.email,
      role: member.role,
      department: member.department,
      permissions: member.permissions
    })
    setOpenDialog(true)
  }

  const handleSaveMember = () => {
    if (editingMember) {
      // Update existing member
      setTeamMembers(teamMembers.map(member =>
        member.id === editingMember.id
          ? { ...member, ...formData }
          : member
      ))
    } else {
      // Add new member
      const newMember = {
        id: Date.now(),
        ...formData,
        status: 'Active',
        joinDate: new Date().toISOString().split('T')[0]
      }
      setTeamMembers([...teamMembers, newMember])
    }
    setOpenDialog(false)
  }

  const handleDeleteMember = (memberId) => {
    setTeamMembers(teamMembers.filter(member => member.id !== memberId))
    handleMenuClose()
  }

  const handleMenuClick = (event, member) => {
    setAnchorEl(event.currentTarget)
    setSelectedMember(member)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedMember(null)
  }

  const getRoleIcon = (role) => {
    switch (role) {
      case 'Manager':
        return <SupervisorAccount />
      case 'Sales Person':
        return <Person />
      default:
        return <Business />
    }
  }

  const getRoleColor = (role) => {
    switch (role) {
      case 'Manager':
        return 'primary'
      case 'Sales Person':
        return 'secondary'
      default:
        return 'default'
    }
  }

  const getStatusColor = (status) => {
    return status === 'Active' ? 'success' : 'error'
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Team Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<PersonAdd />}
          onClick={handleAddMember}
        >
          Add Team Member
        </Button>
      </Box>

      <Grid container spacing={3}>
        {teamMembers.map(member => (
          <Grid item xs={12} sm={6} md={4} key={member.id}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar 
                    src={avatarPlaceholder}
                    alt={member.name}
                    sx={{ mr: 2, width: 48, height: 48 }}
                  />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6">{member.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {member.email}
                    </Typography>
                  </Box>
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuClick(e, member)}
                  >
                    <MoreVert />
                  </IconButton>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <Chip
                    label={member.role}
                    color={getRoleColor(member.role)}
                    size="small"
                  />
                  <Chip
                    label={member.status}
                    color={getStatusColor(member.status)}
                    size="small"
                  />
                </Box>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Department: {member.department}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Joined: {member.joinDate}
                </Typography>

                <Typography variant="body2" gutterBottom>
                  <strong>Permissions:</strong>
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {member.permissions.map((permission, index) => (
                    <Chip
                      key={index}
                      label={permission}
                      variant="outlined"
                      size="small"
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add/Edit Member Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingMember ? 'Edit Team Member' : 'Add Team Member'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  label="Role"
                >
                  <MenuItem value="Sales Person">Sales Person</MenuItem>
                  <MenuItem value="Manager">Manager</MenuItem>
                  <MenuItem value="Owner">Owner</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Department</InputLabel>
                <Select
                  value={formData.department}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                  label="Department"
                >
                  <MenuItem value="Sales">Sales</MenuItem>
                  <MenuItem value="Operations">Operations</MenuItem>
                  <MenuItem value="Finance">Finance</MenuItem>
                  <MenuItem value="Marketing">Marketing</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveMember} variant="contained">
            {editingMember ? 'Update' : 'Add'}
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
          handleEditMember(selectedMember)
          handleMenuClose()
        }}>
          <Edit sx={{ mr: 1 }} /> Edit
        </MenuItem>
        <MenuItem onClick={() => {
          handleDeleteMember(selectedMember.id)
        }}>
          <Delete sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default TeamManagement
