import React from "react";
import { styled } from "@mui/system";

const Separator = styled("div")({
  width: "95%",
  height: "1px",
  position: "relative",
  marginTop: "20px",
  marginBottom: "10px",
});

const DateLabel = styled("span")({
  position: "absolute",
  left: "45%",
  top: "-10px",
  color: "#818790",
  padding: "0 5px",
  fontSize: "12px",
  fontWeight: "300",
});

const DateSeparator = ({ date }) => {
  return (
    <Separator>
      <DateLabel>{date}</DateLabel>
    </Separator>
  );
};

export default DateSeparator;
