import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  IconButton,
  InputAdornment
} from '@mui/material'
import {
  Search as SearchIcon,
  ShoppingCart,
  Star,
  LocationOn
} from '@mui/icons-material'

const mockItems = [
  {
    id: 1,
    name: 'Organic Tomatoes',
    description: 'Fresh organic tomatoes from local farm',
    price: 4.99,
    unit: 'kg',
    supplier: 'Green Farms',
    rating: 4.5,
    location: 'California',
    image: 'https://placehold.co/200x150?text=Tomatoes',
    category: 'Vegetables'
  },
  {
    id: 2,
    name: 'Whole Wheat Bread',
    description: 'Artisanal whole wheat bread',
    price: 3.49,
    unit: 'loaf',
    supplier: 'Bakery Co',
    rating: 4.8,
    location: 'New York',
    image: 'https://placehold.co/200x150?text=Bread',
    category: 'Bakery'
  },
  {
    id: 3,
    name: 'Fresh Salmon',
    description: 'Wild-caught Atlantic salmon',
    price: 12.99,
    unit: 'lb',
    supplier: 'Seafood Direct',
    rating: 4.7,
    location: 'Seattle',
    image: 'https://placehold.co/200x150?text=Salmon',
    category: 'Seafood'
  }
]

const SearchItems = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [items] = useState(mockItems)
  const navigate = useNavigate()

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Box className="min-h-screen bg-gray-50 p-6">
      <Box sx={{ mb: 4 }} className="mb-8">
        <Typography variant="h4" component="h1" gutterBottom className="font-bold text-gray-900 mb-6">
          Search Items
        </Typography>
        
        <TextField
          fullWidth
          placeholder="Search for items..."
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
          className="mb-4"
        />

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }} className="flex gap-2 flex-wrap mb-6">
          {['Vegetables', 'Bakery', 'Seafood', 'Dairy', 'Fruits'].map(category => (
            <Chip
              key={category}
              label={category}
              variant="outlined"
              clickable
              onClick={() => setSearchTerm(category)}
              className="hover:bg-blue-100 hover:border-blue-300 transition-colors"
            />
          ))}
        </Box>
      </Box>

      <Grid container spacing={3} className="gap-6">
        {filteredItems.map(item => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }} className="hover:shadow-lg transition-shadow duration-300 rounded-lg">
              <CardMedia
                component="img"
                height="150"
                image={item.image}
                alt={item.name}
                className="rounded-t-lg"
              />
              <CardContent sx={{ flexGrow: 1 }} className="p-4">
                <Typography variant="h6" component="h2" gutterBottom className="font-semibold text-gray-800">
                  {item.name}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" gutterBottom className="text-gray-600 mb-3">
                  {item.description}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }} className="mb-2">
                  <Typography variant="h6" color="primary" sx={{ mr: 1 }} className="text-green-600 font-bold">
                    ${item.price}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" className="text-gray-500">
                    /{item.unit}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }} className="mb-3">
                  <Star sx={{ fontSize: 16, color: 'warning.main', mr: 0.5 }} />
                  <Typography variant="body2" sx={{ mr: 2 }} className="text-gray-700">
                    {item.rating}
                  </Typography>
                  <LocationOn sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
                  <Typography variant="body2" color="text.secondary" className="text-gray-500">
                    {item.location}
                  </Typography>
                </Box>
                
                <Typography variant="body2" color="primary" gutterBottom className="text-blue-600 font-medium mb-3">
                  {item.supplier}
                </Typography>
                
                <Chip
                  label={item.category}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
                
                <Button
                  variant="contained"
                  startIcon={<ShoppingCart />}
                  fullWidth
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredItems.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }} className="text-center py-16">
          <Typography variant="h6" color="text.secondary" className="text-gray-500 text-lg">
            No items found matching your search.
          </Typography>
        </Box>
      )}
    </Box>
  )
}

export default SearchItems
