import React, { useEffect, useState } from 'react'
import { Box, Text, VStack, Image, Flex, Spacer, HStack, FormControl, FormErrorMessage, Input, Button, Heading,useMediaQuery } from '@chakra-ui/react'
import { useLocation, useNavigate } from 'react-router-dom';
import { useFormik } from "formik";
import { orderSchema } from "../ValidationSchemas";
import axios from 'axios';
import { useAlertContext } from '../context/alertContext';
function Order() {

  const url = process.env.REACT_APP_API_URL;
  const location = useLocation();
  const {order} = location.state || null;
  const {cartId} = location.state || null;
  const {onOpen, onClose} = useAlertContext();
  const navigate = useNavigate();
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const [user, setUser] = useState();
  const shipping = 200;

  const placeOrder = async(orderDetails) =>{
    try{
      console.log(orderDetails)
      const response = await axios.post(url+'/placeOrder', orderDetails)
      if(response.data.success){
        onOpen("success", "Order Placed successfully"); 
      setTimeout(() => {
      onClose();
      navigate('/products')
    },2000)
    } else {
      onOpen('', 'Something went wrong'); 
      setTimeout(() => {
      onClose();
    },2000)
      }
    }
    catch(error){
      console.log(error.message);
    }
  }


  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      address: "",
      phone: ""
    },
    onSubmit: (values) => {
      const orderArray = []
      order.map((val)=>{
        console.log(val)
        orderArray.push({productId:val.id, quantity:val.quantity, price:val.salePrice})
      })

      const orderDetails = {
        cartId,
        userId:user._id,
        ...values,
        products:orderArray,
        paymentMethod: "COD", 
        itemTotal:calculatePrice(),
        shipping:shipping,
        grandTotal:calculatePrice()+shipping
        }
     
      placeOrder(orderDetails)
    },
    validationSchema: orderSchema
  });

  const setInitialFormValues = () => {
    formik.setValues({
      name: user?.firstName || "",
      email: user?.email || "",
      address: user?.address || "",
      phone: ""
    });
  };

  const calculatePrice = () =>{
    return order.reduce((total, order) => total + (order.salePrice*order.quantity), 0);
  }

  const getUser = async() =>{
    try {
      let response = await axios.post(url+'/getUser',{},{
        headers:{
        'Content-Type':'application/json',
        "auth-token": localStorage.getItem('authToken')
      }
      });
      if(response.data.success){
        setUser(response.data.user)
      }
    } catch (error) {
      console.log(error.message)
    }
  }
  
  useEffect(() =>{
    getUser();
  }, [])

  useEffect(() => {
    if (user) {
      setInitialFormValues();
    }
  }, [user]);

  return (
    order && (
      <>
        {isMobile ? (
          <VStack minHeight="92vh" align="flex-start" bgColor="#E7E9EC" paddingTop={100} spacing={4} paddingLeft={4} paddingRight={4} pb={4} >
            {/* Order Summary */}
            <VStack width="100%" marginBottom={4}>
              <Heading marginBottom={4}>Order Summary</Heading>
              {order.map((order, index) => (
                <Box
                  key={index}
                  display="flex"
                  alignItems="center"
                  padding="10px"
                  border="1px solid #ddd"
                  borderRadius="4px"
                  backgroundColor="white"
                  marginBottom="10px"
                  width="100%"
                >
                  <Image padding={2} src={order.image} alt={order.name} boxSize="70px" objectFit="cover" />
                  <Flex direction="column">
                    <Text fontSize="lg" noOfLines={1}>{order.name}</Text>
                    <Text>x{order.quantity}</Text>
                    <Text color="rgb(213, 77, 77)">Rs.{order.salePrice}</Text>
                  </Flex>
                </Box>
              ))}
            </VStack>
  
            {/* Form Section */}
            <Box width="100%">
              <form onSubmit={formik.handleSubmit}>
                <VStack width="100%" spacing={4}>
                  <FormControl isInvalid={(formik.touched.name && formik.errors.name)} borderRadius="md" padding="5px">
                    <Input {...formik.getFieldProps('name')} placeholder="Name" borderWidth="1px" borderColor="gray.300" />
                    <FormErrorMessage>{formik.errors.name}</FormErrorMessage>
                  </FormControl>
  
                  <FormControl isInvalid={(formik.touched.email && formik.errors.email)} borderRadius="md" padding="5px">
                    <Input  {...formik.getFieldProps('email')}  placeholder="Email" borderWidth="1px" borderColor="gray.300" />
                    <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
                  </FormControl>
  
                  <FormControl isInvalid={(formik.touched.address && formik.errors.address)} borderRadius="md" padding="5px">
                    <Input {...formik.getFieldProps('address')} placeholder="Address" borderWidth="1px" borderColor="gray.300" />
                    <FormErrorMessage>{formik.errors.address}</FormErrorMessage>
                  </FormControl>
  
                  <FormControl isInvalid={(formik.touched.phone && formik.errors.phone)} borderRadius="md" padding="5px">
                    <Input {...formik.getFieldProps('phone')} placeholder="Phone No." borderWidth="1px" borderColor="gray.300"/>
                    <FormErrorMessage>{formik.errors.phone}</FormErrorMessage>
                  </FormControl>
  
                  {/* Subtotal, Shipping, and Total */}
                  <VStack padding="10px" width="100%" alignItems="end">
                    <HStack>
                      <Heading size="sm">Payment method:</Heading>
                      <Text>COD</Text>
                    </HStack>
                    <HStack>
                      <Heading size="sm">Subtotal:</Heading>
                      <Text>Rs.{calculatePrice()}</Text>
                    </HStack>
                    <HStack>
                      <Heading size="sm">Shipping:</Heading>
                      <Text>Rs.{shipping}</Text>
                    </HStack>
                    <HStack>
                      <Heading size="md">Total</Heading>
                      <Text color="rgb(213, 77, 77)">Rs.{calculatePrice() + shipping}</Text>
                    </HStack>
                  </VStack>
                  <Button type="submit" colorScheme="teal" size="lg">
                    Place Order
                  </Button>
                </VStack>
              </form>
            </Box>
          </VStack>
        ) : (
          <HStack minHeight="92vh" align="flex-start" bgColor="#E7E9EC" paddingTop={100} spacing={4} paddingLeft={4} paddingRight={4} pb={4}>
            {/* Left Side */}
            <VStack width="45%">
              <Heading marginBottom={4}>Order Summary</Heading>
              {order.map((order, index) => (
                <Box
                  key={index}
                  display="flex"
                  alignItems="center"
                  padding="10px"
                  border="1px solid #ddd"
                  borderRadius="4px"
                  backgroundColor="white"
                  marginBottom="10px"
                  width="100%"
                >
                  <Image padding={2} src={order.image} alt={order.name} boxSize="70px" objectFit="cover" />
                  <Flex direction="column">
                    <Text fontSize="lg" noOfLines="1">{order.name}</Text>
                    <Text>x{order.quantity}</Text>
                    <Text color="rgb(213, 77, 77)">Rs.{order.salePrice}</Text>
                  </Flex>
                </Box>
              ))}
            </VStack>
  
            {/* Right Side */}
            <Box width="55%">
              <form onSubmit={formik.handleSubmit}>
                <VStack width="100%" spacing={4} align="flex-start">
                  <FormControl isInvalid={(formik.touched.name && formik.errors.name)} borderRadius="md" padding="5px">
                    <Input {...formik.getFieldProps('name')} placeholder="Name" borderWidth="1px" borderColor="gray.300" />
                    <FormErrorMessage>{formik.errors.name}</FormErrorMessage>
                  </FormControl>
  
                  <FormControl isInvalid={(formik.touched.email && formik.errors.email)} borderRadius="md" padding="5px">
                    <Input  {...formik.getFieldProps('email')}  placeholder="Email" borderWidth="1px" borderColor="gray.300" />
                    <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
                  </FormControl>
  
                  <FormControl isInvalid={(formik.touched.address && formik.errors.address)} borderRadius="md" padding="5px">
                    <Input {...formik.getFieldProps('address')} placeholder="Address" borderWidth="1px" borderColor="gray.300" />
                    <FormErrorMessage>{formik.errors.address}</FormErrorMessage>
                  </FormControl>
  
                  <FormControl isInvalid={(formik.touched.phone && formik.errors.phone)} borderRadius="md" padding="5px">
                    <Input {...formik.getFieldProps('phone')} placeholder="Phone No." borderWidth="1px" borderColor="gray.300"/>
                    <FormErrorMessage>{formik.errors.phone}</FormErrorMessage>
                  </FormControl>
  
                  {/* Subtotal, Shipping, and Total */}
                  <VStack padding="10px" width="100%" alignItems="end">
                    <HStack>
                      <Heading size="sm">Payment method:</Heading>
                      <Text>COD</Text>
                    </HStack>
                    <HStack>
                      <Heading size="sm">Subtotal:</Heading>
                      <Text>Rs.{calculatePrice()}</Text>
                    </HStack>
                    <HStack>
                      <Heading size="sm">Shipping:</Heading>
                      <Text>Rs.{shipping}</Text>
                    </HStack>
                    <HStack>
                      <Heading size="md">Total</Heading>
                      <Text color="rgb(213, 77, 77)">Rs.{calculatePrice() + shipping}</Text>
                      </HStack>
                </VStack>
                <Button type="submit" colorScheme="teal" size="lg">
                  Place Order
                </Button>
              </VStack>
            </form>
          </Box>
        </HStack>
      )}
    </>
  )
);
}

export default Order;