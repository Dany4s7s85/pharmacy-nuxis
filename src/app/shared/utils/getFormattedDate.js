export const getFormattedDate = (newDate, duration, withTime = false) => {
  const date = new Date(newDate);
  const formattedDate =
    !withTime && !duration
      ? `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${(
          "0" + date.getDate()
        ).slice(-2)}`
      : withTime && !duration
      ? `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${(
          "0" + date.getDate()
        ).slice(-2)}T${("0" + date.getHours()).slice(-2)}:${(
          "0" + date.getMinutes()
        ).slice(-2)}:${("0" + date.getSeconds()).slice(-2)}`
      : duration
      ? `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${(
          "0" + date.getDate()
        ).slice(-2)}T${(Number(Number(date.getMinutes()) + Number(duration)) >
        59
          ? "0" + (Number(date.getHours()) + 1)
          : "0" + date.getHours()
        ).slice(-2)}:${
          Number(date.getMinutes()) + Number(duration) < 59
            ? ("0" + (Number(date.getMinutes()) + Number(duration))).slice(-2)
            : (
                "0" + Number(Number(date.getMinutes()) + Number(duration) - 60)
              ).slice(-2)
        }:${("0" + date.getSeconds()).slice(-2)}`
      : "";

  return formattedDate;
};
