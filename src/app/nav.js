import BorderColorIcon from "@mui/icons-material/BorderColor";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import Icon from "./assets/images/preOrderIcon.png";
import Pres from "./assets/images/rx-icon.png";
import sideDashboard from "./assets/images/sideDashboard.svg";
import sideSale from "./assets/images/sideSale.svg";
import sideProducts from "./assets/images/sideProducts.svg";
import sidePurchase from "./assets/images/sidePurchase.svg";
import sideProfile from "./assets/images/sideProfile.svg";

const sidnav = [
  {
    name: "Store Dashboard",
    file: "store-dashboard",
    navigations: true,
    live: true,
    buttons: [],
    icon: <img src={sideDashboard} />,
    link_to: "/dash/store-dashboard",
    link_for: null,
  },

  {
    name: "Products",
    file: "products",
    navigations: true,
    live: true,
    buttons: [],
    icon: <img src={sideProducts} />,
    link_to: "/dash/products",
    link_for: "product",
  },
  {
    name: "Sales Orders",
    file: "orders",
    navigations: true,
    live: true,
    buttons: [],
    icon: <img src={sideSale} />,
    link_to: "/dash/orders",
    link_for: "order-detail",
  },
  {
    name: "Purchase Orders",
    file: "purchaseOrders",
    navigations: true,
    live: true,
    buttons: [],
    icon: <img src={sidePurchase} />,
    link_to: "/dash/purchaseOrders",
    link_for: null,
  },
  {
    name: "Pre Orders",
    file: "preOrders",
    navigations: true,
    live: true,
    buttons: [],
    icon: <img src={Icon} />,
    link_to: "/dash/preOrders",
    link_for: null,
  },
  {
    name: "Prescriptions",
    file: "prescriptions",
    navigations: true,
    live: true,
    buttons: [],
    icon: <img src={Pres} />,
    link_to: "/dash/prescriptions",
    link_for: null,
  },

  {
    name: "Store Profile",
    file: "store-profile",
    navigations: true,
    live: true,
    buttons: [],
    icon: <img src={sideProfile} />,
    link_to: "/dash/store-profile",
    link_for: null,
  },

  {
    name: "Purchase Orders Detail",
    file: "purchaseOrders-detail",
    navigations: false,
    live: true,
    buttons: [],
    icon: <ShoppingBasketIcon style={{ color: "white", fontSize: "26px" }} />,
    link_to: "/dash/purchaseOrders-detail/:id",
    link_for: null,
  },

  {
    name: "Orders Detail",
    file: "order-detail",
    navigations: false,
    live: true,
    buttons: [],
    icon: <BorderColorIcon style={{ color: "white", fontSize: "26px" }} />,
    link_to: "/dash/order-detail/:id",
  },

  {
    name: "Add Product",
    file: "add-product",
    navigations: false,
    live: true,
    buttons: [],
    icon: <Inventory2Icon style={{ color: "white", fontSize: "26px" }} />,
    link_to: "/dash/add-product",
  },

  {
    name: "Edit Product",
    file: "edit-product",
    navigations: false,
    live: true,
    buttons: [],
    icon: <Inventory2Icon style={{ color: "white", fontSize: "26px" }} />,
    link_to: "/dash/edit-product",
  },
];
export default sidnav;
// PR
