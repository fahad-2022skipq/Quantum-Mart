import { Box, Stack, Heading, Button, Text } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faSearch
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef} from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "../context/userContext";


function NavBar() {
  // const navBarRef = useRef(null);
  const navigate = useNavigate();
  const {setData} = useUserContext()
  // useEffect(() => {
  //   let prevScrollPos = window.scrollY;
  //   const handleScroll = () => {
  //     const currentScrollPos = window.scrollY;
  //     const headerElement = navBarRef.current;
  //     if (!headerElement) {
  //       return;
  //     }
  //     if (prevScrollPos > currentScrollPos) {
  //       headerElement.style.transform = "translateY(0)";
  //     } else {
  //       headerElement.style.transform = "translateY(-200px)";
  //     }
  //     prevScrollPos = currentScrollPos;
  //   }
  //   window.addEventListener('scroll', handleScroll)
  //   return () => {
  //   window.removeEventListener('scroll', handleScroll)
  //   }
  // }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    setData({})
    navigate('/')
  }

  return (
    <Box 
      // ref={navBarRef} 
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
         <Link to="/products"><Stack direction="row">
         <Heading color="white" size="lg" fontFamily="helvetica">
            Quantum
          </Heading>
          <Heading color="orange" size="lg" fontFamily="helvetica">
            Mart
          </Heading>
        </Stack></Link>
        <Stack direction="row"  
        alignItems="center">

        {!localStorage.getItem('authToken')&&<Stack direction="row" mx="3px">
          <Link to="/"><Button size="sm">Login</Button></Link>
          <Link to="/register"><Button size="sm">Register</Button></Link>
          </Stack>}
          {localStorage.getItem('authToken')&&<Stack direction="row" mx="3px" alignItems="center" spacing={5}>
          <Link to="myorders"><Text color="white">Orders</Text></Link>
          <Button onClick={handleLogout} size="sm">Logout</Button>
          </Stack>}
        <Stack direction="row" spacing={4} color="white">

        
              {localStorage.getItem('authToken')&&<Link to='/cart' size="md" fontFamily="sans-serif">
                <FontAwesomeIcon icon={faCartShopping} color="orange"/>
              </Link>}
          
        </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}

export default NavBar;
