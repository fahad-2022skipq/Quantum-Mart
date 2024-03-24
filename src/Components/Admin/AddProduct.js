import React from "react";
import { Box, Button, FormControl, FormLabel, Input, Textarea, NumberInput, NumberInputField, Stack, VStack, Text, SimpleGrid, Image } from "@chakra-ui/react";
import { useFormik } from "formik";
import axios from "axios";
import { useAlertContext } from "../../context/alertContext";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
    const url = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();
    const {onOpen, onClose} = useAlertContext();

    const uploadProduct = async (productDetails) => {
        try {
          const formData = new FormData();
      
          // Append product details to the FormData
          Object.entries(productDetails).forEach(([key, value]) => {
            if (key === "images") {
              // If the key is "images," append each image file to the FormData
              for (let i = 0; i < value.length; i++) {
                formData.append("images", value[i]);
              }
            } else {
              formData.append(key, value);
            }
          });
      
          const response = await axios.post(url + '/uploadProduct', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
      
          if (response.data.success) {
      onOpen("success", "Product successfully uploaded"); 
      setTimeout(() => {
      onClose();
      navigate('/admin')
    },2000)
    } else {
      onOpen('', 'Something went wrong'); 
      setTimeout(() => {
      onClose();
    },2000)
    }
        } catch (error) {
          console.log(error.message);
        } finally{
            formik.resetForm();
            formik.setSubmitting(false);

        }
      };

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      price: "",
      salePrice: "",
      images: [], // Array to store uploaded image files
    },
    
    onSubmit: (values) => {
        const productDetails = {
            name:values.name,
            description:values.description,
            price:values.price,
            salePrice:values.salePrice,
            images:values.images
        }
        uploadProduct(productDetails)
    },
  });

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length < 2) {
      formik.setFieldError("images", "Please upload at least 2 images.");
    } else if (files.length > 4) {
      formik.setFieldError("images", "You can upload a maximum of 4 images.");
    } else {
      formik.setFieldError("images", null);
      formik.setFieldValue("images", files);

      // Create image previews
      const previews = files.map((file) => URL.createObjectURL(file));
      formik.setFieldValue("imagePreviews", previews);
    }
  };

  return (
    <Box minH="100vh" p="20px" w="100vw" pt={20} bgColor="#E7E9EC">
       <VStack spacing={4} align="start">
        <form onSubmit={formik.handleSubmit}>
          <FormControl>
            <FormLabel>Name</FormLabel>
            <Input type="text" name="name" value={formik.values.name} onChange={formik.handleChange} />
          </FormControl>

          <FormControl>
            <FormLabel>Description</FormLabel>
            <Textarea name="description" value={formik.values.description} onChange={formik.handleChange} />
          </FormControl>

          <FormControl>
            <FormLabel>Price</FormLabel>
            <NumberInput>
              <NumberInputField type="number" name="price" value={formik.values.price} onChange={formik.handleChange} />
            </NumberInput>
          </FormControl>

          <FormControl>
            <FormLabel>Sale Price</FormLabel>
            <NumberInput>
              <NumberInputField type="number" name="salePrice" value={formik.values.salePrice} onChange={formik.handleChange} />
            </NumberInput>
          </FormControl>

          <FormControl>
            <FormLabel>Images</FormLabel>
            <Input type="file" name="images" accept="image/*" multiple onChange={handleImageChange} />
            {formik.errors.images && <Text color="red">{formik.errors.images}</Text>}
          </FormControl>

          {formik.values.imagePreviews && formik.values.imagePreviews.length > 0 && (
            <SimpleGrid columns={4} spacing={2} p="10px">
              {formik.values.imagePreviews.map((preview, index) => (
                <Image key={index} src={preview} alt={`Preview ${index + 1}`} boxSize="100px" />
              ))}
            </SimpleGrid>
          )}

          <Stack direction="row" spacing={4}>
            <Button colorScheme="teal" type="submit" isLoading={formik.isSubmitting}>
              Add Product
            </Button>
          </Stack>
        </form>
      </VStack>
    </Box>
  );
};

export default AddProduct;
