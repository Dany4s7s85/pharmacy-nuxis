import API from "../config";
import URLS from "../../constants/urls";

/**
 * get starship details
 *
 * @param {Number} starshipId starship ID
 * @returns api response
 */
export const _getStarshipDetails = (starshipId) => {
  return API.get(`${URLS.GET_STARSHIP_DETAILS}${starshipId}/`);
};
export const _signIn_QR = (data) => {
  return API.post(`${URLS.USER_LOGIN_QR}`, data);
};

export const _userSignUpDetails = (data) => {
  return API.post(`${URLS.USER_SIGNUP_DETAILS}`, data);
};
export const _getProductDetail = (id) => {
  return API.get(`${URLS.PRODUCT_DETAIL}${id}`);
};

export const _pharmacyLoginDetails = (data) => {
  return API.post(`${URLS.PHARMACY_LOGIN}`, data);
};
export const _uploadVerificationDocsDetails = (formdata, is_reuploaded) => {
  let url = `${URLS.UPLOAD_VERIFICATION_DOCUMENT}`;
  if (is_reuploaded) {
    url = "/store/auth/re-uploadVerificationDocs";
  }
  return API.post(`${url}`, formdata);
};

export const _pharmacySignUpDetails = (data) => {
  return API.post(`${URLS.BUSINESS_SIGNUP_DETAILS}`, data);
};
export const _pharmacyVerifyOtp = (data) => {
  return API.post(`${URLS.PHARMACY_VERIFY_OTP}`, data);
};
export const _resendPharmacyVerifyOtp = (data) => {
  return API.post(`${URLS.PHARMACY_RESEND_VERIFY_OTP}`, data);
};

export const _createPharmacyProductDetails = (data) => {
  return API.post(`${URLS.CREATE_PHARMACY_PRODUCT}`, data);
};
// export const _uploadProductImage=(obj)=>{
//   return API.patch(`${URLS.UPLOAD_PRODUCT_IMAGE}`,obj)
// }
export const _getRootCategories = () => {
  return API.get(`${URLS.ROOT_CATEGORY}`);
};
export const _getProductCategories = () => {
  return API.get(`${URLS.PRODUCT_CATEGORY}`);
};
// export const _getEmailVerificationDetails = (id, string) => {
//   return API.get(`${URLS.EMAIL_VERIFICATION_REQUEST}${id}/${string}`);
// };
export const _getForgotPasswordDetails = (email) => {
  return API.post(`${URLS.FORGOT_PASSWORD_REQUEST}`, email);
};
export const _CreatePasswordDetails = (data, id) => {
  return API.post(`${URLS.CREATE_PASSWORD_REQUEST}${id}`, data);
};
export const _getResetPasswordDetails = (data, id) => {
  return API.patch(`${URLS.RESET_PASSWORD_REQUEST}${id}`, data);
};
export const _getUpdatePasswordDetails = (data) => {
  return API.patch(`${URLS.UPDATE_PASSWORD_REQUEST}`, data);
};
export const _getUpdateProfileDetails = (data) => {
  return API.patch(`${URLS.PHARMACY_PROFILE_REQUEST}`, data);
};
export const _updateBusinessProfileDetails = (data) => {
  return API.patch(`${URLS.UPDATE_BUSINESS_PROFILE}`, data);
};
export const _updateBusinessPassword = (data) => {
  return API.patch(`${URLS.UPDATE_BUSINESS_PASSWORD}`, data);
};
export const _resendQR = (body) => {
  return API.post(`${URLS.RESEND_QR}`, body, { timeout: 8000 });
};

export const _getLandingPageProducts = () => {
  return API.get(`${URLS.GET_PHARMACY_PRODUCTS}`);
};
export const _getPharmacyProductList = async (
  pharmacyId,
  search,
  status,
  page,
  limit = 10
) => {
  let url = `${URLS.PRODUCTS}/store/${pharmacyId}/?page=${
    page ? page : ""
  }&limit=${limit ? limit : ""}`;
  if (search) {
    url += `&search=${search ? search : ""}`;
  }
  if (status) {
    url += `&status=${status ? status : ""}`;
  }
  return API.get(`${url}`, { timeout: 20000 });
};

