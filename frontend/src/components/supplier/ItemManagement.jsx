import React, { useState } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  InputAdornment,
  Switch,
  FormControlLabel
} from '@mui/material'
import {
  Add,
  Edit,
  Delete,
  MoreVert,
  Inventory,
  Search,
  Category,
  AttachMoney,
  Visibility
} from '@mui/icons-material'

const mockItems = [
  {
    id: 1,
    name: 'Organic Tomatoes',
    description: 'Fresh organic tomatoes from local farm',
    category: 'Vegetables',
    price: 4.99,
    unit: 'kg',
    stock: 50,
    minOrder: 5,
    active: true,
    image: 'https://via.placeholder.com/80x80?text=Tomatoes',
    tags: ['Organic', 'Fresh', 'Local'],
    sku: 'ORG-TOM-001'
  },
  {
    id: 2,
    name: 'Whole Wheat Bread',
    description: 'Artisanal whole wheat bread',
    category: 'Bakery',
    price: 3.49,
    unit: 'loaf',
    stock: 20,
    minOrder: 2,
    active: true,
    image: 'https://via.placeholder.com/80x80?text=Bread',
    tags: ['Artisanal', 'Whole Wheat', 'Fresh'],
    sku: 'BAK-BRD-002'
  },
  {
    id: 3,
    name: 'Fresh Salmon',
    description: 'Wild-caught Atlantic salmon',
    category: 'Seafood',
    price: 12.99,
    unit: 'lb',
    stock: 15,
    minOrder: 2,
    active: false,
    image: 'https://via.placeholder.com/80x80?text=Salmon',
    tags: ['Wild Caught', 'Fresh', 'Premium'],
    sku: 'SEA-SAL-003'
  }
]

const categories = ['Vegetables', 'Fruits', 'Bakery', 'Seafood', 'Dairy', 'Meat']

const ItemManagement = () => {
  const [items, setItems] = useState(mockItems)
  const [openDialog, setOpenDialog] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    unit: '',
    stock: '',
    minOrder: '',
    active: true,
    tags: [],
    sku: ''
  })

  const handleAddItem = () => {
    setEditingItem(null)
    setFormData({
      name: '',
      description: '',
      category: '',
      price: '',
      unit: '',
      stock: '',
      minOrder: '',
      active: true,
      tags: [],
      sku: ''
    })
    setOpenDialog(true)
  }

  const handleEditItem = (item) => {
    setEditingItem(item)
    setFormData({
      name: item.name,
      description: item.description,
      category: item.category,
      price: item.price,
      unit: item.unit,
      stock: item.stock,
      minOrder: item.minOrder,
      active: item.active,
      tags: item.tags,
      sku: item.sku
    })
    setOpenDialog(true)
  }

  const handleSaveItem = () => {
    if (editingItem) {
      // Update existing item
      setItems(items.map(item =>
        item.id === editingItem.id
          ? { ...item, ...formData, price: parseFloat(formData.price), stock: parseInt(formData.stock), minOrder: parseInt(formData.minOrder) }
          : item
      ))
    } else {
      // Add new item
      const newItem = {
        id: Date.now(),
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        minOrder: parseInt(formData.minOrder),
        image: `https://via.placeholder.com/80x80?text=${formData.name.substring(0, 3).toUpperCase()}`
      }
      setItems([...items, newItem])
    }
    setOpenDialog(false)
  }

  const handleDeleteItem = (itemId) => {
    setItems(items.filter(item => item.id !== itemId))
    handleMenuClose()
  }

  const handleToggleActive = (itemId) => {
    setItems(items.map(item =>
      item.id === itemId
        ? { ...item, active: !item.active }
        : item
    ))
  }

  const handleMenuClick = (event, item) => {
    setAnchorEl(event.currentTarget)
    setSelectedItem(item)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedItem(null)
  }

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !filterCategory || item.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const getCategoryColor = (category) => {
    const colors = {
      'Vegetables': 'success',
      'Fruits': 'warning',
      'Bakery': 'info',
      'Seafood': 'primary',
      'Dairy': 'secondary',
      'Meat': 'error'
    }
    return colors[category] || 'default'
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Item Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddItem}
        >
          Add Item
        </Button>
      </Box>

      {/* Search and Filters */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              )
            }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              label="Category"
            >
              <MenuItem value="">All Categories</MenuItem>
              {categories.map(category => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={2}>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => {
              setSearchTerm('')
              setFilterCategory('')
            }}
          >
            Clear Filters
          </Button>
        </Grid>
      </Grid>

      {/* Items Grid */}
      <Grid container spacing={3}>
        {filteredItems.map(item => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card sx={{ height: '100%', position: 'relative' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  <Avatar
                    src={item.image}
                    alt={item.name}
                    sx={{ mr: 2, width: 60, height: 60 }}
                  >
                    <Inventory />
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {item.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      SKU: {item.sku}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                      <Chip
                        label={item.category}
                        color={getCategoryColor(item.category)}
                        size="small"
                      />
                      <Chip
                        label={item.active ? 'Active' : 'Inactive'}
                        color={item.active ? 'success' : 'default'}
                        size="small"
                      />
                    </Box>
                  </Box>
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuClick(e, item)}
                  >
                    <MoreVert />
                  </IconButton>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {item.description}
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Price:</Typography>
                  <Typography variant="body2" fontWeight="bold" color="primary">
                    ${item.price} / {item.unit}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Stock:</Typography>
                  <Typography variant="body2" color={item.stock > 10 ? 'success.main' : 'error.main'}>
                    {item.stock} {item.unit}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2">Min Order:</Typography>
                  <Typography variant="body2">
                    {item.minOrder} {item.unit}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                  {item.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      variant="outlined"
                      size="small"
                    />
                  ))}
                </Box>

                <FormControlLabel
                  control={
                    <Switch
                      checked={item.active}
                      onChange={() => handleToggleActive(item.id)}
                      size="small"
                    />
                  }
                  label="Active"
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredItems.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Inventory sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No items found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Try adjusting your search or filters
          </Typography>
        </Box>
      )}

      {/* Add/Edit Item Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingItem ? 'Edit Item' : 'Add New Item'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Item Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="SKU"
                value={formData.sku}
                onChange={(e) => setFormData({...formData, sku: e.target.value})}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  label="Category"
                >
                  {categories.map(category => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Price"
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>
                }}
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Unit"
                value={formData.unit}
                onChange={(e) => setFormData({...formData, unit: e.target.value})}
                placeholder="kg, lb, pcs, etc."
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Stock"
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({...formData, stock: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Minimum Order"
                type="number"
                value={formData.minOrder}
                onChange={(e) => setFormData({...formData, minOrder: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.active}
                    onChange={(e) => setFormData({...formData, active: e.target.checked})}
                  />
                }
                label="Active"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveItem} variant="contained">
            {editingItem ? 'Update' : 'Add'}
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
          handleEditItem(selectedItem)
          handleMenuClose()
        }}>
          <Edit sx={{ mr: 1 }} /> Edit
        </MenuItem>
        <MenuItem onClick={() => {
          handleDeleteItem(selectedItem.id)
        }}>
          <Delete sx={{ mr: 1 }} /> Delete
        </MenuItem>
        <MenuItem onClick={() => {
          handleMenuClose()
        }}>
          <Visibility sx={{ mr: 1 }} /> View Details
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default ItemManagement
