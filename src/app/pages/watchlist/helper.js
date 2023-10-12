import * as Yup from "yup";

export const initialValues = {
  //   product_name: "",
  DIN_NO: "",
};

export const Schema = Yup.object().shape({
  //   product_name: Yup.string().max(255).required("Product name is required"),
  DIN_NO: Yup.string()
    .max(255)
    .required("Drug identification number is required"),
});
