import { Box, Stack, Heading, Button, Text } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faSearch
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef} from "react";
import { Link, useNavigate } from "react-router-dom";


function NavBar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // localStorage.removeItem('authToken')
    // navigate('/')
  }

  return (
    <Box 
      bg="#18181b" 
      pos="fixed"
      top={0}
      left={0}
      right={0}
      translateY={0}
      transitionProperty="transform"
      transitionDuration="0.6s"
      transitionTimingFunction="ease-in-out"
      zIndex={1}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        px={6}
        py={4}
        alignItems="center"
      >
         <Link to="/admin"><Stack direction="row">
          <Heading color="orange" size="lg" fontFamily="helvetica">
            Admin
          </Heading>
        </Stack></Link>
        <Stack direction="row"  
        alignItems="center">

        {!localStorage.getItem('authToken')&&<Stack direction="row" mx="3px">
          <Link to="/"><Button size="sm">Login</Button></Link>
          <Link to="/register"><Button size="sm">Register</Button></Link>
          </Stack>}
          {localStorage.getItem('authToken')&&<Stack direction="row" mx="3px" alignItems="center" spacing={5}>
          <Button onClick={handleLogout} size="sm">Logout</Button>
          </Stack>}
        </Stack>
      </Stack>
    </Box>
  );
}

export default NavBar;
