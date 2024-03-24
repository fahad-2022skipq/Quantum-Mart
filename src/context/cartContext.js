import {createContext, useState, useContext} from 'react';

const CartContext = createContext(undefined);

export const CartProvider = ({children})=>{
    const [cart, setCart] = useState({});

    return (
    <CartContext.Provider 
    value={{
    cart, 
    setState:(value)=>setCart(value)
    }}>
        {children}
    </CartContext.Provider>
    );
}

export const useCartContext = () => useContext(CartContext)