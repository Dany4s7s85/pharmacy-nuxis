import * as Yup from "yup";

export const initialValues = {
  email: "",
  password: "",
  token: "",
};
export const Schema = Yup.object().shape({
  email: Yup.string()
    .email("Must be a valid email")
    .max(255)
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
  token: Yup.string(),
});
export const qrInitialValues = {
  token: "",
  email: "",
  password: "",
};
export const qrSchema = Yup.object().shape({
  email: Yup.string()
    .email("Must be a valid email")
    .max(255)
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
  token: Yup.string().required("Qr code is required"),
});
