import Icon from "./assets/images/preOrderIcon.png";
import Pres from "./assets/images/rx-icon.png";
import sideDashboard from "./assets/images/sideDashboard.svg";
import sideStore from "./assets/images/sideStore.svg";
import sideMember from "./assets/images/sideMember.svg";
import sideSale from "./assets/images/sideSale.svg";
import sideProducts from "./assets/images/sideProducts.svg";
import sidePurchase from "./assets/images/sidePurchase.svg";
import sideProfile from "./assets/images/sideProfile.svg";

const sidnavAdmin = [
  {
    name: "Dashboard",
    file: "dashboard",
    navigations: true,
    live: true,
    buttons: [],
    icon: <img src={sideDashboard} />,
    link_to: "/bus/dashboard",
  },
  {
    name: "Stores",
    file: "stores",
    navigations: true,
    live: true,
    buttons: [],
    icon: <img src={sideStore} />,
    link_to: "/bus/stores",
  },
  {
    name: "Members",
    file: "members",
    navigations: true,
    live: true,
    buttons: [],
    icon: <img src={sideMember} />,
    link_to: "/bus/members",
  },
  {
    name: "Products",
    file: "business-products",
    navigations: true,
    live: true,
    buttons: [],
    icon: <img src={sideProducts} />,
    link_to: "/bus/business-products",
  },
  {
    name: "Sales Orders",
    file: "business-orders",
    navigations: true,
    live: true,
    buttons: [],
    icon: <img src={sideSale} />,
    link_to: "/bus/business-orders",
  },
  {
    name: "Purchase Orders",
    file: "business-purchase",
    navigations: true,
    live: true,
    buttons: [],
    icon: <img src={sidePurchase} />,
    link_to: "/bus/business-purchase",
  },

  {
    name: "Pre Orders",
    file: "business-preOrders",
    navigations: true,
    live: true,
    buttons: [],
    icon: <img src={Icon} />,
    link_to: "/bus/business-preOrders",
  },

  {
    name: "Prescriptions",
    file: "business-prescriptions",
    navigations: true,
    live: true,
    buttons: [],
    icon: <img src={Pres} />,
    link_to: "/bus/business-prescriptions",
  },

  {
    name: "Profile",
    file: "profile",
    navigations: true,
    live: true,
    buttons: [],
    icon: <img src={sideProfile} />,
    link_to: "/bus/profile",
  },
];
export default sidnavAdmin;
