export const capitalize = (str) => {
  let string = "";

  if (!str) {
    return "N/A";
  }
  string = str.replace(new RegExp("(?:\\b|_)([a-z])", "g"), function ($1) {
    return $1.toUpperCase();
  });

  return string;
};

export function generateRandom() {
  var length = 8,
    charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    retVal = "";
  for (var i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}

export function removeDuplicates(array, key) {
  let lookup = {};
  array.forEach((element) => {
    lookup[element[key]] = element;
  });
  return Object.keys(lookup).map((key) => lookup[key]);
}

export const redirectForPageURL = (url) => {
  let notif = url;
  let pageURL;
  if (notif) {
    let randomNum = Math.floor(Math.random() * 90000) + 10000;
    let modId = notif?.doc?.typeId ? notif?.doc?.typeId : "";
    if (notif?.doc?.for_page?.includes("order-detail")) {
      pageURL = `/dash/order-detail?oid=${notif?.doc?.typeId}&ranId=${randomNum}`;
    } else if (notif?.doc?.for_page?.includes("purchaseOrders-detail")) {
      pageURL = `/dash/purchaseOrders-detail?pid=${notif?.doc?.typeId}&ranId=${randomNum}`;
    } else if (notif?.doc?.for_page?.includes("preOrders")) {
      pageURL = `${notif?.doc?.for_page}?modId=${modId}&ranId=${randomNum}`;
    } else if (notif?.doc?.type == "products") {
      pageURL = notif?.doc?.for_page;
    } else if (notif?.doc?.type == "members") {
      pageURL = "/bus/profile";
    } else {
      pageURL = notif?.doc?.for_page;
    }
    return pageURL;
  }
};
