import * as Yup from "yup";

export const initialValues = {
  business_name: "",
  business_owner_name: "",
  email: "",
  country: "",
  state: "",
  city: "",
  location: "",
  business_photo: "",
};
export const Schema = Yup.object().shape({
  business_name: Yup.string()
    .min(3, "Pharmacy Name must be at least 3 characters.")
    .required(" Pharmacy Name is required!"),
  business_owner_name: Yup.string().required("Business Owner is required"),
  email: Yup.string()
    .email("Must be a valid email")
    .max(255)
    .required("Email is required"),
  city: Yup.string().required("City is required"),
  country: Yup.string().required("Country is required"),
  state: Yup.string().required("Province is required"),
  location: Yup.string().required("Address is required"),
  business_photo: Yup.string().required("Profile Image  is required"),
});
export const memberInitialValues = {
  first_name: "",
  last_name: "",
  email: "",
  business_photo: "",
};
export const memberSchema = Yup.object().shape({
  first_name: Yup.string().required("First Name is required"),
  last_name: Yup.string().required("Last Name is required"),
  email: Yup.string()
    .email("Must be a valid email")
    .max(255)
    .required("Email is required"),

  profile_photo: Yup.string().required("Profile Image  is required"),
});
