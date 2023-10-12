export const getTotal = (arr) => {
  return arr.reduce((acc, curr) => {
    return acc + curr.totalSaleAmount;
  }, 0);
};

export const getTotalPercentage = (arr) => {
  const totalPercentageChange = arr.reduce((acc, curr) => {
    return acc + (curr?.percentageChange || 0);
  }, 0);

  const averagePercentageChange = totalPercentageChange / 5;
  return averagePercentageChange;
};

export const getTotalCount = (arr) => {
  return arr.reduce((acc, curr) => {
    return acc + curr.count;
  }, 0);
};

export const formatNumberWithCommas = (value) => {
  const parts = value?.toString()?.split(".");
  if (parts) {
    let integerPart = parts[0];
    const decimalPart = parts[1] ? "." + parts[1] : "";
    const integerPartWithCommas = integerPart?.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      ","
    );
    const formattedValue = integerPartWithCommas + decimalPart;
    return formattedValue;
  }
};

function getMonthName(monthNumber) {
  const date = new Date(2000, monthNumber - 1, 1);
  return date?.toLocaleString("en-US", { month: "short" });
}

export const getMonthsArrayWithNames = (data) => {
  const monthsArray = data?.map((item) => item?.month);
  const monthNamesArray = monthsArray?.map((monthNumber) =>
    getMonthName(monthNumber)
  );
  return monthNamesArray;
};
