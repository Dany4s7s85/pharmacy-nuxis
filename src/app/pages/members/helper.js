import * as Yup from "yup";
export const initialValues = {
  first_name: "",
  last_name: "",
  mobile_no: "",
  email: "",
  role: "",
  allowed_stores: [],
  location: "",
  permissions: [],
  business: { permissions: ["profile.nav", "pharmacies.nav"] },
};
export const Schema = Yup.object().shape({
  first_name: Yup.string()
    .min(3, "First Name must be at least 3 characters.")
    .required(" First Name is required!"),
  last_name: Yup.string()
    .min(3, "Last Name must be at least 3 characters.")
    .required(" Last Name is required"),
  mobile_no: Yup.string().required("Phone number is required"),
  role: Yup.string().required("Role is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  allowed_stores: Yup.array().min(1, "Pharmacies is required field"),
  location: Yup.string().max(700).required("Location is required"),
  business: Yup.object().shape({
    business: Yup.string(),
    permissions: Yup.array().of(Yup.string()).min(1, "messageHere"),
  }),

  permissions: Yup.array().of(
    Yup.object().shape({
      pharmacy: Yup.object().shape({
        id: Yup.string(),
        pharmacy: Yup.string(),
      }),
      permissions: Yup.array().of(Yup.string()).min(1, "messageHere"),
    })
  ),
});
