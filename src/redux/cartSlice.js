import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { getCart, createCart, addToCart as apiAddToCart, updateCartItem, removeCartItem } from '../services/api';

// Async thunks for API calls
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      // Check if we have a sessionId in localStorage
      let sessionId = localStorage.getItem('cartSessionId');
      
      if (!sessionId) {
        // If no sessionId, create a new one
        sessionId = uuidv4();
        localStorage.setItem('cartSessionId', sessionId);
        
        // Create a new cart in the backend
        await createCart(sessionId);
      }
      
      // Get the cart data
      const cartData = await getCart(sessionId);
      return cartData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addItemToCart = createAsyncThunk(
  'cart/addItemToCart',
  async (itemData, { rejectWithValue }) => {
    try {
      const sessionId = localStorage.getItem('cartSessionId');
      console.log('Session ID:', sessionId);
      if (!sessionId) {
        throw new Error('No cart session found');
      }
      
      // Extract the productAttributePriceId and quantity from itemData
      const { productAttributePriceId, quantity = 1 } = itemData;
      console.log('Product Attribute Price ID:', productAttributePriceId);
      console.log('Quantity:', quantity);
      
      // Call the API function with the correct parameters
      const response = await apiAddToCart(sessionId, productAttributePriceId, quantity);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCartItemQuantity = createAsyncThunk(
  'cart/updateCartItemQuantity',
  async ({ itemId, quantity }, { rejectWithValue }) => {
    try {
      const sessionId = localStorage.getItem('cartSessionId');
      if (!sessionId) {
        throw new Error('No cart session found');
      }
      
      console.log('Updating cart item quantity:', { itemId, quantity });
      const response = await updateCartItem(sessionId, itemId, { quantity });
      console.log('Cart update response:', response);
      return response;
    } catch (error) {
      console.error('Error updating cart item quantity:', error);
      return rejectWithValue(error.message);
    }
  }
);

export const removeItemFromCart = createAsyncThunk(
  'cart/removeItemFromCart',
  async (itemId, { rejectWithValue }) => {
    try {
      const sessionId = localStorage.getItem('cartSessionId');
      if (!sessionId) {
        throw new Error('No cart session found');
      }
      
      console.log('Removing item from cart:', { itemId });
      const response = await removeCartItem(sessionId, itemId);
      console.log('Remove item response:', response);
      return response; // Return the updated cart data
    } catch (error) {
      console.error('Error removing item from cart:', error);
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  items: [],
  total: 0,
  sessionId: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchCart
      .addCase(fetchCart.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.items || [];
        state.total = action.payload.total || 0;
        state.sessionId = action.payload.sessionId;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Handle addItemToCart
      .addCase(addItemToCart.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addItemToCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.items || [];
        state.total = action.payload.total || 0;
      })
      .addCase(addItemToCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Handle updateCartItemQuantity
      .addCase(updateCartItemQuantity.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.items || [];
        state.total = action.payload.total || 0;
      })
      .addCase(updateCartItemQuantity.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Handle removeItemFromCart
      .addCase(removeItemFromCart.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(removeItemFromCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Make sure we're using the populated items from the response
        state.items = action.payload.items || [];
        // Calculate the total based on the items
        state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      })
      .addCase(removeItemFromCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
