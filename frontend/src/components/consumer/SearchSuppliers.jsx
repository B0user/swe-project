import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Chip,
  Avatar,
  Rating,
  InputAdornment,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material'
import {
  Search,
  Business,
  Star,
  LocationOn,
  Phone,
  Email,
  Send
} from '@mui/icons-material'
import avatarPlaceholder from '../../assets/business-avatar-placeholder.webp'
import supplierService from '../../services/supplierService'
import { useAuth } from '../../contexts/AuthContext'

const SearchSuppliers = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const { user } = useAuth()

  // Fetch suppliers on component mount and when search term changes
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await supplierService.getSuppliers(0, 50, undefined, searchTerm || undefined)
        setSuppliers(Array.isArray(data) ? data : data.items || [])
      } catch (err) {
        setError(err.message || 'Failed to fetch suppliers')
        setSuppliers([])
      } finally {
        setLoading(false)
      }
    }

    fetchSuppliers()
  }, [searchTerm])

  const handleSendLinkRequest = async (supplierId) => {
    if (!user) {
      setError('Please login to send link requests')
      return
    }

    try {
      await supplierService.sendLinkRequest(supplierId, user.id, 'I would like to connect')
      setSuccessMessage('Link request sent successfully!')
    } catch (err) {
      setError(err.message || 'Failed to send link request')
    }
  }

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.description.toLowerCase().includes(searchTerm.toLowerCase())
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
                <Search />
              </InputAdornment>
            )
          }}
          sx={{ mb: 3 }}
        />
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

      {!loading && filteredSuppliers.length > 0 && (
        <Grid container spacing={3}>
          {filteredSuppliers.map(supplier => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={supplier.id}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar 
                      src={avatarPlaceholder}
                      alt={supplier.name}
                      sx={{ mr: 2, width: 48, height: 48 }}
                    />
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
                    <Rating value={supplier.rating || 0} precision={0.1} readOnly size="small" />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      ({supplier.review_count || 0} reviews)
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" color="primary" gutterBottom>
                    Response time: {supplier.response_time || 'N/A'}
                  </Typography>
                  
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<Send />}
                    onClick={() => handleSendLinkRequest(supplier.id)}
                  >
                    Send Link Request
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {!loading && filteredSuppliers.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No suppliers found matching your search.
          </Typography>
        </Box>
      )}

      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage(null)}
        message={successMessage}
      />
    </Box>
  )
}

export default SearchSuppliers
