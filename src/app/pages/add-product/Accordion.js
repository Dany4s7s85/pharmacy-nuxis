import React, { useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccordionInfo from "./AccordionDetail";

const AccordionFaq = ({ item, index, parentProps }) => {
  const [openAccordion, setOpenAccordion] = useState(false);

  return (
    <>
      <Accordion
        expanded={openAccordion}
        className="accordian"
        sx={{
          border: "none !important",
          borderBottom: "1px solid #CFD1D4 !important",
          borderRadius: "4px",
          overflow: "hidden",
          boxShadow: "none",
          backgroundColor: "transparent !important",
          my: "1rem",
        }}
        onChange={() => setOpenAccordion(!openAccordion)}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: "#101828 !important" }} />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography
            fontSize={16}
            fontWeight={500}
            fontStyle={"normal"}
            color={"#101828"}
          >
            {item?.question}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <AccordionInfo
            item={item}
            index={index}
            parentProps={parentProps}
            setOpenAccordion={setOpenAccordion}
          />
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default AccordionFaq;
