import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  total: 0,
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { id, size, quantity = 1 } = action.payload;
      const existingItem = state.items.find(item => item.id === id && item.size === size);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({ ...action.payload, quantity });
      }
      
      state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },
    updateQuantity: (state, action) => {
      const { id, size, quantity } = action.payload;
      const item = state.items.find(item => item.id === id && item.size === size);
      
      if (item) {
        item.quantity = quantity;
        if (quantity <= 0) {
          state.items = state.items.filter(item => !(item.id === id && item.size === size));
        }
      }
      
      state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },
    removeFromCart: (state, action) => {
      const { id, size } = action.payload;
      state.items = state.items.filter(item => !(item.id === id && item.size === size));
      state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },
  },
});

export const { addToCart, updateQuantity, removeFromCart } = cartSlice.actions;
export default cartSlice.reducer;
