import {createContext, useState, useContext} from 'react';

const OrderContext = createContext(undefined);

export const OrderProvider = ({children})=>{
    const [state, setState] = useState();

    return (
    <OrderContext.Provider 
    value={{
    state, 
    setOrder:(value)=>setState(value)
    }}>
        {children}
    </OrderContext.Provider>
    );
}

export const useOrderContext = () => useContext(OrderContext)