export const _getPharmacyProduct = (id) => {
  return API.get(`${URLS.PRODUCTS}/${id}`, { timeout: 20000 });
};

export const _addProduct = (data) => {
  return API.post(`${URLS.PRODUCTS}`, data);
};

export const _getProductByDin = (din) => {
  return API.get(`${URLS.PRODUCTS}/qrmy-product/${din}`, { timeout: 20000 });
};

export const _uploadProductImage = (data) => {
  const config = {
    headers: {
      "content-type": "multipart/form-data",
    },
  };
  return API.post(`${URLS.PRODUCTS}/upload-product-image`, data, config);
};

export const _removeProductImage = (data) => {
  return API.post(`${URLS.PRODUCTS}/remove-product-image`, data);
};
export const _getLandingPageCategories = () => {
  return API.get(`${URLS.GET_PRODUCT_CATEGORIES}?limit=100`);
};
export const _getSameProductInventory = (din, filterValue) => {
  return API.get(
    `${URLS.GET_SAME_PRODUCT_INVENTORY}${din}?sort=${filterValue}`
  );
};

export const _getInventoryByDetail = (din, filterValue) => {
  return API.get(
    `${URLS.GET_PRODUCT_INVENTORY_BY_DETAIL}${din}?sort=${filterValue}`
  );
};

export const _getSimilarProducts = (id) => {
  return API.get(`${URLS.SIMILAR_PRODUCTS}${id}`);
};

export const _createPharmacyOrder = (data) => {
  return API.post(`${URLS.CREATE_ORDER}`, data);
};

export const _deletePurchaseOrder = (id) => {
  return API.delete(`${URLS.DELETE_PURCHASE_ORDER}${id}`);
};

export const _updatePurchaseOrder = (id, data) => {
  return API.patch(`${URLS.DELETE_PURCHASE_ORDER}${id}`, data);
};

export const _getPurchaseOrders = async (search, status, page, limit = 10) => {
  let url = `${URLS.PURCHASE_ORDER}/?page=${page ? page : ""}&limit=${
    limit ? limit : ""
  }`;
  if (search) {
    url += `&order_no=${search ? search : ""}`;
  }
  if (status) {
    url += `&orderStatus=${status ? status : ""}`;
  }
  return API.get(`${url}`, { timeout: 20000 });
};
export const _getPharmacyOrders = async (search, status, page, limit = 10) => {
  let url = `${URLS.GET_ORDERS}/?page=${page ? page : ""}&limit=${
    limit ? limit : ""
  }`;
  if (search) {
    url += `&order_no=${search ? search : ""}`;
  }
  if (status) {
    url += `&orderStatus=${status ? status : ""}`;
  }
  return API.get(`${url}`, { timeout: 20000 });
};
export const _getOrderDetail = (id) => {
  return API.get(`${URLS.ORDER_DETAIL}/${id}`);
};

export const _generateOrderQR = (id, forType) => {
  return API.get(`${URLS.ORDER_DETAIL}/generate-qr/${id}?forType=${forType}`);
};

export const _generatePDF = (id) => {
  return API.get(`${URLS.ORDER_DETAIL}/${id}/generate-pdf`, {
    responseType: "arraybuffer",
  });
};

export const _generatePrescriptionPDF = (id) => {
  return API.get(`${URLS.ORDERS_PRESCRIPTION}/${id}/generate-pdf`, {
    responseType: "arraybuffer",
  });
};

