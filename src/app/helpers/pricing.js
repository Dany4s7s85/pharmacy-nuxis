export const getTotalPrice = (arr) => {
  return arr.reduce((acc, curr) => {
    return acc + curr?.count * curr?.price;
  }, 0);
};

export const isConflictInQty = (arr) => {
  let yes = false;
  let errors = [];

  for (let i = 0; i < arr?.length; i++) {
    if (arr[i].count > arr[i]?.product?.quantity) {
      yes = true;
      errors.push(`${arr[i]?.product?.DIN_NUMBER}`);
    }
  }

  return { errors, yes };
};

export const isProductExpired = (date) => {
  let expired = false;

  if (new Date(date)?.getTime() < new Date()?.getTime()) {
    expired = true;
  }

  return expired;
};

export const checkProductExpired = (arr) => {
  let expired = false;
  let errors = [];

  for (let i = 0; i < arr?.length; i++) {
    if (
      new Date(arr[i]?.product?.expiry_date)?.getTime() < new Date()?.getTime()
    ) {
      expired = true;
      errors.push(`${arr[i]?.product?.DIN_NUMBER}`);
    }
  }

  return { errors, expired };
};

export const getTotalTax = (total, taxDetails = null) => {
  let tax = 0;
  let taxPercentage = "0%";

  if (taxDetails && taxDetails.tax_in_amount > 0) {
    tax = +Number(
      Number(taxDetails?.TotalTaxRate?.split("%")[0] / 100) * Number(total)
    ).toFixed(2);
  } else {
    tax = 0;
  }

  return tax >= 0 ? tax : "N/A";
};

export const getTotalOfCarts = (carts) => {
  let arr = [];
  for (let i = 0; i < carts?.length; i++) {
    for (let j = 0; j < carts[i]?.products?.length; j++) {
      if (carts[i].products[j].isChecked) {
        arr.push(carts[i].products[j]);
      }
    }
  }

  return arr.reduce((acc, curr) => {
    return acc + curr?.count * curr?.price;
  }, 0);
};

export const getShippingTotalOfCarts = (carts) => {
  let arr = [];
  for (let i = 0; i < carts?.length; i++) {
    for (let j = 0; j < carts[i]?.carts?.length; j++) {
      for (let k = 0; k < carts[i].carts[j]?.products?.length; k++) {
        if (carts[i].carts[j].products[k].isChecked) {
          arr.push(carts[i].carts[j].products[k]);
        }
      }
    }
  }

  return arr.reduce((acc, curr) => {
    return acc + curr?.count * curr?.price;
  }, 0);
};

export const getShippingTotal = (carts) => {
  let array = [];
  for (let i = 0; i < carts?.length; i++) {
    if (carts[i]?.products?.some((el) => el?.isChecked)) {
      array.push(carts[i]);
    }
  }

  return array.reduce((acc, currentValue) => {
    return (
      Number(acc) + Number(currentValue?.shipping?.selectedShipping?.total)
    );
  }, 0);
};

export const getAllShippingTotal = (carts) => {
  let array = [];
  for (let i = 0; i < carts?.length; i++) {
    for (let j = 0; j < carts[i]?.carts?.length; j++) {
      if (carts[i].carts[j]?.products?.some((el) => el?.isChecked)) {
        array.push(carts[i].carts[j]);
      }
    }
  }

  return array.reduce((acc, currentValue) => {
    return (
      Number(acc) + Number(currentValue?.shipping?.selectedShipping?.total)
    );
  }, 0);
};

export const getGrandTotal = (total, shippingTotal, taxTotal) => {
  let grandTotal = Number(total) + Number(shippingTotal) + Number(taxTotal);

  return Number(grandTotal).toFixed(2);
};

// export const getNotificationForBadge = (arr,key) => {
//
//     let arr.filter((el))
//
//
// };
