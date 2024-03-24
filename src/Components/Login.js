import {React, useEffect } from "react";
import {
  Box,
  Button,
  FormErrorMessage,
  FormControl,
  Heading,
  Input,
  VStack,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { useAlertContext } from "../context/alertContext";
import {useNavigate} from "react-router-dom"
import useSubmit from "../Hooks/useSubmit"
import { loginSchema } from "../ValidationSchemas";
import axios from 'axios'

function Login() {
  const url = process.env.REACT_APP_API_URL;
  const {onOpen, onClose} = useAlertContext();
  const {isLoading, alert, submit} = useSubmit();
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: (values) => {
      submit(url+'/login', values)
    },
    validationSchema: loginSchema
  });

  const getUser= async()=>{
    try {
      let response = await axios.post(url+'/getUser',{},{
        headers:{
        'Content-Type':'application/json',
        "auth-token": localStorage.getItem('authToken')
      }
      });
      if(response.data.success){
        localStorage.setItem('userId',response.data.user._id)
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  useEffect(() => { 
    const fetchData = async () => {
      if (localStorage.getItem('authToken')) {
          getUser();
          navigate('/products');
      }
      if (alert) { 
        onOpen(alert.type, alert.message); 
        setTimeout(() => {
          onClose();
        }, 3300);
  
        if (alert.type === 'success') { 
          getUser();
          setTimeout(() => {
            navigate('/products');
          }, 3000);
        } 
      }
    };
  
    fetchData();
  }, [alert]);
  
  return (
    <Box minHeight="92vh">
      <VStack
        spacing={2}
        padding={10}
        alignItems="center"
        width={{base:"100%",md:"80%"}}
        margin="auto"
      >
        <Heading mt="100px" textAlign="center">
          Login
        </Heading>
        <Box paddingTop={4} rounded="md" w="100%" align="center">
          <form onSubmit={formik.handleSubmit}>
            <VStack spacing={4}>
                <FormControl isInvalid={(formik.touched.email && formik.errors.email)}>
                <Input
                {...formik.getFieldProps('email')}
                  variant="outline"
                  placeholder="Email"
                  size="md"
                />
                <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={(formik.touched.password && formik.errors.password)}>
              <Input
              {...formik.getFieldProps('password')}
                variant="outline"
                type="password"
                placeholder="Password"
                size="md"
              />
              <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
              </FormControl>
              <Button type="submit" isLoading={isLoading}>Submit</Button>
            </VStack>
          </form>
        </Box>
      </VStack>
    </Box>
  );
}

export default Login;
