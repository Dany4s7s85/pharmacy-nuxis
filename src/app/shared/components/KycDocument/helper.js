import * as Yup from "yup";
export const initialValues = {
  id_type: "",
  front_picture: "",
  back_picture: "",
  signature:'',
  license_no:'',
};
export const Schema = Yup.object().shape({
  id_type: Yup.string().required("Identity type is required"),
  front_picture: Yup.string().required("front_picture type is required"),
  back_picture: Yup.string().required("back_picture type is required"),
  is_pharmacist: Yup.boolean(),

  signature: Yup.string().when('is_pharmacist', {
    is: (is_pharmacist) => is_pharmacist == true  ? true : false,//just an e.g. you can return a function
    then: Yup.string().required('Signatures are mandatory'),
    otherwise: Yup.string()
  }),
  license_no: Yup.string().when('is_pharmacist', {
    is: (is_pharmacist) => is_pharmacist == true  ? true : false,//just an e.g. you can return a function
    then: Yup.string().required('Signatures are mandatory'),
    otherwise: Yup.string()
  }),
});
