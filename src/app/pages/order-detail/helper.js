import * as Yup from "yup";

export const initialValues = {
  returns: [],
};

export const Schema = Yup.object().shape({
  quantity: Yup.number().required("Quantity is required"),
  reason: Yup.string().max(255).required(" Reason is required"),
  restock: Yup.boolean(),
});
