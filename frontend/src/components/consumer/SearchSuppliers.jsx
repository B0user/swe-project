import React, { useState } from 'react'
import {
  Box,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Avatar,
  Rating,
  InputAdornment
} from '@mui/material'
import {
  Search as SearchIcon,
  Business,
  LocationOn,
  Send
} from '@mui/icons-material'

const mockSuppliers = [
  {
    id: 1,
    name: 'Green Farms',
    description: 'Organic vegetables and fruits supplier',
    location: 'California',
    rating: 4.5,
    reviewCount: 128,
    categories: ['Vegetables', 'Fruits', 'Organic'],
    verified: true,
    responseTime: '2 hours'
  },
  {
    id: 2,
    name: 'Bakery Co',
    description: 'Artisanal breads and pastries',
    location: 'New York',
    rating: 4.8,
    reviewCount: 89,
    categories: ['Bakery', 'Bread', 'Pastries'],
    verified: true,
    responseTime: '1 hour'
  },
  {
    id: 3,
    name: 'Seafood Direct',
    description: 'Fresh seafood from sustainable sources',
    location: 'Seattle',
    rating: 4.7,
    reviewCount: 156,
    categories: ['Seafood', 'Fish', 'Sustainable'],
    verified: false,
    responseTime: '4 hours'
  }
]

const SearchSuppliers = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [suppliers] = useState(mockSuppliers)

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.categories.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Search Suppliers
        </Typography>
        
        <TextField
          fullWidth
          placeholder="Search for suppliers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
          sx={{ mb: 3 }}
        />
      </Box>

      <Grid container spacing={3}>
        {filteredSuppliers.map(supplier => (
          <Grid item xs={12} md={6} lg={4} key={supplier.id}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                    <Business />
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="h2">
                      {supplier.name}
                      {supplier.verified && (
                        <Chip
                          label="Verified"
                          size="small"
                          color="primary"
                          sx={{ ml: 1 }}
                        />
                      )}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocationOn sx={{ fontSize: 14, mr: 0.5 }} />
                      <Typography variant="body2" color="text.secondary">
                        {supplier.location}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {supplier.description}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Rating value={supplier.rating} precision={0.1} readOnly size="small" />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    ({supplier.reviewCount} reviews)
                  </Typography>
                </Box>
                
                <Typography variant="body2" color="primary" gutterBottom>
                  Response time: {supplier.responseTime}
                </Typography>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                  {supplier.categories.map(category => (
                    <Chip
                      key={category}
                      label={category}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Box>
                
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Send />}
                >
                  Send Link Request
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredSuppliers.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No suppliers found matching your search.
          </Typography>
        </Box>
      )}
    </Box>
  )
}

export default SearchSuppliers
