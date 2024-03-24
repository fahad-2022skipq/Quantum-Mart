import {React, useEffect } from "react";
import {useNavigate} from "react-router-dom"
import { useFormik } from "formik";
import { signupSchema } from "../ValidationSchemas";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  Heading,
  Input,
  VStack,
} from "@chakra-ui/react";
import { useAlertContext } from "../context/alertContext";
import useSubmit from "../Hooks/useSubmit"
function Register() {
  const url = process.env.REACT_APP_API_URL;
  const {onOpen, onClose} = useAlertContext();
  const {isLoading, alert, submit} = useSubmit();
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: ""
    },
    onSubmit: (values) => {
       submit(url+"/createUser",values)
    },
    validationSchema: signupSchema
  });

  useEffect(() => { 
    if (alert) { 
      onOpen(alert.type, alert.message); 
      setTimeout(() => {
        onClose();
      },3300)
      if (alert.type === 'success') { 
        navigate('/products')
      } 
    } 
  }, [alert]); 

  return (
    <Box minHeight="92vh">
      <VStack spacing={7} padding={10} alignItems="center" width={{base:"100%",md:"80%"}} margin="auto">
        <Heading mt="100px" textAlign="center">
          Register
        </Heading>
        <Box paddingTop={6} rounded="md" w="100%" align="center">
  <form onSubmit={formik.handleSubmit}>
    <VStack spacing={4}>
      <FormControl isInvalid={(formik.touched.firstName && formik.errors.firstName)}>
        <Input
          {...formik.getFieldProps('firstName')}

          variant="outline"
          id="firstName"
          placeholder="First Name"
          name="firstName"
          size="md"
        />
        <FormErrorMessage>{formik.errors.firstName}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={(formik.touched.lastName && formik.errors.lastName)}>
        <Input
          {...formik.getFieldProps('lastName')}
          variant="outline"
          id="lastName"
          placeholder="Last Name"
          name="lastName"
          size="md"
        />
        <FormErrorMessage>{formik.errors.lastName}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={(formik.touched.email && formik.errors.email)}>
        <Input
          variant="outline"
          id="email"
          placeholder="Email"
          size="md"
          name="email"
          {...formik.getFieldProps('email')}
        />
        <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={(formik.touched.password && formik.errors.password)}>
        <Input
          variant="outline"
          id="password"
          type="password"
          placeholder="Password"
          name="password"
          size="md"
          {...formik.getFieldProps('password')}
        />
        <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={(formik.touched.confirmPassword && formik.errors.confirmPassword)}>
        <Input
          variant="outline"
          id="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          name="confirmPassword"
          size="md"
          {...formik.getFieldProps('confirmPassword')}
        />
        <FormErrorMessage>{formik.errors.confirmPassword}</FormErrorMessage>
      </FormControl>

      <Button type="submit" isLoading={isLoading}>
        Register
      </Button>
    </VStack>
  </form>
</Box>
      </VStack>
    </Box>
  );
}

export default Register;