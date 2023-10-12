import React, { useEffect, useState } from "react";
import Pagination from "@mui/material/Pagination";
import "./pagination.scss";
import Box from "@mui/material/Box";
import { PaginationItem } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

function Paginations(props) {
  const { onPageChange = () => null, totalCount, page } = props;

  return (
    <Box>
      <Pagination
        count={totalCount}
        className="custom-pagination-item-selected"
        // variant="outlined"
        // color="primary"
        page={page}
        onChange={(e, value) => onPageChange(e, value)}
        renderItem={(item) => (
          <PaginationItem
            slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
            {...item}
          />
        )}
      />
    </Box>
  );
}

export default React.memo(Paginations);
