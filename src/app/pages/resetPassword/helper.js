import * as Yup from "yup";

export const initialValues = {
  password: "",
  confirmPassword:""
};
export const Schema = Yup.object().shape({
    password: Yup.string().required("Password is required"),
    confirmPassword: Yup.string()
      .required("Confirm pasword required")
      .oneOf([Yup.ref("password"), null], "Password must match"),
});
