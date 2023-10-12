import React from "react";
import "./style.scss";
import { Button, Typography, InputLabel, Box } from "@mui/material";
const Index = (props) => {
  // : https://firebasestorage.googleapis.com/v0/b/nxus-8dc57.appspot.com/o/member%2Fsignatures%2Fsignature%3FFi9HFs1J.png-1675565347360?alt=media&token=4d551bbf-85a2-4df0-98c8-16d84e81c4a5
  return (
    <Box className="signature-prev-container">
      <Typography color={"#101828"} fontSize={14} fontWeight={500}>
        Signatures
      </Typography>
      <Box className="signature-prev-image">
        <img src={props?.url} />
        {props?.delete ? (
          <Button
            className="prev-img-clr outlined-white"
            variant="outlined"
            color="error"
            size="small"
            onClick={() => props?.handleDelete()}
          >
            Delete
          </Button>
        ) : (
          ""
        )}
      </Box>
    </Box>
  );
};

export default Index;
