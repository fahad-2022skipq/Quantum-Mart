import { Box, Flex, Heading, Text, Button, Icon } from '@chakra-ui/react';
import { FiBox, FiShoppingBag } from 'react-icons/fi'; // Import icons for Products and Orders
import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <Box minH="100vh" w="100vw" pt={20} bgColor="#E7E9EC" cursor="default" >
    <Flex justify="center" align="center" h="100%">
      <Box width="45%" p={5} borderWidth={1} borderRadius="lg" bgColor="white" shadow="lg">
        <Heading as="h3" size="lg" mb={10} textAlign='center'>Admin Panel</Heading>
        <Flex justify="space-between">
          {/* Products Card */}
          <Link to='/adminaddproduct'>
            <Box p={5} borderWidth={1} borderRadius="lg" bgColor="gray.100" cursor="pointer">
            <Flex align="center">
              <Icon as={FiBox} boxSize={8} mr={4} />
              <Box>
                <Heading as="h4" size="md">Products</Heading>
                <Text mt={2}>Manage your products</Text>
              </Box>
            </Flex>
          </Box>
          </Link>
          {/* Orders Card */}
          <Link to='/adminorders'>
          <Box p={5} borderWidth={1} borderRadius="lg" bgColor="gray.100" cursor="pointer" >
            <Flex align="center">
              <Icon as={FiShoppingBag} boxSize={8} mr={4} />
              <Box>
                <Heading as="h4" size="md">Orders</Heading>
                <Text mt={2}>Manage your orders</Text>
              </Box>
            </Flex>
          </Box>
          </Link>
        </Flex>
      </Box>
    </Flex>
  </Box>
  )
}

export default Home