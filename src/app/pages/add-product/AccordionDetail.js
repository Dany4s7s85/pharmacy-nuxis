import React from "react";
import { Button, Stack, TextField } from "@mui/material";
import { Schema } from "./faqs";
import * as Yup from "yup";
import { Formik } from "formik";

const AccordionDetail = ({ item, index, parentProps, setOpenAccordion }) => {

    const handleDelete = () => {

        let faqs = [...parentProps?.values?.faqs]
        faqs.splice(index, 1)
        parentProps.setValues({ ...parentProps?.values, faqs })

    }

    return (

        <Formik
            initialValues={{ ...item }}
            enableReinitialize={true}
            onSubmit={(values, { resetForm }) => {


                let faqs = [...parentProps?.values?.faqs]
                faqs[index] = { ...values }
                parentProps.setValues({ ...parentProps?.values, faqs: faqs })
                setOpenAccordion(false)

            }}
            validationSchema={Schema}
        >
            {(props) => (

                <form autoComplete="off" onSubmit={props.handleSubmit}>
                    <Stack direction={"column"} gap={2}>
                        <TextField
                            id="outlined-basic"
                            label="Question"
                            variant="outlined"
                            fullWidth
                            value={props?.values?.question}
                            onChange={props?.handleChange}
                            onBlur={props?.handleBlur}
                            name="question"
                            error={
                                props?.touched?.question &&
                                Boolean(props?.errors?.question)
                            }
                            required
                        />
                        <TextField
                            fullWidth
                            id="outlined-multiline-static"
                            label="Answer"
                            multiline
                            rows={4}
                            value={props?.values?.answer}
                            onChange={props?.handleChange}
                            onBlur={props?.handleBlur}
                            name="answer"
                            error={
                                props?.touched?.answer &&
                                Boolean(props?.errors?.answer)
                            }
                        />
                        <Stack direction={"row"} justifyContent={"space-between"} gap={1}>
                            <Button variant="outlined" color="error" onClick={handleDelete}>
                                Delete
                            </Button>
                            <Stack direction={"row"} gap={1}>
                                <Button variant="outlined" sx={{ padding: { xs: "5px 5px !important", sm: "5px 20px !important" } }} color="primary" onClick={() => { props.setValues({ ...item }); setOpenAccordion(false) }}>
                                    Cancel
                                </Button>
                                <Button
                                    sx={{ padding: { xs: "5px 5px !important", sm: "5px 20px !important" } }}
                                    variant="contained"
                                    className="containedPrimary"
                                    color="primary"
                                    onClick={props.handleSubmit}
                                >
                                    Update
                                </Button>
                            </Stack>
                        </Stack>
                    </Stack>
                </form>
            )}
        </Formik>
    )
}



export default AccordionDetail