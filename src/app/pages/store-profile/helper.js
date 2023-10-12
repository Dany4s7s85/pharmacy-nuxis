import * as Yup from "yup";

export const initialValues = {
  pharmacy_name: "",
  email: "",
  country: "",
  state: "",
  city: "",
  location: "",
  pharmacy_photo: "",
};
export const Schema = Yup.object().shape({
  pharmacy_name: Yup.string()
    .min(3, "Pharmacy Name must be at least 3 characters.")
    .required(" Pharmacy Name is required!"),

  email: Yup.string()
    .email("Must be a valid email")
    .max(255)
    .required("Email is required"),
  city: Yup.string().required("City is required"),
  country: Yup.string().required("Country is required"),
  state: Yup.string().required("Province is required"),
  location: Yup.string().required("Address is required"),
  pharmacy_photo: Yup.string().required("Profile Image  is required"),
});
