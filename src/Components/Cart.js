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
        <Box padding={10}>
          {/* left side */}
          <Flex>
            <Box flex={7} pr={10} pl={10} >
              <HStack justifyContent="space-between" >
                <Heading size="lg">Shopping Cart</Heading>
                <Heading size="md">
                {cart.products && cart.products.length === 1 ? `${cart.products.length} Item` : `${cart.products.length} Items`}
                </Heading>
              </HStack>

              <Box py="20px">
              <Divider orientation="horizontal" py="1px" bg="black"/>
              </Box>
              
              {cart.products &&
                cart.products.map((item) => (
                  <Box key={item.id} pt="10px" >
                    <HStack bg="white" p="10px"  justifyContent="space-evenly">
                      <HStack spacing="7">
                        <Image
                          src={item.image}
                          boxSize="80px"
                          objectFit="cover"
                        />
                        <Stack direction="column">
                          <Heading alignItems="left" size="s">
                            Name
                          </Heading>
                          <Heading fontWeight="normal" size="s" width="200px">
                            {item.name.split(" ").slice(0, 3).join(" ")}
                          </Heading>
                        </Stack>
                      </HStack>
                      <HStack spacing="10">
                        <HStack>
                          <Button
                            isLoading={decrementLoading[item.id]}
                            variant="ghost"
                            onClick={() => decrementQuantity(cart.id, item.id)}
                            disabled={item.quantity == 1}
                            size="sm"
                          >
                            <MinusIcon />
                          </Button>
                          <Text>{item.quantity}</Text>
                          <Button
                            isLoading={incrementLoading[item.id]}
                            variant="ghost"
                            onClick={() => incrementQuantity(cart.id, item.id)}
                            disabled={item.quantity === 10}
                            size="sm"
                          >
                            <AddIcon />
                          </Button>
                        </HStack>
                        <HStack spacing="20">
                          <Stack direction="column">
                            <Heading alignItems="left" size="s">
                              Item Price
                            </Heading>
                            <Heading
                              fontWeight="bold"
                              size="s"
                              color="rgb(213, 77, 77)"
                            >
                              {"Rs." + item.salePrice}
                            </Heading>
                          </Stack>
                          <Stack direction="column">
                            <Heading alignItems="left" size="s">
                              Total Price
                            </Heading>
                            <Heading
                              fontWeight="bold"
                              size="s"
                              color="rgb(213, 77, 77)"
                            >
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

              <HStack></HStack>
            </Box>
            <Box bg="#f5f5f6" flex={3} p="15px" h="-webkit-fit-content">
            {cart.products.map((item)=>{
                   {total+=item.salePrice*item.quantity}
                })}
                <Stack direction="column" w="100%" >
                <Heading fontWeight="normal" size="md" >Item Total: Rs.{total} </Heading>
                <Heading fontWeight="normal" size="md" >Shipping: Rs.{shipping}</Heading>
                <Divider py="1px" bg="black"/>
                <Heading fontWeight="bold" size="md" color="rgb(213, 77, 77)">Grand Total: Rs.{total+shipping}</Heading>
                
                <Button onClick={()=>handleCheckOut()} 
                 colorScheme="orange" width="200px" alignSelf="center" >Checkout <ArrowRightIcon/></Button>
                </Stack>
            </Box>
          </Flex>
        </Box>
      )}
    </Box>
  );
}

export default Cart;
