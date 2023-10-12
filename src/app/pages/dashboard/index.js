import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import "./dashboard.scss";
import SaleOrderCards from "./SaleOrderCards";
import MonthlySalesGraph from "./MonthlySalesGraph";
import SaleOrdersGraph from "./SaleOrdersGraph";
import SellingProductsTable from "./SellingProductsTable";
import PurchaseOrdersGraph from "./PurchaseOrdersGraph";

const Dashboard = () => {
  const [count, setCount] = useState(0);

  return (
    <>
      <Grid container spacing={0} className="busDashboardContainer">
        {/* Sale Orders Card */}
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <SaleOrderCards count={count} />
        </Grid>

        {/* Monthly Sale Orders Chart*/}
        <Grid pt="2rem" item xs={12} sm={12} md={12} lg={7} xl={7}>
          <MonthlySalesGraph count={count} />
        </Grid>

        {/* Sale Orders Chart */}
        <Grid p="2rem 0rem" item xs={12} sm={12} md={6} lg={5} xl={5}>
          <SaleOrdersGraph count={count} />
        </Grid>

        {/* Purchase Orders Chart */}
        <Grid pt="2rem" item xs={12} sm={12} md={6} lg={5} xl={5}>
          <PurchaseOrdersGraph count={count} />
        </Grid>

        {/* Top Selling Products Table */}
        <Grid pt="2rem" item xs={12} sm={12} md={12} lg={7} xl={7}>
          <SellingProductsTable count={count} />
        </Grid>
        {/* </Box> */}
      </Grid>
    </>
  );
};

export default Dashboard;
