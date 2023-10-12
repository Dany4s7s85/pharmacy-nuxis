/* eslint-disable no-plusplus */

export const setCookie = (name, value, days) => {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = `; expires=${date.toUTCString()}`;
  }
  document.cookie = `${name}=${value || ""}${expires}; path=/`;

  return true;
};

export const getCookie = (name) => {
  const nameEQ = `${name}=`;
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

export const clearCookie = (name) => {
  document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;

  return true;
};

export const conversationModifier = (detail, convs) => {
  let tempConversations = [...convs];
  const conversationIndex = convs.findIndex(
    (item) => item?.product?._id === detail?.product?._id
  );
  if (conversationIndex > -1) {
    let conv = tempConversations[conversationIndex];
    tempConversations.splice(conversationIndex, 1);
    tempConversations.unshift(conv);
  } else {
    tempConversations.unshift(detail);
  }
  return tempConversations;
};

export function narcoticFilter(data) {
  let filteredData = [];
  // the if check is not necessary
  if (data.length > 0) {
    filteredData = data.filter(
      (el) => el.PRODUCT_CATEGORIZATION != "narcotics"
    );
  }
  return filteredData;
}

export function getRoutes() {
  let routes = [
    {
      path: "/watchlist",
      hasSidebar: false,
      hasHeader: true,
    },
    {
      path: "/marketplace",
      hasSidebar: false,
      hasAdminSidebar: false,
      hasHeader: true,
    },
    {
      path: "/wishlist",
      hasSidebar: false,
      hasAdminSidebar: false,
      hasHeader: true,
    },
    {
      path: "/productlisting",
      hasSidebar: false,
      hasAdminSidebar: false,
      hasHeader: true,
    },

    {
      path: "/bus/:view",
      hasSidebar: true,
      hasAdminSidebar: true,
      hasHeader: true,
    },
    {
      path: "/dash/:view",
      hasSidebar: true,
      hasAdminSidebar: false,
      hasHeader: true,
    },
    {
      path: "/products/:id/:din",
      hasSidebar: false,
      hasAdminSidebar: false,
      hasHeader: true,
    },
    {
      path: "/viewcart",
      hasSidebar: false,
      hasAdminSidebar: false,
      hasHeader: true,
    },
    {
      path: "/checkout",
      hasSidebar: false,
      hasAdminSidebar: false,
      hasHeader: true,
    },
    {
      path: "/dash/updatePassword",
      hasSidebar: true,
      hasAdminSidebar: false,
      hasHeader: true,
    },
  ];

  return routes;
}

export  function useSound(soundFile) {
    const audio = new Audio(soundFile);
    audio.play();

}
