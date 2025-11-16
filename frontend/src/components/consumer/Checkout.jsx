import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  TextField,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Stepper,
  Step,
  StepLabel,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material'
import {
  ShoppingCart,
  LocalShipping,
  Payment,
  CheckCircle,
  Add,
  Remove,
  Delete
} from '@mui/icons-material'

const mockCartItems = [
  {
    id: 1,
    name: 'Organic Tomatoes',
    supplier: 'Green Farms',
    price: 4.99,
    quantity: 5,
    unit: 'kg',
    image: 'https://via.placeholder.com/60x60?text=Tomatoes'
  },
  {
    id: 2,
    name: 'Whole Wheat Bread',
    supplier: 'Bakery Co',
    price: 3.49,
    quantity: 2,
    unit: 'loaves',
    image: 'https://via.placeholder.com/60x60?text=Bread'
  },
  {
    id: 3,
    name: 'Fresh Salmon',
    supplier: 'Seafood Direct',
    price: 12.99,
    quantity: 3,
    unit: 'lb',
    image: 'https://via.placeholder.com/60x60?text=Salmon'
  }
]

const Checkout = () => {
  const [activeStep, setActiveStep] = useState(0)
  const [cartItems, setCartItems] = useState(mockCartItems)
  const [shippingInfo, setShippingInfo] = useState({
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: ''
  })
  const [paymentMethod, setPaymentMethod] = useState('')
  const navigate = useNavigate()

  const steps = ['Cart', 'Shipping', 'Payment', 'Review']

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1)
    }
  }

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1)
    }
  }

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity === 0) {
      setCartItems(cartItems.filter(item => item.id !== itemId))
    } else {
      setCartItems(cartItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      ))
    }
  }

  const removeItem = (itemId) => {
    setCartItems(cartItems.filter(item => item.id !== itemId))
  }

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  }

  const calculateTax = () => {
    return calculateSubtotal() * 0.08 // 8% tax
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() + 5.99 // $5.99 shipping
  }

  const handlePlaceOrder = () => {
    // Simulate order placement
    setTimeout(() => {
      navigate('/consumer/orders')
    }, 2000)
  }

  const renderCartStep = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <Typography variant="h6" gutterBottom>
          Shopping Cart ({cartItems.length} items)
        </Typography>
        
        {cartItems.map(item => (
          <Card key={item.id} sx={{ mb: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar
                  src={item.image}
                  alt={item.name}
                  sx={{ mr: 2, width: 60, height: 60 }}
                />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6">{item.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.supplier}
                  </Typography>
                  <Typography variant="body2" color="primary">
                    ${item.price} / {item.unit}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton
                    size="small"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <Remove />
                  </IconButton>
                  <Typography sx={{ minWidth: 30, textAlign: 'center' }}>
                    {item.quantity}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Add />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => removeItem(item.id)}
                  >
                    <Delete />
                  </IconButton>
                </Box>
                <Typography variant="h6" sx={{ ml: 2, minWidth: 80, textAlign: 'right' }}>
                  ${(item.price * item.quantity).toFixed(2)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
        
        {cartItems.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="text.secondary">
              Your cart is empty
            </Typography>
            <Button
              variant="contained"
              sx={{ mt: 2 }}
              onClick={() => navigate('/consumer/search-items')}
            >
              Continue Shopping
            </Button>
          </Box>
        )}
      </Grid>
      
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Subtotal</Typography>
                <Typography>${calculateSubtotal().toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Tax</Typography>
                <Typography>${calculateTax().toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Shipping</Typography>
                <Typography>$5.99</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6" color="primary">
                  ${calculateTotal().toFixed(2)}
                </Typography>
              </Box>
            </Box>
            <Button
              fullWidth
              variant="contained"
              onClick={handleNext}
              disabled={cartItems.length === 0}
            >
              Proceed to Shipping
            </Button>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )

  const renderShippingStep = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <Typography variant="h6" gutterBottom>
          Shipping Information
        </Typography>
        <Card>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Street Address"
                  value={shippingInfo.address}
                  onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="City"
                  value={shippingInfo.city}
                  onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="State"
                  value={shippingInfo.state}
                  onChange={(e) => setShippingInfo({...shippingInfo, state: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="ZIP Code"
                  value={shippingInfo.zipCode}
                  onChange={(e) => setShippingInfo({...shippingInfo, zipCode: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={shippingInfo.phone}
                  onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            <Typography variant="h4" color="primary">
              ${calculateTotal().toFixed(2)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Including tax and shipping
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )

  const renderPaymentStep = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <Typography variant="h6" gutterBottom>
          Payment Method
        </Typography>
        <Card>
          <CardContent>
            <FormControl fullWidth>
              <InputLabel>Select Payment Method</InputLabel>
              <Select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                label="Select Payment Method"
              >
                <MenuItem value="credit-card">Credit Card</MenuItem>
                <MenuItem value="debit-card">Debit Card</MenuItem>
                <MenuItem value="paypal">PayPal</MenuItem>
                <MenuItem value="bank-transfer">Bank Transfer</MenuItem>
              </Select>
            </FormControl>
            
            {paymentMethod && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Payment details will be collected in the final step
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            <Typography variant="h4" color="primary">
              ${calculateTotal().toFixed(2)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )

  const renderReviewStep = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Review Your Order
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Order Items
                </Typography>
                {cartItems.map(item => (
                  <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>
                      {item.name} × {item.quantity} {item.unit}
                    </Typography>
                    <Typography>${(item.price * item.quantity).toFixed(2)}</Typography>
                  </Box>
                ))}
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6">Total</Typography>
                  <Typography variant="h6" color="primary">
                    ${calculateTotal().toFixed(2)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Shipping Address
                </Typography>
                <Typography>
                  {shippingInfo.address}<br />
                  {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}<br />
                  {shippingInfo.phone}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Ready to Place Order?
                </Typography>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handlePlaceOrder}
                  startIcon={<CheckCircle />}
                >
                  Place Order
                </Button>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  By placing this order, you agree to our terms and conditions
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Checkout
      </Typography>
      
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {activeStep === 0 && renderCartStep()}
      {activeStep === 1 && renderShippingStep()}
      {activeStep === 2 && renderPaymentStep()}
      {activeStep === 3 && renderReviewStep()}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button
          onClick={handleBack}
          disabled={activeStep === 0}
        >
          Back
        </Button>
        
        {activeStep < 3 && activeStep > 0 && (
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={activeStep === 2 && !paymentMethod}
          >
            Next
          </Button>
        )}
      </Box>
    </Box>
  )
}

export default Checkout
