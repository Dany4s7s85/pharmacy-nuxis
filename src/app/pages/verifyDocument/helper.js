import * as Yup from "yup";
const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png"];
export const initialValues = {
  id_type: "",
  front_picture: '',
  back_picture: '',
};
export const Schema = Yup.object().shape({
  id_type: Yup.string().required("Identity type is required"),
  front_picture: Yup.string().required("front_picture type is required"),
  back_picture: Yup.string().required("back_picture type is required"),

});
