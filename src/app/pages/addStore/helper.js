import * as Yup from "yup";

export const initialValues = {
  store_name: "",
  email: "",
  location: "",
  mobile_no: "",
  store_license_number: "",
  id_type: "",
  store_fax_no: "",
  front_picture: "",
  back_picture: "",
  store_landline_num: "",
  type: "",
  GST_NO: "",
  PST_NO: "",
};

export const Schema = Yup.object().shape({
  store_name: Yup.string()
    .max(255)
    .min(3, "Store Name must be at least 3 characters.")
    .required("Store Name is required"),
  email: Yup.string().required("Email is required"),
  store_license_number: Yup.string()
    .max(255)
    .min(3, " license must be at least 3 characters.")
    .required("License is required"),
  location: Yup.string().max(700).required("Location is required"),
  mobile_no: Yup.string().max(255).required("Phone number is required"),
  type: Yup.string().max(255).required("Store type is required"),
  GST_NO: Yup.string().max(255).required("GST_NO is required"),
  PST_NO: Yup.string(),
  store_landline_num: Yup.number().required("Landline number required"),
  store_fax_no: Yup.number().required("Fax number required"),
  id_type: Yup.string().required("Identity type is required"),
  front_picture: Yup.string().required("front_picture type is required"),
  back_picture: Yup.string().required("back_picture type is required"),
});
