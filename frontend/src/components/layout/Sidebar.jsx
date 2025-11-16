import React, { useState } from 'react'
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Divider,
  Avatar,
  Tooltip
} from '@mui/material'
import {
  Dashboard,
  Search,
  Business,
  Link,
  Chat,
  ShoppingCart,
  Inventory,
  People,
  MenuOpen,
  Menu,
  ChevronLeft,
  Person
} from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'

const drawerWidth = 280

const menuItems = {
  consumer: [
    { text: 'Dashboard', icon: <Dashboard />, path: '/consumer/dashboard' },
    { text: 'Search Items', icon: <Search />, path: '/consumer/search-items' },
    { text: 'Search Suppliers', icon: <Business />, path: '/consumer/search-suppliers' },
    { text: 'Link Requests', icon: <Link />, path: '/consumer/link-requests' },
    { text: 'Chat', icon: <Chat />, path: '/consumer/chat' },
    { text: 'Orders', icon: <ShoppingCart />, path: '/consumer/orders' },
  ],
  supplier: [
    { text: 'Dashboard', icon: <Dashboard />, path: '/supplier/dashboard' },
    { text: 'Team Management', icon: <People />, path: '/supplier/team' },
    { text: 'Item Management', icon: <Inventory />, path: '/supplier/items' },
    { text: 'Link Requests', icon: <Link />, path: '/supplier/link-requests' },
  ]
}

const Sidebar = ({ userType, user, open, onToggle }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const handleNavigation = (path) => {
    navigate(path)
  }

  const currentMenuItems = menuItems[userType] || []

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      open={open}
      sx={{
        width: open ? drawerWidth : 80,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? drawerWidth : 80,
          boxSizing: 'border-box',
          borderRight: '1px solid rgba(0, 0, 0, 0.12)',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          transition: 'width 0.3s ease',
          overflowX: 'hidden',
        },
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {open && (
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
              Supply Chain
            </Typography>
          )}
          <IconButton
            onClick={onToggle}
            sx={{ color: 'white' }}
          >
            {open ? <ChevronLeft /> : <Menu />}
          </IconButton>
        </Box>

        <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />

        {/* User Profile */}
        {user && (
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'secondary.main' }}>
              <Person />
            </Avatar>
            {open && (
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  {user.name}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  {user.email}
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', opacity: 0.6 }}>
                  {userType === 'consumer' ? 'Consumer' : 'Supplier'}
                </Typography>
              </Box>
            )}
          </Box>
        )}

        <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />

        {/* Navigation Menu */}
        <List sx={{ flex: 1, py: 1 }}>
          {currentMenuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <Tooltip title={item.text} placement="right" arrow>
                <ListItemButton
                  onClick={() => handleNavigation(item.path)}
                  selected={location.pathname === item.path}
                  sx={{
                    mx: 1,
                    borderRadius: 1,
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.3)',
                      },
                      '& .MuiListItemIcon-root': {
                        color: 'white',
                      },
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: 'rgba(255, 255, 255, 0.8)', minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  {open && (
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{
                        fontSize: '0.9rem',
                        fontWeight: location.pathname === item.path ? 'bold' : 'normal'
                      }}
                    />
                  )}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          ))}
        </List>

        {/* Footer */}
        <Box sx={{ p: 2, mt: 'auto' }}>
          {open && (
            <Typography variant="caption" sx={{ opacity: 0.6, textAlign: 'center', display: 'block' }}>
              Version 1.0.0
            </Typography>
          )}
        </Box>
      </Box>
    </Drawer>
  )
}

export default Sidebar
