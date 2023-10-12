import * as Yup from "yup";

export const initialValues = {
  password: "",
  confirmPassword: "",
  currentPassword: "",
};
export const Schema = Yup.object().shape({
  currentPassword: Yup.string().required(" Current Password is required"),
  password: Yup.string().required("Password is required"),
  confirmPassword: Yup.string()
    .required("Confirm pasword required")
    .oneOf([Yup.ref("password"), null], "Password must match"),
});
