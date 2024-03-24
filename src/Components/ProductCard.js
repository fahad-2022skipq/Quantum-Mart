import { Box, Image, Text, HStack,VStack } from "@chakra-ui/react";
function ProductCard(props) {
  return (
    <Box borderRadius="2xl" bg="#FFFFFF" overflow="hidden" boxShadow="md" width={{base:'160px', md:'200px'}} alignItems="center">
      <Image src={props.images[0]} height={{base:"150px",md:"200px"}} width={{base:"160px",md:"auto"}} alt="product" fallbackSrc='https://via.placeholder.com/150'/>
      <Box p={4}>
        <Text noOfLines={2} fontSize={{base:"xsm",md:"md"}}  mb={2}>
          {props.name}
        </Text>
      
        <HStack spacing={3}> 
        <Text fontSize={{base:"xsm",md:"md"}} fontWeight="bold" color="rgb(213, 77, 77)">
          Rs.{props.salePrice}
        </Text>
        {props.salePrice!==props.price && <Text as="s" fontSize={{base:"xsm",md:"sm"}} fontWeight="normal" fontStyle="italic" color="grey">
          Rs.{props.price}
        </Text> 
        }
        </HStack>
      </Box>
    </Box>
  );
}

export default ProductCard;
