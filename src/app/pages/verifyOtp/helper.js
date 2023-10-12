import * as Yup from "yup";

export const initialValues = {

  otp: "",
};
export const Schema = Yup.object().shape({

  otp: Yup.string().required("OTP code is required"),
});