export const _generateAllOrdersPDF = async (
  search,
  status,
  page,
  limit = 10
) => {
  let url = `${URLS.ORDER_DETAIL}/generatePdf?page=${page ? page : ""}&limit=${
    limit ? limit : ""
  }`;
  if (search) {
    url += `&order_no=${search ? search : ""}`;
  }
  if (status) {
    url += `&orderStatus=${status ? status : ""}`;
  }
  return API.get(`${url}`, {
    responseType: "arraybuffer",
  });
};

export const _scanQR = (token) => {
  return API.get(`${URLS.ORDER_DETAIL}/scan-qr/${token}`);
};

export const _purchaseOrderDetail = (id) => {
  return API.get(`${URLS.PURCHASE_ORDER}/${id}`);
};
export const _saveCart = (data) => {
  return API.post(`${URLS.SAVE_CART}`, data);
};
export const _getCart = () => {
  return API.get(`${URLS.GET_CART}`);
};

export const _getRestoreCart = () => {
  return API.get(`${URLS.GET_CART}/restore-cart`);
};

export const _emptyCart = () => {
  return API.put(`${URLS.EMPTY_CART}`, { timeout: 20000 });
};
export const _getAdminNotificationList = async (page, limit = 10) => {
  let url = `${URLS.NOTIFICATIONS}/?page=${page ? page : ""}&limit=${
    limit ? 10 : ""
  }`;

  return API.get(`${url}`, { timeout: 20000 });
};

export const _updateAdminNotification = () => {
  return API.patch(`${URLS.NOTIFICATIONS}`, { timeout: 10000 });
};

export const _getPharmacyMembers = async (search, status, page, limit = 10) => {
  let url = `${URLS.MEMBER}/?page=${page ? page : ""}&limit=${
    limit ? limit : ""
  }`;
  if (search) {
    url += `&search=${search ? search : ""}`;
  }
  if (status) {
    url += `&status=${status ? status : ""}`;
  }
  return API.get(`${url}`, { timeout: 20000 });
};

export const _addMember = (data) => {
  return API.post(`${URLS.CREATE_MEMBER}`, data);
};

export const _sentLinkAgainTOAddMember = (id) => {
  return API.post(`${URLS.MEMBER}/${id}/resend-link`);
};

export const _updateOrderStatus = (id, data) => {
  return API.patch(`${URLS.ORDER_DETAIL}/${id}`, data, { timeout: 600000 });
};

export const _rejectOrder = (id) => {
  return API.put(`${URLS.ORDER_DETAIL}/${id}/cancel`, {
    timeout: 10000,
  });
};

export const _cancelOrderBuyer = (id) => {
  return API.patch(`${URLS.ORDER_DETAIL}/${id}/cancel/buyer`, {
    timeout: 10000,
  });
};

export const _acceptOrderBuyer = (id) => {
  return API.patch(`${URLS.ORDER_DETAIL}/${id}/accept`, {
    timeout: 10000,
  });
};

export const _returnOrder = (id, data) => {
  return API.put(`${URLS.ORDER_DETAIL}/${id}`, data, {
    timeout: 10000,
  });
};

export const _updateCart = (data) => {
  return API.patch(`${URLS.SAVE_CART}`, data);
};
export const _editProductDetail = (id) => {
  return API.get(`${URLS.EDIT_PRODUCT_DETAIL}${id}`);
};
export const _getAllProductInventories = (id, page, limit = 10) => {
  return API.get(
    `${URLS.GET_INVENTORY_BY_PRODUCT_ID}${id}/inventory/?page=${
      page ? page : ""
    }&limit=${limit ? limit : ""}`
  );
};
export const _deleteProductInevntory = (id) => {
  return API.delete(`${URLS.DELETE_PRODUCT_INVENTORY}${id}`);
};
export const _getProductInventoryDetail = (id) => {
  return API.get(`${URLS.GET_PRODUCT_INVENTORY_DETAIL}${id}`);
};
export const _updateProductInventory = (id, data) => {
  return API.patch(`${URLS.UPDATE_PRODUCT_INVENTORY}${id}`, data);
};

