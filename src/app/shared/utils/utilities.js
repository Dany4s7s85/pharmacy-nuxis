export function findURLParam(key, location) {
  let param,
    params_arr = [],
    queryString = location.indexOf("?") !== -1 ? location.split("?")[1] : "";
  if (queryString !== "") {
    params_arr = queryString.split("&");
    for (var i = params_arr.length - 1; i >= 0; i -= 1) {
      param = params_arr[i].split("=")[0];
      if (param === key) {
        return params_arr[i];
      }
    }
  }
}

export const isLogin = () => {
  if (localStorage.getItem("token")) {
    return true;
  }
  return false;
};
