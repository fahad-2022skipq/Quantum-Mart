import Footer from './Components/Footer';
import NavBar from './Components/NavBar';
import Product from './Components/Product';
import Login from './Components/Login';
import Register from './Components/Register';
import Alert from './Components/Alert';
import Order from './Components/Order';
import Cart from './Components/Cart';
import ProductDetail from './Components/ProductDetail';
import MyOrders from './Components/MyOrders';
import Orders from './Components/Admin/Orders'
import Home from './Components/Admin/Home';
import AddProduct from './Components/Admin/AddProduct';
import AdminNavBar from './Components/Admin/Navbar';
import Search from './Components/Search';

import { Route, Routes, useLocation } from "react-router-dom";
import { AlertProvider } from "./context/alertContext";
import { UserProvider } from './context/userContext';
import { OrderProvider } from './context/orderContext';
import { CartProvider } from './context/cartContext';

function App() {
  const location = useLocation();

  // Check if the current route is for admin
  const isAdminRoute = location.pathname.startsWith("/admin");
  return (
    <>
    <UserProvider>
    <OrderProvider>
    <CartProvider>
    {isAdminRoute ? <AdminNavBar /> : <NavBar/>}
    <AlertProvider>
    <Alert/>
    <Routes>
     <Route exact path="/" element={<Login/>}></Route>
     <Route exact path="/register" element={<Register/>}></Route>
     <Route exact path="/products" element={<Product/>}></Route>
     <Route exact path="/products/:id" element={<ProductDetail/>}></Route>
     <Route exact path="/search/:query" element={<Search/>}></Route>
     <Route exact path="/order" element={<Order/>}></Route>
     <Route exact path="/cart" element={<Cart/>}></Route>
     <Route exact path="/myorders" element={<MyOrders/>}></Route>
     <Route exact path="/Admin" element={<Home/>}></Route>
     <Route exact path="/AdminAddProduct" element={<AddProduct/>}></Route>
     <Route exact path="/AdminOrders" element={<Orders/>}></Route>
    </Routes>  
    {!isAdminRoute ? <Footer/> : <></>}
    </AlertProvider>
    </CartProvider>
    </OrderProvider>
    </UserProvider>
    </>
  );
}

export default App;
