import React from "react";
import { Box, Text} from "@chakra-ui/react";

function Footer() {
  return (
    <Box as="footer" p={5} w="100%" bgColor="#18181b" color="white" align="center">
        <Text fontSize="sm">Copyright © 2023 Quantum Mart </Text>
    </Box>
  );
}

export default Footer;
