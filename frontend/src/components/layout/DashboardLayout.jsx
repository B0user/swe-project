import React, { useState } from 'react'
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Avatar,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery
} from '@mui/material'
import {
  Menu as MenuIcon,
  Person,
  Logout,
  Settings,
  ChevronLeft
} from '@mui/icons-material'
import avatarPlaceholder from '../../assets/avatar-placeholder.webp'
import businessAvatarPlaceholder from '../../assets/business-avatar-placeholder.webp'
import { useAuth } from '../../contexts/AuthContext'
import Sidebar from './Sidebar'

const drawerWidth = 280

const DashboardLayout = ({ children, userType }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [anchorEl, setAnchorEl] = useState(null)
  const { user, logout } = useAuth()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleProfileMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    logout()
    handleProfileMenuClose()
  }

  // Auto-close sidebar on mobile
  React.useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false)
    }
  }, [isMobile])

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar
        userType={userType}
        user={user}
        open={sidebarOpen}
        onToggle={handleSidebarToggle}
      />
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: sidebarOpen ? `calc(100% - ${drawerWidth}px)` : 'calc(100% - 80px)',
          transition: 'width 0.3s ease',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        }}
      >
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            background: 'white',
            borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Toolbar>
            <IconButton
              edge="start"
              onClick={handleSidebarToggle}
              sx={{ mr: 2, color: 'text.primary' }}
            >
              {sidebarOpen ? <ChevronLeft /> : <Menu />}
            </IconButton>
            
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'text.primary' }}>
              {userType === 'consumer' ? 'Consumer Dashboard' : 'Supplier Dashboard'}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Welcome, {user?.name}
              </Typography>
              
              <IconButton
                onClick={handleProfileMenuOpen}
                sx={{ p: 0 }}
              >
                <Avatar 
                  src={userType === 'supplier' ? businessAvatarPlaceholder : avatarPlaceholder}
                  alt="User Avatar"
                  sx={{ 
                    width: 32, 
                    height: 32,
                    border: '1px solid rgba(0, 0, 0, 0.1)'
                  }}
                />
              </IconButton>
              
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleProfileMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem onClick={handleProfileMenuClose}>
                  <Person sx={{ mr: 2 }} /> Profile
                </MenuItem>
                <MenuItem onClick={handleProfileMenuClose}>
                  <Settings sx={{ mr: 2 }} /> Settings
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <Logout sx={{ mr: 2 }} /> Logout
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>
        
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      </Box>
    </Box>
  )
}

export default DashboardLayout
