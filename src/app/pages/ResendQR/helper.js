import * as Yup from "yup";

export const initialValues = {
  email: "",
};
export const Schema = Yup.object().shape({
  email: Yup.string()
    .email("Must be a valid email")
    .max(255)
    .required("Email is required"),
});
