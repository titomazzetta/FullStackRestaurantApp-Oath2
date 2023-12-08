/* /context/AppContext.js */
import React, { useState, useEffect } from "react"; // Import useEffect here
import { logout as authLogout } from './auth';
import { useSession } from "next-auth/react";
// Create auth context with default value
const AppContext = React.createContext({
  isAuthenticated: false, 
  cart: { items: [], total: 0 }, 
  addItem: () => {},
  removeItem: () => {},
  user: null, 
  setUser: () => {},
  logout: () => {}
});
export const AppProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState({ items: [], total: 0 });
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      setUser({ email: session.user.email, username: session.user.name });
      setIsAuthenticated(true);
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
  }, [session, status]);

  // Function to add item to the cart
  const addItem = (item) => {
    const updatedCart = { ...cart };
    const updatedItemIndex = updatedCart.items.findIndex(i => i.id === item.id);

    if (updatedItemIndex < 0) {
      updatedCart.items.push({ ...item, quantity: 1 });
    } else {
      const updatedItem = {
        ...updatedCart.items[updatedItemIndex]
      };
      updatedItem.quantity++;
      updatedCart.items[updatedItemIndex] = updatedItem;
    }

    

    updatedCart.total = updatedCart.items.reduce((total, currentItem) => {
      const itemTotal = currentItem.Price * currentItem.quantity;
    
      return total + itemTotal;
    }, 0);
    
  
    setCart(updatedCart);
  };
  //logout function

  const logout = () => {
    nextAuthSignOut(); // Sign out with next-auth
    setUser(null); // Clear user state in context
    setIsAuthenticated(false); // Update isA
    authLogout(); // This should trigger NextAuth.js signOut
    setUser(null); // Clear user state
    setCart({ items: [], total: 0 }); // Reset cart on logout
  };

  // Function to remove item from the cart
  const removeItem = (itemId) => {
    const updatedCart = { ...cart };
    const updatedItemIndex = updatedCart.items.findIndex(i => i.id === itemId);
  
    if (updatedItemIndex >= 0) {
      const updatedItem = { ...updatedCart.items[updatedItemIndex] };
      
      updatedItem.quantity--;
      
      if (updatedItem.quantity <= 0) {
        updatedCart.items.splice(updatedItemIndex, 1);
      } else {
        updatedCart.items[updatedItemIndex] = updatedItem;
      }
  
      updatedCart.total = updatedCart.items.reduce((total, currentItem) => {
        return total + currentItem.Price * currentItem.quantity;
      }, 0);
  
      setCart(updatedCart);
    }
  };


  return (
    <AppContext.Provider value={{ user, setUser, isAuthenticated, setIsAuthenticated, logout, cart, addItem, removeItem }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