export const _getMemberDetail = (id) => {
  return API.get(`${URLS.UPDATE_MEMBER}/${id}`);
};
export const _updateMember = (id, data) => {
  return API.patch(`${URLS.UPDATE_MEMBER}/${id}`, data);
};

export const _addProductInventory = (data) => {
  return API.post(`${URLS.ADD_PRODUCT_INVENTORY}`, data);
};

export const _getInventoryWishLists = () => {
  return API.get(`${URLS.PRODUCT_INVENTORY_WISHLIST}`);
};

export const _addInventoryWishList = (data) => {
  return API.post(`${URLS.PRODUCT_INVENTORY_WISHLIST}`, data);
};

export const _removeInventoryWishList = (id) => {
  return API.put(`${URLS.PRODUCT_INVENTORY_WISHLIST}${id}`);
};

export const _getCurrentUserPermissions = () => {
  return API.get(`${URLS.USER_PERMISSIONS}`);
};

export const _getCurrentUserPharmacyPermissions = (id) => {
  return API.get(`${URLS.PHARMACY_PERMISSIONS}?store=${id}`);
};

export const _getAllPermissions = () => {
  return API.get(`${URLS.GET_ALL_PERMISSIONS}`);
};

export const _getCurrentUserPharmacies = async (
  search,
  status,
  page,
  limit = 10
) => {
  let url = `${URLS.GET_CURRENT_USER_PHARMACIES}/?page=${
    page ? page : ""
  }&limit=${limit ? limit : ""}`;
  if (search) {
    url += `&search=${search ? search : ""}`;
  }
  if (status) {
    url += `&status=${status ? status : ""}`;
  }
  return API.get(`${url}`, { timeout: 20000 });
};

export const _addBusinessPharmacy = (data) => {
  return API.post(`${URLS.ADD_BUSINESS_PHARMACY}`, data);
};

export const _getAllPharms = () => {
  return API.get(`${URLS.GET_PHARMS}`);
};

export const _getPharmToken = (id) => {
  return API.get(`${URLS.GET_PHARM_TOKEN}/${id}`);
};
export const _getMemberNotification = (page, limit = 10) => {
  return API.get(
    `${URLS.GET_MEMBER_NOTIFICATION}/?page=${page ? page : ""}&limit=${
      limit ? limit : ""
    }`
  );
};
export const _updateMemberNotification = () => {
  return API.patch(`${URLS.UPDATE_MEMBER_NOTIFICATION}`);
};
export const _getBusinessNotification = (page, limit = 10) => {
  return API.get(
    `${URLS.GET_BUSINESS_NOTIFICATION}/?page=${page ? page : ""}&limit=${
      limit ? limit : ""
    }`
  );
};

export const _updateBusinessNotification = () => {
  return API.patch(`${URLS.UPDATE_BUSINESS_NOTIFICATION}`);
};

export const _updateMemberProfile = (data) => {
  return API.patch(`${URLS.UPDATE_MEMBER_PROFILE}`, data);
};
export const _updateMemberPassword = (data) => {
  return API.patch(`${URLS.UPDATE_MEMBER_PASSWORD}`, data);
};
export const _uploadKycDocument = (data) => {
  return API.post(`${URLS.UPLOAD_KYC_DOCUMENT}`, data);
};
export const _getKycDocument = () => {
  return API.get(`${URLS.GET_KYC_DOCUMENT}`);
};

export const _updateMemberStatus = (id, status) => {
  return API.patch(`${URLS.UPDATE_MEMBER}/${id}/status`, status);
};

export const _pharmacyOrderReporting = (fromDate, toDate) => {
  return API.get(
    `${URLS.PHARMACY_ORDER_REPORTING}?from=${fromDate ? fromDate : ""}&to=${
      toDate ? toDate : ""
    }`
  );
};

export const _pharmacyOrderReportingCards = () => {
  return API.get(`${URLS.PHARMACY_ORDER_REPORTING}`);
};

