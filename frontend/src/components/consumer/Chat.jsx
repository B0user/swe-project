import React, { useState } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  InputAdornment,
  Paper,
  IconButton
} from '@mui/material'
import {
  Send,
  Business,
  Search
} from '@mui/icons-material'

const mockConversations = [
  {
    id: 1,
    supplierName: 'Green Farms',
    lastMessage: 'Your order has been shipped!',
    timestamp: '2 hours ago',
    unread: 2,
    messages: [
      { id: 1, sender: 'supplier', text: 'Hello! How can we help you today?', timestamp: '10:00 AM' },
      { id: 2, sender: 'consumer', text: 'I\'d like to place an order for organic tomatoes', timestamp: '10:05 AM' },
      { id: 3, sender: 'supplier', text: 'Great! How many kilograms would you like?', timestamp: '10:06 AM' },
      { id: 4, sender: 'consumer', text: 'I need about 5kg for this week', timestamp: '10:08 AM' },
      { id: 5, sender: 'supplier', text: 'Perfect! Your order has been shipped!', timestamp: '10:10 AM' }
    ]
  },
  {
    id: 2,
    supplierName: 'Bakery Co',
    lastMessage: 'Thanks for your order!',
    timestamp: '1 day ago',
    unread: 0,
    messages: [
      { id: 1, sender: 'supplier', text: 'Welcome to Bakery Co!', timestamp: 'Yesterday' },
      { id: 2, sender: 'consumer', text: 'I\'m interested in your whole wheat bread', timestamp: 'Yesterday' },
      { id: 3, sender: 'supplier', text: 'Thanks for your order!', timestamp: 'Yesterday' }
    ]
  }
]

const Chat = () => {
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [newMessage, setNewMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredConversations = mockConversations.filter(conv =>
    conv.supplierName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedConversation) {
      // In a real app, this would send the message to the backend
      console.log('Sending message:', newMessage)
      setNewMessage('')
    }
  }

  return (
    <Box sx={{ height: '80vh', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Messages
      </Typography>

      <Box sx={{ flexGrow: 1, display: 'flex', gap: 2, minHeight: 0 }}>
        {/* Conversations List */}
        <Paper sx={{ width: 300, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <TextField
              fullWidth
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="small" />
                  </InputAdornment>
                )
              }}
            />
          </Box>
          
          <List sx={{ flexGrow: 1, overflow: 'auto' }}>
            {filteredConversations.map(conversation => (
              <ListItem
                key={conversation.id}
                button
                selected={selectedConversation?.id === conversation.id}
                onClick={() => setSelectedConversation(conversation)}
                sx={{ borderBottom: 1, borderColor: 'divider' }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <Business />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
                        {conversation.supplierName}
                      </Typography>
                      {conversation.unread > 0 && (
                        <Box
                          sx={{
                            bgcolor: 'primary.main',
                            color: 'white',
                            borderRadius: '50%',
                            width: 20,
                            height: 20,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.75rem'
                          }}
                        >
                          {conversation.unread}
                        </Box>
                      )}
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" sx={{ 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {conversation.lastMessage}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {conversation.timestamp}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Paper>

        {/* Chat Area */}
        <Paper sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          {selectedConversation ? (
            <>
              <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="h6">
                  {selectedConversation.supplierName}
                </Typography>
              </Box>
              
              <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
                {selectedConversation.messages.map(message => (
                  <Box
                    key={message.id}
                    sx={{
                      display: 'flex',
                      justifyContent: message.sender === 'consumer' ? 'flex-end' : 'flex-start',
                      mb: 2
                    }}
                  >
                    <Paper
                      sx={{
                        p: 2,
                        maxWidth: '70%',
                        bgcolor: message.sender === 'consumer' ? 'primary.main' : 'grey.200',
                        color: message.sender === 'consumer' ? 'white' : 'text.primary'
                      }}
                    >
                      <Typography variant="body2">
                        {message.text}
                      </Typography>
                      <Typography variant="caption" sx={{ opacity: 0.7 }}>
                        {message.timestamp}
                      </Typography>
                    </Paper>
                  </Box>
                ))}
              </Box>
              
              <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                <TextField
                  fullWidth
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  InputProps={{
                    endAdornment: (
                      <IconButton onClick={handleSendMessage} color="primary">
                        <Send />
                      </IconButton>
                    )
                  }}
                />
              </Box>
            </>
          ) : (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                color: 'text.secondary'
              }}
            >
              <Typography>
                Select a conversation to start messaging
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  )
}

export default Chat
