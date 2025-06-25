import { useSelector, useDispatch } from 'react-redux';
import { fetchOrders, fetchOrderById, submitOrder } from '../redux/ordersSlice';
import { useNotification } from '../components/NotificationProvider';

export const useReduxOrders = () => {
  const dispatch = useDispatch();
  const { showNotification } = useNotification();
  
  const orders = useSelector((state) => state.orders.orders);
  const currentOrder = useSelector((state) => state.orders.currentOrder);
  const status = useSelector((state) => state.orders.status);
  const error = useSelector((state) => state.orders.error);

  const getOrders = async () => {
    try {
      // This will return an empty array for now until getOrders is implemented in the API
      await dispatch(fetchOrders()).unwrap();
      showNotification('Order history feature coming soon!', 'info');
    } catch (error) {
      showNotification('Failed to fetch orders.', 'error');
      console.error('Error fetching orders:', error);
    }
  };

  const getOrderById = async (orderId) => {
    try {
      await dispatch(fetchOrderById(orderId)).unwrap();
    } catch (error) {
      showNotification('Failed to fetch order details.', 'error');
      console.error('Error fetching order details:', error);
    }
  };

  const createOrder = async (orderData) => {
    try {
      const result = await dispatch(submitOrder(orderData)).unwrap();
      showNotification('Order placed successfully!', 'success');
      return result;
    } catch (error) {
      showNotification('Failed to place order.', 'error');
      console.error('Error placing order:', error);
      throw error;
    }
  };

  return {
    orders,
    currentOrder,
    loading: status === 'loading',
    error,
    getOrders,
    getOrderById,
    createOrder
  };
};