export const _storeTopSellingProducts = (limit, fromDate, toDate) => {
  return API.get(
    `${URLS.STORE_TOP_SELLING_PRODUCTS}?limit=${limit ? limit : ""}&from=${
      fromDate ? fromDate : ""
    }&to=${toDate ? toDate : ""}`
  );
};

export const _pharmacyPurchaseOrderReporting = (fromDate, toDate) => {
  return API.get(
    `${URLS.PHARMACY_PURCHASE_ORDER_REPORTING}?from=${
      fromDate ? fromDate : ""
    }&to=${toDate ? toDate : ""}`
  );
};
export const _pharmacyMonthlySaleReporting = (selectedMonths) => {
  let url = `${URLS.PHARMACY_MONTHLY_SALE_REPORTING}`;

  if (selectedMonths) {
    url += `?interval=${selectedMonths ? selectedMonths : ""}`;
  }
  return API.get(url);
};

export const _businessOrderReporting = (fromDate, toDate) => {
  return API.get(
    `${URLS.BUSINESS_ORDER_REPORTING}?from=${fromDate ? fromDate : ""}&to=${
      toDate ? toDate : ""
    }`
  );
};

export const _getBusinessOrderReportingCards = () => {
  return API.get(`${URLS.BUSINESS_ORDER_REPORTING}`);
};

export const _getBusinessLevelCount = () => {
  return API.get(`${URLS.BUSINESS_LEVEL_COUNT}`);
};

export const _getStoreLevelCount = () => {
  return API.get(`${URLS.STORE_LEVEL_COUNT}`);
};

export const _businessPurchaseOrderReporting = (fromDate, toDate) => {
  return API.get(
    `${URLS.BUSINESS_PURCHASE_ORDER_REPORTING}?from=${
      fromDate ? fromDate : ""
    }&to=${toDate ? toDate : ""}`
  );
};

export const _businessMonthlySaleReport = (selectedMonths) => {
  let url = `${URLS.BUSINESS_MONTHLY_SALE_REPORT}`;

  if (selectedMonths) {
    url += `?interval=${selectedMonths ? selectedMonths : ""}`;
  }
  return API.get(url);
};

export const _topSellingProducts = (limit, fromDate, toDate) => {
  return API.get(
    `${URLS.TOP_SELLING_PRODUCTS}?limit=${limit ? limit : ""}&from=${
      fromDate ? fromDate : ""
    }&to=${toDate ? toDate : ""}`
  );
};

export const _logout = () => {
  return API.get(`${URLS.LOGOUT}`);
};
export const _getSearchProducts = (text) => {
  return API.get(`${URLS.SEARCH_PRODUCTS}?search=${text}`);
};

//Get Business Orders
export const _getBusinessOrders = async (search, status, page, limit = 10) => {
  let url = `${URLS.GET_BUSINESS_ORDERS}/?page=${page ? page : ""}&limit=${
    limit ? limit : ""
  }`;
  if (search) {
    url += `&order_no=${search ? search : ""}`;
  }
  if (status) {
    url += `&orderStatus=${status ? status : ""}`;
  }
  return API.get(`${url}`, { timeout: 20000 });
};

//Get Business Purchase Orders
export const _getBusinessPurchaseOrders = async (
  search,
  status,
  page,
  limit = 10
) => {
  let url = `${URLS.GET_BUSINESS_PURCHASE_ORDER}/?page=${
    page ? page : ""
  }&limit=${limit ? limit : ""}`;
  if (search) {
    url += `&order_no=${search ? search : ""}`;
  }
  if (status) {
    url += `&orderStatus=${status ? status : ""}`;
  }
  return API.get(`${url}`, { timeout: 20000 });
};

