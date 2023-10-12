import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import SaleOrdersCards from "./SaleOrdersCards";
import MonthlyOrdersGraph from "./MonthlyOrdersGraph";
import SaleOrderGraph from "./SaleOrderGraph";
import SellingOrdersTable from "./SellingOrdersTable";
import PurchaseOrderGraph from "./PurchaseOrderGraph";

function StoreDashboard() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Grid container spacing={0} className="busDashboardContainer">
        {/* Sale Orders Card */}
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <SaleOrdersCards count={count} />
        </Grid>

        {/* Monthly Sale Orders Chart*/}
        <Grid pt="2rem" item xs={12} sm={12} md={12} lg={7} xl={7}>
          <MonthlyOrdersGraph count={count} />
        </Grid>

        {/* Sale Orders Chart */}
        <Grid p="2rem 0rem" item xs={12} sm={12} md={6} lg={5} xl={5}>
          <SaleOrderGraph count={count} />
        </Grid>

        {/* Purchase Orders Chart */}
        <Grid pt="2rem" item xs={12} sm={12} md={6} lg={5} xl={5}>
          <PurchaseOrderGraph count={count} />
        </Grid>

        {/* Top Selling Products Table */}
        <Grid pt="2rem" item xs={12} sm={12} md={12} lg={7} xl={7}>
          <SellingOrdersTable count={count} />
        </Grid>
        {/* </Box> */}
      </Grid>
    </>
  );
}

export default StoreDashboard;
