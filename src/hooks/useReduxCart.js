import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCart, addItemToCart, updateCartItemQuantity, removeItemFromCart, clearCart as clearCartAction } from '../redux/cartSlice';
import { useNotification } from '../components/NotificationProvider';

export const useReduxCart = () => {
  const dispatch = useDispatch();
  const { showNotification } = useNotification();
  
  const cart = useSelector((state) => state.cart.items);
  const total = useSelector((state) => state.cart.total);
  const status = useSelector((state) => state.cart.status);
  const error = useSelector((state) => state.cart.error);

  useEffect(() => {
    // Fetch cart data when the hook is first used
    dispatch(fetchCart());
  }, [dispatch]);

  const addItem = async (itemData) => {
    try {
      await dispatch(addItemToCart(itemData)).unwrap();
      showNotification('Item added to cart!', 'success');
    } catch (error) {
      showNotification('Failed to add item to cart.', 'error');
      console.error('Error adding item to cart:', error);
    }
  };

  const updateItem = async (itemId, quantity) => {
    try {
      await dispatch(updateCartItemQuantity({ itemId, quantity })).unwrap();
      showNotification('Cart updated!', 'success');
    } catch (error) {
      showNotification('Failed to update cart.', 'error');
      console.error('Error updating cart item:', error);
    }
  };

  const removeItem = async (itemId) => {
    try {
      await dispatch(removeItemFromCart(itemId)).unwrap();
      showNotification('Item removed from cart!', 'success');
    } catch (error) {
      showNotification('Failed to remove item from cart.', 'error');
      console.error('Error removing item from cart:', error);
    }
  };
  
  const clearCart = () => {
    try {
      dispatch(clearCartAction());
    } catch (error) {
      showNotification('Failed to clear cart.', 'error');
      console.error('Error clearing cart:', error);
    }
  };

  return {
    cart,
    total,
    loading: status === 'loading',
    error,
    addItem,
    updateItem,
    removeItem,
    clearCart
  };
};