// Get Business Products List
export const _getBusinessProductList = async (
  search,
  status,
  page,
  limit = 10
) => {
  let url = `${URLS.GET_BUSINESS_PRODUCTS_LIST}/?page=${
    page ? page : ""
  }&limit=${limit ? limit : ""}`;
  if (search) {
    url += `&search=${search ? search : ""}`;
  }
  if (status) {
    url += `&status=${status ? status : ""}`;
  }
  return API.get(`${url}`, { timeout: 20000 });
};
export const _enlistDelistProducts = (id, status) => {
  return API.put(`${URLS.ENLIST_DELIST_PRODUCTS}${id}`, status);
};
export const _enlistDelistInventory = (id, status) => {
  return API.put(`${URLS.ENLIST_DELIST_INVENTORY}${id}`, status);
};
export const _purchaseOrderSuggestion = (product) => {
  return API.post(`${URLS.PURCHASE_ORDER_SUGGESTION}`, product);
};

export const _rejectProduct = (id, data) => {
  return API.patch(`${URLS.ORDER_DETAIL}/${id}/rejectProduct`, data, {
    timeout: 10000,
  });
};

export const _acceptProduct = (id, data) => {
  return API.patch(`${URLS.ORDER_DETAIL}/${id}/acceptProduct`, data, {
    timeout: 10000,
  });
};
export const _getRelatedProducts = (data) => {
  return API.post(`${URLS.RELATED_PRODUCTS}`, data);
};
export const _productsListing = (query) => {
  let url = `${URLS.PRODUCTS_LISTING}?limit=${
    query?.limit ? query?.limit : ""
  }&page=${query?.page ? query?.page : ""}`;

  if (query && query?.selectedBrands && query?.selectedBrands?.length) {
    url += `&brand=${query.selectedBrands.map((el) => el)}`;
  }

  if (query && query?.selectedCategories && query?.selectedCategories?.length) {
    url += `&category=${query.selectedCategories.map((el) => el)}`;
  }

  if (query?.min_price) {
    url += `&min_price=${query?.min_price}`;
  }
  if (query?.max_price) {
    url += `&max_price=${query?.max_price}`;
  }

  if (query?.sort) {
    url += `&sort=${query?.sort}`;
  }

  return API.get(`${url}`, { timeout: 20000 });
};

export const _getStores = () => {
  return API.get(`${URLS.STORES}`);
};
export const _getcategoriesAndBrands = () => {
  return API.get(`${URLS.CATEGORIES_BRANDS}`);
};
export const _getAllWatchList = (search, page, limit = 10) => {
  let url = `${URLS.GET_ALL_WATCHLIST}/?page=${page ? page : ""}&limit=${
    limit ? limit : ""
  }`;
  if (search) {
    url += `&DIN_NO=${search ? search : ""}`;
  }

  return API.get(`${url}`, { timeout: 20000 });
};
export const _addWatchList = (data) => {
  return API.post(`${URLS.ADD_WATCHLIST}`, data);
};
export const _getSingleWatchList = (id) => {
  return API.get(`${URLS.WATCHLIST_ID}${id}`);
};

export const _updateWatchList = (id, data) => {
  return API.patch(`${URLS.WATCHLIST_ID}${id}`, data);
};
export const _deleteWatchList = (id) => {
  return API.delete(`${URLS.WATCHLIST_ID}${id}`);
};

export const _pharmaciesOrderApproval = (id, data) => {
  return API.patch(`${URLS.ORDER_APPROVAL}${id}/pharmacist/approval`, data);
};
export const _pharmaciesOrderRejection = (id, data) => {
  return API.patch(`${URLS.ORDER_APPROVAL}${id}/pharmacist/rejection`, data);
};
export const _getPurchaseOrder = () => {
  return API.get(`${URLS.GET_PURCASE_ORDER}`);
};

export const _getStorePreOrders = async (search, status, page, limit = 10) => {
  let url = `${URLS.GET_PRE_ORDERS}/?page=${page ? page : ""}&limit=${
    limit ? limit : ""
  }`;
  if (search) {
    url += `&pre_order_no=${search ? search : ""}`;
  }
  if (status) {
    url += `&approval_status=${status ? status : ""}`;
  }
  return API.get(`${url}`, { timeout: 20000 });
};

