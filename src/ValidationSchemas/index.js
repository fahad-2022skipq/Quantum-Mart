import * as Yup from "yup"

export const signupSchema = Yup.object({
    firstName: Yup.string()
      .max(12, "Must be 12 characters or less")
      .required("Please provide first name"),
    lastName: Yup.string()
      .max(12, "Must be 12 characters or less")
      .required("Please provide last name"),
    email: Yup.string().email("Email is invalid")
    .required("Please provide email"),
    password: Yup.string()
      .min(8, "Must be at least 8 characters")
      .required("Please provide password"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Password doesn't match").required("Please provide password")
  })

  export const orderSchema = Yup.object({
    name: Yup.string()
      .max(24, "Must be 24 characters or less")
      .required("Please provide name"),
    email: Yup.string().email("Email is invalid")
    .required("Please provide email"),
    address: Yup.string()
    .required("Please provide address"),
    phone: Yup.string()
      .required("Please provide phone"),
  })

  export const loginSchema = Yup.object({
    email: Yup.string().email("Email is invalid").required("Please provide email"),
    password: Yup.string().required("Please provode password"),
  })