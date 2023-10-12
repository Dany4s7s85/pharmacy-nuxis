import * as Yup from "yup";

export const initialValues = {
  product_name: "",
  din: "",
  brand: "",
  sub_brand: "",
  form: "",
  size: "",
  price: "",
  category_name: "",
  product_category_name: "",
  expiry_date: "",
  fullfillment: "",
  payment: "",
  quantity: "",
  description: "",
  imageCover: "",
  images: null,
};
export const dummyImages = [
  { thumbnail: "", full_image: "", public_id: "" },
  { thumbnail: "", full_image: "", public_id: "" },
  { thumbnail: "", full_image: "", public_id: "" },
];

export const Schema = Yup.object().shape({
  product_name: Yup.string().max(255).required("Product name is required"),
  brand: Yup.string().max(255).required("Brand is required"),

  DRUG_IDENTIFICATION_NUMBER: Yup.string()
    .max(255)
    .required("Drug identification number is required"),
  PRODUCT_CATEGORIZATION: Yup.string()
    .max(255)
    .required("Product categorization  is required"),
  DRUG_CODE: Yup.string().max(255).required("DRUG CODE is required"),
  CLASS: Yup.string().max(255).required("Class is required"),
  product_category_name: Yup.string()
    .max(255)
    .required("Product Category Name is required"),
  AI_GROUP_NO: Yup.string().max(255).required("AI_GROUP_NO is required"),
  PEDIATRIC_FLAG: Yup.string().max(255),
  NUMBER_OF_AIS: Yup.string().max(255),
  description: Yup.string().max(600).required("Description is required"),
  PACKAGING_SIZE: Yup.string().max(255).required("Packaging Size is required"),
  PRODUCT_FORM: Yup.string().max(255).required("Product Form is required"),
  expiry_date: Yup.date().required("Expiry date is required").nullable(),
  price: Yup.string().max(255).required("Price is required"),
  quantity: Yup.number().required("Quantity is required"),
  batch_number: Yup.string().max(255).required("Quantity is required"),
  imageCover: Yup.object({
    thumbnail: Yup.string(),
    public_id: Yup.string(),
    full_image: Yup.string().required("Image cover is required field"),
  }).required(),
});
export const inventoryInitialValues = {
  expiry_date: "",
  quantity: "",
  price: "",
};
export const inventorySchema = Yup.object().shape({
  expiry_date: Yup.date().required("Expiry date is required").nullable(),
  price: Yup.string().max(255).required("Price is required"),
  quantity: Yup.number().required("Quantity is required"),
});
export const addInventoryInitialValues = {
  expiry_date: "",
  quantity: "",
  price: "",
  DIN_NUMBER: "",
  // batch_number: "",
};
export const addInventorySchema = Yup.object().shape({
  expiry_date: Yup.date().required("Expiry date is required").nullable(),
  price: Yup.string().max(255).required("Price is required"),
  quantity: Yup.number().required("Quantity is required"),
  // batch_number: Yup.string().max(255).required("Quantity is required"),
});
