import { HStack,
    VStack,
    Box,
    Image,
    Text,
    Button,
    Grid,
    Spacer,
    Spinner,
  useMediaQuery, 
  Alert,
  Flex} from '@chakra-ui/react'
  import React, { useEffect, useState } from 'react'
  import {useNavigate } from "react-router-dom";
  import { useAlertContext } from '../context/alertContext';
  import axios from "axios";
  import TrackOrder from './TrackOrder';

  function OrderDetails() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const url = process.env.REACT_APP_API_URL;
  const [orderDetails,setOrderDetails] = useState([])
  const [alert, setAlert] = useState(null);
  const {onOpen, onClose} = useAlertContext();
  const months = {
    0: 'January',
    1: 'February',
    2: 'March',
    3: 'April',
    4: 'May',
    5: 'June',
    6: 'July',
    7: 'August',
    8: 'September',
    9: 'October',
    10: 'November',
    11: 'December'
};
  const fetchOrder = async () => {
    try {
    let response = await axios.post(`${url}/getOrder`,
    null,
    {
      headers: {
        'auth-token': localStorage.getItem('authToken') 
      },
    })
    if(response.data.success){
      setOrderDetails(response.data.order)
    }else{
      console.log("Something went wrong: ", response.data.message)
    }
    } catch (error) {
      console.error(error.message)
    }finally {
      setLoading(false)
    }
  };

  useEffect(() => {
  
  fetchOrder();
  },[])  
  

  
  return (
    <VStack minH="100vh"  bgColor="#E7E9EC" spacing={4} paddingTop={20} paddingBottom={6} paddingLeft={{base:2,md:5}} paddingRight={{base:2,md:5}}>
         {loading ? (
        <HStack w="100vw" h="92vh" justifyContent="center">
          <Spinner size="xl" />
        </HStack>
      ) : orderDetails.length === 0 ? (
        <HStack w="100vw" h="92vh" justifyContent="center">
          <Text>Orders information will be displayed here </Text>
        </HStack>
      ) :orderDetails && orderDetails.map((order) => (
        <Box key={order._id} boxShadow="lg" p={{base:4,md:6}} borderRadius="md" w={{base:'100%',md:'75%'}}  bgColor="#FFFFFF">
          {/* Order Details */}
          <HStack alignItems="center" justifyContent="space-around">
            <Box> <Text fontSize="lg" fontWeight="bold">
            Order #{order._id}
          </Text>
          <Text>Name: {order.name}</Text>
          <Text>Email: {order.email}</Text>
          <Text>Phone: {order.phone}</Text>
          <Text>Address: {order.address}</Text>
          <Text fontWeight='500'> Ordered on: {new Date(order.createdAt).getDate() +" "+months[new Date(order.createdAt).getMonth()]}</Text> 
          {isMobile&&<TrackOrder status={order.status}/>}
          {/* 
          <Text>Phone: {order.phone}</Text>
          <Text>Email: {order.email}</Text>
          <Text>Address: {order.address}</Text>
          <Text>Payment Method: {order.paymentMethod}</Text>
          <Text>Total Products Price: ${order.itemTotal}</Text>
          <Text>Shipping: ${order.shipping}</Text>
          <Text>Grand Total: ${order.grandTotal}</Text>
          */}

          <Box mt={4}>
            {order.products.map((product) => (
              <HStack key={product._id} spacing={4} align="center">
                <Image src={product.image} alt={product.name} boxSize="50px" objectFit="cover" borderRadius="md" />
                <Box>
                  <Text>{product.name}</Text>
                  <Text>Quantity: x{product.quantity}</Text>
                  <Text fontWeight="bold" color="rgb(213, 77, 77)">Rs.{product.price}</Text>
                </Box>
              </HStack>
            ))}
          </Box>
          <Text  mt={4} fontWeight="bold" color="rgb(213, 77, 77)">Grand Total: Rs.{order.grandTotal}</Text>
          </Box>
          <Box>
          {!isMobile&&<TrackOrder status={order.status}/>}
          </Box>
          </HStack>
        </Box>
      ))}
    </VStack>
  );
  }

export default OrderDetails