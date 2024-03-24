import React, { useEffect, useState } from "react";
import { HStack, Grid, GridItem, VStack, Spinner, Input, IconButton} from "@chakra-ui/react";
import ProductCard from "./ProductCard";
import { useNavigate } from "react-router-dom";
import { SearchIcon } from "@chakra-ui/icons";
import axios from "axios";

function Product() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("");

  const [loading, setLoading]=useState(true);
  const handleClick = function(obj){
    navigate(`/products/${obj._id}`)
  }

  const handleSearch = () => {
    navigate(`/search/${searchQuery}`);
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const [productItems,setProductItems] = useState([])

  useEffect(() => {
    if (!localStorage.getItem('authToken')) {
      navigate('/');
    }
  }, [navigate]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/getAllProducts`);
      if(response.data.success){
        setLoading(false)
        setProductItems(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
  fetchData();
},[])


  return (

   <VStack minH="100vh" h="auto" w="100%" bgColor="#E7E9EC" paddingTop={20} spacing='4'>
    <HStack spacing={4}>
    <Input
      placeholder="Search ..."
      width={{base:"200px",md:"400px"}}
      borderColor="black"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      onKeyDown={handleEnter}
    />
    <IconButton
      aria-label="Search"
      icon={<SearchIcon />}
      color="orange"
      onClick={handleSearch}
    />
  </HStack>
    {loading? (<Spinner size="xl" />): (<Grid
      justifyContent="center"
      width="50%"
      templateColumns={{ base: "1fr 1fr", md: "1fr 1fr 1fr 1fr"}}
      gap={{base:5,md:8}}
      paddingStart={1}
      paddingEnd={1}
      paddingBottom={4}
    > 
        {
        productItems.map(product=>{
            return <GridItem onClick={()=>handleClick(product)} key={product._id}><ProductCard  name={product.name} description={product.description} images={product.images} price={product.price} salePrice={product.salePrice}/></GridItem>
          })
        }
         
    </Grid>)}
    </VStack>
  );
}

export default Product;