export const _getBusinessPreOrders = async (
  search,
  status,
  page,
  limit = 10
) => {
  let url = `${URLS.GET_BUSINESS_PRE_ORDERS}/?page=${page ? page : ""}&limit=${
    limit ? limit : ""
  }`;
  if (search) {
    url += `&pre_order_no=${search ? search : ""}`;
  }
  if (status) {
    url += `&approval_status=${status ? status : ""}`;
  }
  return API.get(`${url}`, { timeout: 20000 });
};

export const _getPreOrderDetail = (id) => {
  return API.get(`${URLS.GET_PRE_ORDERS}/${id}`);
};

export const _getBusinessPreOrderDetail = (id) => {
  return API.get(`${URLS.GET_BUSINESS_PRE_ORDERS}/${id}`);
};

export const _updatePreOrder = (id, data) => {
  return API.patch(`${URLS.GET_PRE_ORDERS}/${id}`, data);
};
export const _approvePreOrder = (id, data) => {
  return API.patch(`${URLS.GET_PRE_ORDERS}/${id}/approve`, data);
};
export const _rejectPreOrder = (id, data) => {
  return API.patch(`${URLS.GET_PRE_ORDERS}/${id}/reject`, data);
};

export const _updateBusinessPreOrder = (id, data) => {
  return API.patch(`${URLS.GET_BUSINESS_PRE_ORDERS}/${id}`, data);
};
export const _approveBusinessPreOrder = (id, data) => {
  return API.patch(`${URLS.GET_BUSINESS_PRE_ORDERS}/${id}/approve`, data);
};
export const _rejectBusinessPreOrder = (id, data) => {
  return API.patch(`${URLS.GET_BUSINESS_PRE_ORDERS}/${id}/reject`, data);
};

export const _pharmacistAuth = (data) => {
  return API.post(`${URLS.GET_PRE_ORDERS}/pharmacist-authorization`, data);
};

export const _getBusinessPrescription = async (
  search,
  status,
  page,
  limit = 10
) => {
  let url = `${URLS.GET_BUSINESS_PRESCRIPTION}/?page=${
    page ? page : ""
  }&limit=${limit ? limit : ""}`;
  if (search) {
    url += `&order_no=${search ? search : ""}`;
  }
  if (status) {
    url += `&orderStatus=${status ? status : ""}`;
  }
  return API.get(`${url}`, { timeout: 20000 });
};

export const _getStorePrescription = async (
  search,
  status,
  page,
  limit = 10
) => {
  let url = `${URLS.GET_STORE_PRESCRIPTION}/?page=${page ? page : ""}&limit=${
    limit ? limit : ""
  }`;
  if (search) {
    url += `&order_no=${search ? search : ""}`;
  }
  if (status) {
    url += `&orderStatus=${status ? status : ""}`;
  }
  return API.get(`${url}`, { timeout: 20000 });
};
export const _getOrderPrescription = (id) => {
  return API.get(`${URLS.GET_ORDER_PRESCRIPTION}/${id}`);
};
export const _getConversations = (id) => {
  return API.get(`${URLS.GET_CONVERSATIONS}/${id}`);
};
export const _getConversationById = (page, convId, storeId, detail) => {
  let url = `${URLS.GET_CONVERSATION}/store/${storeId}?`;
  if (detail && detail?.product) {
    url += `product=${detail?.product?._id ? detail?.product?._id : ""}`;
  }
  if (detail && storeId) {
    url += `&author=${storeId ? storeId : ""}`;
  }
  if (detail && detail?.receiver) {
    url += `&receiver=${detail?.receiver ? detail?.receiver : ""}`;
  }
  if (convId) {
    url += `&conversationId=${convId ? convId : ""}`;
  }
  if (page) {
    url += `&page=${page ? page : ""}`;
  }
  return API.get(`${url}`, { timeout: 20000 });
};
