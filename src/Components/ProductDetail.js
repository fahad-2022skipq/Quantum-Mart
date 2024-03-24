import { HStack,
  VStack,
  Box,
  Image,
  Text,
  Button,
  Grid,
  Spacer,
useMediaQuery, 
Alert} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useParams} from 'react-router-dom'
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import {useNavigate } from "react-router-dom";
import { useAlertContext } from '../context/alertContext';
import axios from "axios";

function ProductDetail() {
const [loading, setLoading] = useState(true);
const navigate = useNavigate()
const [isMobile] = useMediaQuery("(max-width: 768px)");
const url = process.env.REACT_APP_API_URL;
const {id} = useParams()
const [productDetails,setProductDetails] = useState({})
const {onOpen, onClose} = useAlertContext();
const fetchData = async () => {
  try {
  let response = await axios.post(url+'/getProduct',{productId:id})
  if(response.data.success){
    setProductDetails(response.data.data)
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

fetchData();
},[])  


const [selectedImage, setSelectedImage] = useState(0);
const [quantity, setQuantity] = useState(1);
const images = productDetails.images;

const handleImageClick = (index) => {
  setSelectedImage(index);
};
const incrementQuantity = () => {
  setQuantity(Math.min(quantity + 1, 9)); // Limit quantity to a maximum of 10
};

const decrementQuantity = () => {
  setQuantity(Math.max(quantity - 1, 1)); // Ensure quantity is at least 1
};

const handleOrder = () => {
    navigate('/order',{state:{order: [{
      id,
      image: productDetails.images[0],
      quantity,
      name: productDetails.name,
      description: productDetails.description,
      salePrice: productDetails.salePrice
    }]}});
}

const handleCart = async() => {
  try {
    const authToken = localStorage.getItem('authToken');
    const response = await axios.post(`${url}/addToCart`, {
      productId: id,
      quantity},{
      headers:{
        'auth-token': authToken,
        "Content-Type": 'application/json'
      }
    });
      onOpen(response.data.success, response.data.message); 
      setTimeout(() => {
      onClose();
    },2000)
  }catch (error) {
    console.error('Error adding product to cart:', error.message);
  }
}

return (
  <VStack minHeight="92vh" spacing={4} paddingTop={20} paddingBottom={6} paddingLeft={5} paddingRight={5}>
    {isMobile && !loading ? (
      <>
        <Image src={images[selectedImage]} alt="Product Image" maxH="300px" />
        <Grid templateColumns="repeat(4, 1fr)" gap={4}>
          {images.map((image, index) => (
            <Box
              key={index}
              cursor="pointer"
              onClick={() => handleImageClick(index)}
            >
              <Image
                src={image}
                alt={`Product Image ${index}`}
                maxH="40px"
                opacity={selectedImage === index ? 1 : 0.6}
              />
            </Box>
          ))}
        </Grid>
     
        <Text fontSize="xl" fontWeight="bold">{productDetails.name}</Text>
        <Text >{productDetails.description}</Text>
        <HStack>
          <Text>Quantity:</Text>
          <Button
            variant="ghost"
            onClick={decrementQuantity}
            disabled={quantity === 1}
            size="sm"
          >
            <MinusIcon />
          </Button>
          <Text>{quantity}</Text>
          <Button
            variant="ghost"
            onClick={incrementQuantity}
            disabled={quantity === 10}
            size="sm"
          >
            <AddIcon />
          </Button>
        </HStack>
        <Text color="rgb(213, 77, 77)">Rs.{productDetails.salePrice}</Text>
        <HStack>
          <Button colorScheme="blue" onClick={handleOrder}>Buy Now</Button>
          <Button colorScheme="teal" onClick={handleCart}>Add to Cart</Button>
        </HStack>
      </>
    ) : (
     !loading&& <HStack spacing={8}>
        <VStack flex="3">
          <Image src={images[selectedImage]} alt="Product Image" maxH="400px" />
          <Grid templateColumns="repeat(4, 1fr)" gap={4}>
            {images.map((image, index) => (
              <Box
                key={index}
                cursor="pointer"
                onClick={() => handleImageClick(index)}
              >
                <Image
                  src={image}
                  alt={`Product Image ${index}`}
                  maxH="80px"
                  opacity={selectedImage === index ? 1 : 0.6}
                />
              </Box>
            ))}
          </Grid>
        </VStack>
        <VStack flex="7"  >
          <Text fontSize="xl" fontWeight="bold">{productDetails.name}</Text>
          <Text textAlign="justify" w="70%" >{productDetails.description}</Text>
          <HStack>
            <Text>Quantity:</Text>
            <Button
              variant="ghost"
              onClick={decrementQuantity}
              disabled={quantity === 1}
              size="sm"
            >
              <MinusIcon />
            </Button>
            <Text>{quantity}</Text>
            <Button
              variant="ghost"
              onClick={incrementQuantity}
              disabled={quantity === 10}
              size="sm"
            >
              <AddIcon />
            </Button>
          </HStack>
          <Text color="rgb(213, 77, 77)">Rs.{productDetails.salePrice}</Text>
          <HStack>
            <Button colorScheme="blue" onClick={handleOrder}>Buy Now</Button>
            <Button colorScheme="teal" onClick={handleCart}>Add to Cart</Button>
          </HStack>
        </VStack>
      </HStack>
    )}
  </VStack>
);
}

export default ProductDetail