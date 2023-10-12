import * as Yup from "yup";

export const initialValues = {
  business_name: "",
  business_owner_name: "",
  business_landline_num: "",
  fax_no: "",
  mobile_no: "",
  location: "",
  email: "",
  password: "",
  confirmPassword: "",
  store_name: "",
  store_owner: "",
  store_mobile_no: "",
  store_license_number: "",
  store_location: "",
  store_landline_num: "",
  store_fax_no: "",
  type: "",
  GST_NO: "",
  PST_NO: "",
  is_pharmacist: false,
  signature: "",
  license_number: "",
};

export const Schema = Yup.object().shape({
  business_name: Yup.string()
    .max(255)
    .min(3, "Business Name must be at least 3 characters.")
    .required(" Business Name is required"),
  business_owner_name: Yup.string()
    .max(255)
    .min(3, " Business Owner must be at least 3 characters.")
    .required("Business Owner is required"),

  email: Yup.string()
    .email("Must be a valid email")
    .max(255)
    .required("Email is required"),
  location: Yup.string().max(700).required("Location is required"),

  mobile_no: Yup.string().max(255).required("Phone number is required"),

  business_landline_num: Yup.number()
    .required("Business Landline number required")
    .min(0, "Not negative number"),
  fax_no: Yup.number()
    .required("Business Fax number required")
    .min(0, "Not negative number"),

  password: Yup.string()
    .max(255)
    .required("Password is required.")
    .min(8, "Password is too short it should be 8 characters minimum.")
    .matches(
      /^(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]/,
      "Password must include one upper case, and at least one number."
    ),
  confirmPassword: Yup.string()
    .required("Confirm Password is required")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),

  store_name: Yup.string()
    .max(255)
    .min(3, "Store Name must be at least 3 characters.")
    .required("Store is required"),
  store_owner: Yup.string()
    .max(255)
    .min(3, " Name must be at least 3 characters.")
    .required("Name is required"),
  store_location: Yup.string().max(700).required(" Store Location is required"),
  store_license_number: Yup.string()
    .max(255)
    .min(3, " license must be at least 3 characters.")
    .required("License is required"),
  store_mobile_no: Yup.string().max(255).required("Phone number is required"),

  store_landline_num: Yup.number()
    .required("Store Landline number required")
    .min(0, "Not negative number"),

  store_fax_no: Yup.number()
    .required("Store Fax number required")
    .min(0, "Not negative number"),
  GST_NO: Yup.string().max(255).required("GST_NO is required"),
  PST_NO: Yup.string().max(255),
  type: Yup.string().max(255).required("type is required"),

  is_pharmacist: Yup.boolean(),

  signature: Yup.string().when("is_pharmacist", {
    is: (is_pharmacist) => (is_pharmacist == true ? true : false), //just an e.g. you can return a function
    then: Yup.string().required("Signatures are mandatory"),
    otherwise: Yup.string(),
  }),
  license_number: Yup.string().when("is_pharmacist", {
    is: (is_pharmacist) => (is_pharmacist == true ? true : false), //just an e.g. you can return a function
    then: Yup.string().required("License Number is mandatory"),
    otherwise: Yup.string(),
  }),
});
