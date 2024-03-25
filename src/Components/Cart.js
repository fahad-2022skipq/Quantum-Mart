import {
  Box,
  HStack,
  Spinner,
  Stack,
  Flex,
  Text,
  Heading,
  Button,
  Image,
  Divider,
  useMediaQuery
} from "@chakra-ui/react";
import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { AddIcon, MinusIcon, DeleteIcon, ArrowRightIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";

function Cart() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true);
  const [incrementLoading, setIncrementLoading] = useState({});
  const [decrementLoading, setDecrementLoading] = useState({});
  const [deleteLoading, setDeleteLoading] = useState({});
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  let total = 0;
  const shipping = 200;
  const url = process.env.REACT_APP_API_URL;
  const [cart, setCart] = useState({products:[]});
  const userId = localStorage.getItem('userId')

  const fetchCart = async () => {
    try {
      if (!userId) {
        console.log("User ID is not available.");
        return;
      }
      const response = await axios.post(url + "/getCart", { userId });
      if (response.data.success) {
        setCart(response.data);
      }
    } catch (error) {
      console.error("Error fetching cart: ", error.message);
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  },[userId]);


  const handleCheckOut = () => {
    navigate('/order',{ state: { order: cart.products, cartId: cart.id } })
  }

  const updateItemLoadingState = (action, productId, value) => {
    switch (action) {
      case 'increment':
        setIncrementLoading((prevStates) => ({
          ...prevStates,
          [productId]: value,
        }));
        break;
      case 'decrement':
        setDecrementLoading((prevStates) => ({
          ...prevStates,
          [productId]: value,
        }));
        break;
      case 'delete':
        setDeleteLoading((prevStates) => ({
          ...prevStates,
          [productId]: value,
        }));
        break;
      default:
        break;
    }
  };

  const incrementQuantity = async (id, productId) => {
    try {
      updateItemLoadingState('increment', productId, true);
      const response = await axios.post(url + "/increaseQuantity", {
        id,
        productId,
      });
      if (response.data.success) {
        fetchCart();
      }
    } catch (error) {
      alert(error.message)
    } finally{
      updateItemLoadingState('increment', productId, false);
    }
  }

  const decrementQuantity = async (id, productId) => {
    try {
      updateItemLoadingState('decrement', productId, true);
      const response = await axios.post(url + "/reduceQuantity", {
        id,
        productId,
      });
      if (response.data.success) {
        fetchCart();
      }
    } catch (error) {
      alert(error.message)
    } finally{
      updateItemLoadingState('decrement', productId, false);
    }
  };

  const deleteItem = async (id, productId) => {
    try {
      updateItemLoadingState('delete', productId, true);
      const response = await axios.delete(url + "/deleteItem", {
        data: { id, productId },
      });
      if (response.data.success) {
        fetchCart();
      }
    } catch (error) {
      alert(error.message)
    } finally{
      updateItemLoadingState('delete', productId, false);
    }
  };

  return (
    <Box minH="92vh" w="100vw" pt={20} bgColor="#E7E9EC">
      {loading ? (
        <HStack w="100vw" h="90vh" justifyContent="center">
          <Spinner size="xl" />
        </HStack>
      ) : cart.products && cart.products.length === 0 ? (
        <HStack w="100vw" h="92vh" justifyContent="center">
          <Text>Currently no item is in the cart</Text>
        </HStack>
      ) : (
        <Box padding={isMobile ? 0 : 10}>
          <Flex direction={isMobile ? "column" : "row"}>
            {/* Left Side */}
            <Box flex={isMobile ? "none" : 7} pr={isMobile ? 0 : 10} pl={isMobile ? 0 : 10}  pb={{base:8,md:0}}>
              <HStack pr={isMobile ? 4 : 0} pl={isMobile ? 4 : 0} justifyContent="space-between">
                <Heading  size={{base:"md",md:"lg"}}>Shopping Cart</Heading>
                <Heading size={{base:"sm",md:"md"}}>
                  {cart.products && cart.products.length === 1 ? `${cart.products.length} Item` : `${cart.products.length} Items`}
                </Heading>
              </HStack>
  
              <Box py={isMobile ? "10px" : "20px"}>
                <Divider orientation="horizontal" py="1px" bg="black"/>
              </Box>
  
              {cart.products && cart.products.map((item) => (
                <Box key={item.id} pt={isMobile ? "10px" : 0}>
                  <HStack spacing="4" bg="white" p="10px" justifyContent="space-evenly">
                    <HStack spacing="3">
                      <Image
                        src={item.image}
                        boxSize={isMobile ? "40px" : "80px"}
                        objectFit="cover"
                      />
                      <Stack direction="column">
                        <Heading alignItems="left" size={{base:"xs",md:"s"}}>
                          Name
                        </Heading>
                        <Heading fontWeight="normal" size={{base:"15px",md:"s"}} width={isMobile ? "80px" : "200px"}>
                          {item.name.split(" ").slice(0, 3).join(" ")}
                        </Heading>
                      </Stack>
                    </HStack>
                    <HStack spacing={isMobile ? "3" : "10"}>
                      <HStack>
                        <Button
                          isLoading={decrementLoading[item.id]}
                          variant="ghost"
                          onClick={() => decrementQuantity(cart.id, item.id)}
                          disabled={item.quantity == 1}
                          size={{base:"xs",md:"sm"}}
                        >
                          <MinusIcon />
                        </Button>
                        <Text>{item.quantity}</Text>
                        <Button
                          isLoading={incrementLoading[item.id]}
                          variant="ghost"
                          onClick={() => incrementQuantity(cart.id, item.id)}
                          disabled={item.quantity === 10}
                          size={{base:"xs",md:"sm"}}
                        >
                          <AddIcon />
                        </Button>
                      </HStack>
                      <HStack spacing={isMobile ? "3" : "20"}>
                        <Stack direction="column">
                          <Heading alignItems="left" size={{base:"xs",md:"s"}}>
                            Item Price
                          </Heading>
                          <Heading fontWeight="bold" size={{base:"xs",md:"s"}} color="rgb(213, 77, 77)">
                            {"Rs." + item.salePrice}
                          </Heading>
                        </Stack>
                        <Stack direction="column">
                          <Heading alignItems="left" size={{base:"xs",md:"s"}}>
                            Total Price
                          </Heading>
                          <Heading fontWeight="bold" size={{base:"xs",md:"s"}} color="rgb(213, 77, 77)">
                            {"Rs." + item.salePrice * item.quantity}
                          </Heading>
                        </Stack>
                      </HStack>
                    </HStack>
                    <Button
                      isLoading={deleteLoading[item.id]}
                      variant="ghost"
                      onClick={() => deleteItem(cart.id, item.id)}
                      size="lg"
                    >
                      <DeleteIcon />
                    </Button>
                  </HStack>
                </Box>
              ))}
            </Box>
  
            {/* Right Side */}
            <Box bg="#f5f5f6" flex={isMobile ? "none" : 3} p={isMobile ? 4 : 15} h={isMobile ? "-webkit-fit-content" : "fit-content"} width={isMobile ? "100%" : "auto"}>
              {cart.products.map((item) => {
                {total += item.salePrice * item.quantity}
              })}
              <Stack direction="column" w="100%">
                <Heading fontWeight="normal" size={{base:"sm",md:"md"}}>Item Total: Rs.{total}</Heading>
                <Heading fontWeight="normal" size={{base:"sm",md:"md"}}>Shipping: Rs.{shipping}</Heading>
                <Divider py="1px" bg="black"/>

               <Heading fontWeight="bold" size={{base:"sm",md:"md"}} color="rgb(213, 77, 77)">Grand Total: Rs.{total + shipping}</Heading>
                <Button onClick={() => handleCheckOut()} colorScheme="orange" width="200px" alignSelf="center">Checkout <ArrowRightIcon/></Button>
              </Stack>
            </Box>
          </Flex>
        </Box>
      )}
    </Box>
);
}

export default Cart;
