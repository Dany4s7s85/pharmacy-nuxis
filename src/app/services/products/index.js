import { createAction, handleActions } from "redux-actions";
import ActionTypes from "../../shared/constants/actionTypes";
import { toast } from "react-toastify";
import {
  _createPharmacyProductDetails,
  // _uploadProductImage,
  _getRootCategories,
  _getProductCategories,
  _getPharmacyProductList,
  _getPharmacyProduct,
  _addProduct,
  _getProductByDin,
  _uploadProductImage,
  _removeProductImage,
  _getLandingPageProducts,
  _getProductDetail,
  _getLandingPageCategories,
  _getSameProductInventory,
  _getSimilarProducts,
  _editProductDetail,
  _getAllProductInventories,
  _deleteProductInevntory,
  _getProductInventoryDetail,
  _updateProductInventory,
  _addProductInventory,
  _getInventoryByDetail,
  _addInventoryWishList,
  _removeInventoryWishList,
  _getInventoryWishLists,
  _getSearchProducts,
  _enlistDelistProducts,
  _enlistDelistInventory,
  _getRelatedProducts,
  _productsListing,
  _getcategoriesAndBrands,
  _getStores,
  _getAllWatchList,
  _getSingleWatchList,
  _addWatchList,
  _updateWatchList,
  _deleteWatchList,
} from "../../shared/httpService/api";

const initialState = {
  createPharmacyProduct: {
    loading: false,
    response: {},
    hasError: false,
    error: {},
  },
  // uploadProductImage: {
  //   loading: false,
  //   response: {},
  //   hasErrorr: false,
  //   error: {},
  // },
  rootCategory: {
    loading: false,
    response: {},
    hasError: false,
    error: {},
  },
  productCategory: {
    loading: false,
    response: {},
    hasError: false,
    error: {},
  },
  products: { loading: false, response: {}, hasError: false, error: {} },
  product: { loading: false, response: {}, hasError: false, error: {} },
  addProduct: { loading: false, response: {}, hasError: false, error: {} },

  productByDIN: { loading: false, response: {}, hasError: false, error: {} },
  uploadProductImage: {
    loading: false,
    response: {},
    hasError: false,
    error: {},
  },
  removeProductImage: {
    loading: false,
    response: {},
    hasError: false,
    error: {},
  },
  landingPageProducts: {
    loading: false,
    response: {},
    hasError: false,
    error: {},
  },
  landingPageCategories: {
    loading: false,
    response: {},
    hasError: false,
    error: {},
  },
  productDetail: { loading: false, response: {}, hasError: false, error: {} },
  sameProductInventory: {
    loading: false,
    response: {},
    hasError: false,
    error: {},
  },
  productInventoryByDetail: {
    loading: false,
    response: {},
    hasError: false,
    error: {},
  },
  similarProducts: {
    loading: false,
    response: {},
    hasError: false,
    error: {},
  },
  editProductDetail: {
    loading: false,
    response: {},
    hasError: false,
    error: {},
  },
  allProductInventories: {
    loading: false,
    response: {},
    hasError: false,
    error: {},
  },
  deleteProductInventory: {
    loading: false,
    response: {},
    hasError: false,
    error: {},
  },
  productInventoryDetail: {
    loading: false,
    response: {},
    hasError: false,
    error: {},
  },
  updateInventory: {
    loading: false,
    response: {},
    hasError: false,
    error: {},
  },
  addInventory: {
    loading: false,
    response: {},
    hasError: false,
    error: {},
  },
  addInventoryWishList: {
    loading: false,
    response: {},
    hasError: false,
    error: {},
  },

  removeInventoryWishList: {
    loading: false,
    response: {},
    hasError: false,
    error: {},
  },
  getInventoryWishLists: {
    loading: false,
    response: {},
    hasError: false,
    error: {},
  },
  searchProducts: {
    loading: false,
    response: {},
    hasError: false,
    error: {},
  },
  enlistDelistProducts: {
    loading: false,
    response: {},
    hasError: false,
    error: {},
  },
  enlistDelistInventory: {
    loading: false,
    response: {},
    hasError: false,
    error: {},
  },
  relatedProducts: {
    loading: false,
    response: {},
    hasError: false,
    error: {},
  },
  productsLisiting: {
    loading: false,
    response: {},
    hasError: false,
    error: {},
  },
  brands: {
    loading: false,
    response: {},
    hasError: false,
    error: {},
  },
  stores: {
    loading: false,
    response: {},
    hasError: false,
    error: {},
  },
  getAllWatchList: {
    loading: false,
    response: {},
    hasError: false,
    error: {},
  },
  getSingleWatchList: {
    loading: false,
    response: {},
    hasError: false,
    error: {},
  },
  addWatchList: {
    loading: false,
    response: {},
    hasError: false,
    error: {},
  },
  updateWatchList: {
    loading: false,
    response: {},
    hasError: false,
    error: {},
  },
  deleteWatchList: {
    loading: false,
    response: {},
    hasError: false,
    error: {},
  },
};
/* Root Category  */
export const rootCategoryStart = createAction(ActionTypes.ROOT_CATEGORY_START);
export const rootCategorySuccess = createAction(
  ActionTypes.ROOT_CATEGORY_SUCCESS,
  (response) => response
);
export const rootCategoryError = createAction(
  ActionTypes.ROOT_CATEGORY_ERROR,
  (error) => error
);
export const getRootCategory = (toast) => async (dispatch) => {
  try {
    dispatch(rootCategoryStart());

    const response = await _getRootCategories();

    dispatch(rootCategorySuccess(response));
  } catch (error) {
    dispatch(rootCategoryError(error));
    if (error?.status.length > 0) {
      toast.error(error?.message);
    } else {
      toast.error("Something went wrong");
    }
  }
};

/* Product Category  */
export const productCategoryStart = createAction(
  ActionTypes.PRODUCT_CATEGORY_START
);
export const productCategorySuccess = createAction(
  ActionTypes.PRODUCT_CATEGORY_SUCCESS,
  (response) => response
);
export const productCategoryError = createAction(
  ActionTypes.PRODUCT_CATEGORY_ERROR,
  (error) => error
);
export const getProductCategory = (toast) => async (dispatch) => {
  try {
    dispatch(productCategoryStart());

    const response = await _getProductCategories();

    dispatch(productCategorySuccess(response));
    // toast.success(response.message);
  } catch (error) {
    dispatch(productCategoryError(error));
    if (error?.status.length > 0) {
      toast.error(error?.message);
    } else {
      toast.error("Something went wrong");
    }
  }
};

/* Create Pharmacy  */
export const createPharmacyProductStart = createAction(
  ActionTypes.CREATE_PHARMACY_PRODUCT_START
);
export const createPharmacyProductSuccess = createAction(
  ActionTypes.CREATE_PHARMACY_PRODUCT_SUCCESS,
  (response) => response
);
export const createPharmacyProductError = createAction(
  ActionTypes.CREATE_PHARMACY_PRODUCT_ERROR,
  (error) => error
);
export const createPharmacyProduct =
  (values, pharmacyId, toast) => async (dispatch) => {
    const Obj = {
      product_name: values.product_name,
      drug_Indentification_number: values.din,
      brand: values.brand,
      quantity: values.quantity,
      sub_brand: values.sub_brand,
      form: values.form,
      size: values.size,
      price: values.price,
      category_name: values.category_name,
      product_category_name: values.product_category_name,
      description: values.description,
      pharmacy_id: pharmacyId,
      expiry_date: values.expiry_date,
      fullfillment: values.fullfillment,
      payment: values.payment,
    };

    try {
      dispatch(createPharmacyProductStart());

      const response = await _createPharmacyProductDetails(Obj);

      dispatch(createPharmacyProductSuccess(response));
      toast.success(response.message);
    } catch (error) {
      dispatch(createPharmacyProductError(error));
      if (error?.status.length > 0) {
        toast.error(error?.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

/* ADD PRODUCT IMAGE */
// export const uploadProductImageStart = createAction(
//   ActionTypes.UPLOAD_PRODUCT_IMAGE_START
// );
// export const uploadProductImageSuccess = createAction(
//   ActionTypes.UPLOAD_PRODUCT_IMAGE_SUCCESS,
//   (response) => response
// );
// export const uploadProductImageError = createAction(
//   ActionTypes.UPLOAD_PRODUCT_IMAGE_ERROR,
//   (error) => error
// );
// export const uploadProductImage =
//   (imageUrls, pharmacyId, toast) => async (dispatch) => {
//     const Obj = {
//       image: {
//         full_image: imageUrls,
//       },
//     };
//
//     try {
//       dispatch(uploadProductImageStart());
//
//       const response = await _uploadProductImage(Obj, pharmacyId);
//
//       dispatch(uploadProductImageSuccess(response));
//       toast.success(response.message);
//     } catch (error) {
//       dispatch(uploadProductImageError(error));
//       if (error?.status.length > 0) {
//         toast.error(error?.message);
//       } else {
//         toast.error("Something went wrong");
//       }
//     }
//   };

export const getProductsPharmacyStart = createAction(
  ActionTypes.GET_PHARMACY_PRODUCTS_START
);
export const getProductsPharmacySuccess = createAction(
  ActionTypes.GET_PHARMACY_PRODUCTS_SUCCESS,
  (response) => response
);
export const getProductsPharmacyError = createAction(
  ActionTypes.GET_PHARMACY_PRODUCTS_ERROR,
  (error) => error
);

export const getPharmacyProductList =
  (pharmacyId, search, status, page, limit, callback) => (dispatch) => {
    dispatch(getProductsPharmacyStart());
    return _getPharmacyProductList(pharmacyId, search, status, page, limit)
      .then((response) => {
        dispatch(getProductsPharmacySuccess(response));
        if (response) {
          callback(response);
        }
      })
      .catch((error) => {
        dispatch(getProductsPharmacyError(error));
        if (error && error?.error) {
          toast.error(error?.message);
        } else {
          toast.error("Something went wrong");
        }
      });
  };

export const getProductPharmacyStart = createAction(
  ActionTypes.GET_PHARMACY_PRODUCT_DETAIL_START
);
export const getProductPharmacySuccess = createAction(
  ActionTypes.GET_PHARMACY_PRODUCT_DETAIL_SUCCESS,
  (response) => response
);
export const getProductPharmacyError = createAction(
  ActionTypes.GET_PHARMACY_PRODUCT_DETAIL_ERROR,
  (error) => error
);

export const getPharmacyProduct = (id) => (dispatch) => {
  dispatch(getProductPharmacyStart());
  return _getPharmacyProduct(id)
    .then((response) => {
      dispatch(getProductPharmacySuccess(response));
    })
    .catch((error) => {
      dispatch(getProductPharmacyError(error));
      if (error && error?.error) {
        toast.error(error?.message);
      } else {
        toast.error("Something went wrong");
      }
    });
};

export const getProductPharmacyByDINStart = createAction(
  ActionTypes.GET_PRODUCT_BY_DIN_START
);
export const getProductPharmacyByDINSuccess = createAction(
  ActionTypes.GET_PRODUCT_BY_DIN_SUCCESS,
  (response) => response
);
export const getProductPharmacyByDINError = createAction(
  ActionTypes.GET_PRODUCT_BY_DIN_ERROR,
  (error) => error
);

export const getProductByDin = (din, callback, callbackError) => (dispatch) => {
  dispatch(getProductPharmacyByDINStart());
  return _getProductByDin(din)
    .then((response) => {
      dispatch(getProductPharmacyByDINSuccess(response));
      if (response) {
        callback(response);
      }
    })
    .catch((error) => {
      dispatch(getProductPharmacyByDINError(error));
      callbackError(error);
      if (error && error?.error) {
        // toast.error(error?.message);
      } else {
        // toast.error('Something went wrong');
      }
    });
};

export const addProductPharmacyStart = createAction(
  ActionTypes.ADD_PHARMACY_PRODUCT_START
);
export const addProductPharmacySuccess = createAction(
  ActionTypes.ADD_PHARMACY_PRODUCT_SUCCESS,
  (response) => response
);
export const addProductPharmacyError = createAction(
  ActionTypes.ADD_PHARMACY_PRODUCT_ERROR,
  (error) => error
);

export const addProduct = (data, navigate, callback) => (dispatch) => {
  dispatch(addProductPharmacyStart());
  return _addProduct(data)
    .then((response) => {
      dispatch(addProductPharmacySuccess(response));
      if (response) {
        callback(response);
      }
    })
    .catch((error) => {
      dispatch(addProductPharmacyError(error));
      setTimeout(() => {
        if (error?.data?.exist == true) {
          navigate(
            `/dash/edit-product?id=${error?.data?.product}&exist=${error?.data?.exist}`
          );

          // navigate(`/dash/edit-product?id=${error?.data?.product}`);
        }
      }, 1000);

      if (error && error?.message) {
        toast.error(error?.message);
      } else {
        if (
          error.message &&
          error?.message?.includes("Duplicate field value")
        ) {
          toast.error("Product already exists");
        } else if (error?.message) {
          toast.error(error?.message);
        }
      }
    });
};

export const uploadProductImagePharmacyStart = createAction(
  ActionTypes.UPLOAD_PHARMACY_PRODUCT_IMAGE_START
);
export const uploadProductImagePharmacySuccess = createAction(
  ActionTypes.UPLOAD_PHARMACY_PRODUCT_IMAGE_SUCCESS,
  (response) => response
);
export const uploadProductImagePharmacyError = createAction(
  ActionTypes.UPLOAD_PHARMACY_PRODUCT_IMAGE_ERROR,
  (error) => error
);

export const uploadProductImage = (data, callback) => (dispatch) => {
  dispatch(uploadProductImagePharmacyStart());
  return _uploadProductImage(data)
    .then((response) => {
      dispatch(uploadProductImagePharmacySuccess(response));
      if (response) {
        callback(response);
      }
    })
    .catch((error) => {
      dispatch(uploadProductImagePharmacyError(error));
      if (error && error?.error) {
        toast.error(error?.message);
      } else {
        toast.error("Something went wrong");
      }
    });
};

export const removeProductImagePharmacyStart = createAction(
  ActionTypes.REMOVE_PHARMACY_PRODUCT_IMAGE_START
);
export const removeProductImagePharmacySuccess = createAction(
  ActionTypes.REMOVE_PHARMACY_PRODUCT_IMAGE_SUCCESS,
  (response) => response
);
export const removeProductImagePharmacyError = createAction(
  ActionTypes.REMOVE_PHARMACY_PRODUCT_IMAGE_ERROR,
  (error) => error
);

export const removeProductImage = (data, callback) => (dispatch) => {
  dispatch(removeProductImagePharmacyStart());
  return _removeProductImage(data)
    .then((response) => {
      dispatch(removeProductImagePharmacySuccess(response));
      if (response) {
        callback(response);
      }
    })
    .catch((error) => {
      dispatch(removeProductImagePharmacyError(error));

      if (error && error?.error) {
        toast.error(error?.message);
      } else {
        toast.error("Something went wrong");
      }
    });
};

/* Landing Page Cover Products  */
export const getPharmacyCoverProductsStart = createAction(
  ActionTypes.GET_COVER_PRODUCTS_START
);
export const getPharmacyCoverProductsSuccess = createAction(
  ActionTypes.GET_COVER_PRODUCTS_SUCCESS,
  (response) => response
);
export const getPharmacyCoverProductsError = createAction(
  ActionTypes.GET_COVER_PRODUCTS_ERROR,
  (error) => error
);
export const getPharmacyLandingProducts = () => async (dispatch) => {
  try {
    dispatch(getPharmacyCoverProductsStart());
    const response = await _getLandingPageProducts();

    dispatch(getPharmacyCoverProductsSuccess(response));
  } catch (error) {
    dispatch(getPharmacyCoverProductsError(error));
    if (error?.status.length > 0) {
      toast.error(error?.message);
    } else {
      toast.error("Something went wrong");
    }
  }
};

/* Landing Page Products Detail  */
export const getPharmacyProductDetailStart = createAction(
  ActionTypes.GET_PRODUCT_DETAIL_START
);
export const getPharmacyProductDetailSuccess = createAction(
  ActionTypes.GET_PRODUCT_DETAIL_SUCCESS,
  (response) => response
);
export const getPharmacyProductDetailError = createAction(
  ActionTypes.GET_PRODUCT_DETAIL_ERROR,
  (error) => error
);
export const getProductDetail = (id, callback) => async (dispatch) => {
  try {
    dispatch(getPharmacyProductDetailStart());

    const response = await _getProductDetail(id);
    dispatch(getPharmacyProductDetailSuccess(response));
    if (response) {
      callback(response);
    }
    // toast.success(response.message);
  } catch (error) {
    dispatch(getPharmacyProductDetailError(error));
    if (error?.status.length > 0) {
      toast.error(error?.message);
    } else {
      toast.error("Something went wrong");
    }
  }
};
/* Same Products Inevntory  */
export const getSameProductInventoryStart = createAction(
  ActionTypes.GET_SAME_PRODUCT_INVENTORY_START
);
export const getSameProductInventorySuccess = createAction(
  ActionTypes.GET_SAME_PRODUCT_INVENTORY_SUCCESS,
  (response) => response
);
export const getSameProductInventoryError = createAction(
  ActionTypes.GET_SAME_PRODUCT_INVENTORY_ERROR,
  (error) => error
);
export const getSameProductInventory =
  (din, filterValue, callback) => async (dispatch) => {
    try {
      dispatch(getSameProductInventoryStart());

      const response = await _getSameProductInventory(din, filterValue);
      dispatch(getSameProductInventorySuccess(response));
      if (response) {
        callback(response);
      }
      // toast.success(response.message);
    } catch (error) {
      dispatch(getSameProductInventoryError(error));
      if (error?.status.length > 0) {
        toast.error(error?.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

/* Inventory Products By Details  */
export const getInventoryByDetailStart = createAction(
  ActionTypes.GET_INVENTORY_BY_DETAIL_START
);
export const getInventoryByDetailSuccess = createAction(
  ActionTypes.GET_INVENTORY_BY_DETAIL_SUCCESS,
  (response) => response
);
export const getInventoryByDetailError = createAction(
  ActionTypes.GET_INVENTORY_BY_DETAIL_ERROR,
  (error) => error
);
export const getInventoryByDetail =
  (din, filterValue, callback) => async (dispatch) => {
    try {
      dispatch(getInventoryByDetailStart());

      const response = await _getInventoryByDetail(din, filterValue);
      dispatch(getInventoryByDetailSuccess(response));
      if (response) {
        callback(response);
      }
      // toast.success(response.message);
    } catch (error) {
      dispatch(getInventoryByDetailError(error));
      if (error?.status.length > 0) {
        toast.error(error?.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

/* landing Page Categories */
export const landingPageCategoryStart = createAction(
  ActionTypes.GET_PRODUCT_CATEGORY_START
);
export const landingPageCategorySuccess = createAction(
  ActionTypes.GET_PRODUCT_CATEGORY_SUCCESS,
  (response) => response
);
export const landingPageCategoryError = createAction(
  ActionTypes.GET_PRODUCT_CATEGORY_ERROR,
  (error) => error
);
export const getLandingPageCategory = (callback) => async (dispatch) => {
  try {
    dispatch(landingPageCategoryStart());

    const response = await _getLandingPageCategories();

    dispatch(landingPageCategorySuccess(response));
    if (response) {
      callback(response);
    }
    // toast.success(response.message);
  } catch (error) {
    dispatch(landingPageCategoryError(error));
    if (error?.status.length > 0) {
      toast.error(error?.message);
    } else {
      toast.error("Something went wrong");
    }
  }
};

/* Similar Products */
export const similarProductsStart = createAction(
  ActionTypes.GET_SIMILAR_PRODUCTS_START
);
export const similarProductsSuccess = createAction(
  ActionTypes.GET_SIMILAR_PRODUCTS_SUCCESS,
  (response) => response
);
export const similarProductsError = createAction(
  ActionTypes.GET_SIMILAR_PRODUCTS_ERROR,
  (error) => error
);
export const getSimilarProducts = (id, callback) => async (dispatch) => {
  try {
    dispatch(similarProductsStart());

    const response = await _getSimilarProducts(id);

    dispatch(similarProductsSuccess(response));
    if (response) {
      callback(response);
    }
  } catch (error) {
    dispatch(similarProductsError(error));
    if (error?.status.length > 0) {
      toast.error(error?.message);
    } else {
      toast.error("Something went wrong");
    }
  }
};

/*  Edit Product Detail */

export const editProductDetailStart = createAction(
  ActionTypes.EDIT_PRODUCT_DETAIL_START
);
export const editProductDetailSuccess = createAction(
  ActionTypes.EDIT_PRODUCT_DETAIL_SUCCESS,
  (response) => response
);
export const editProductDetailError = createAction(
  ActionTypes.EDIT_PRODUCT_DETAIL_ERROR,
  (error) => error
);
export const editProductDetail = (id, callback) => async (dispatch) => {
  try {
    dispatch(editProductDetailStart());

    const response = await _editProductDetail(id);

    dispatch(editProductDetailSuccess(response));
    if (response) {
      callback(response);
    }
  } catch (error) {
    dispatch(editProductDetailError(error));
    if (error?.status.length > 0) {
      toast.error(error?.message);
    } else {
      toast.error("Something went wrong");
    }
  }
};
/*  ALL Product INVENTORIES */

export const allProductInventoryStart = createAction(
  ActionTypes.GET_ALL_PRODUCT_INVENTORY_START
);
export const allProductInventorySuccess = createAction(
  ActionTypes.GET_ALL_PRODUCT_INVENTORY_SUCCESS,
  (response) => response
);
export const allProductInventoryError = createAction(
  ActionTypes.GET_ALL_PRODUCT_INVENTORY_ERROR,
  (error) => error
);
export const getAllProductInventories =
  (id, page, limit, callback) => async (dispatch) => {
    try {
      dispatch(allProductInventoryStart());

      const response = await _getAllProductInventories(id, page, limit);

      dispatch(allProductInventorySuccess(response));
      if (response) {
        callback(response);
      }
    } catch (error) {
      dispatch(allProductInventoryError(error));
      if (error?.status.length > 0) {
        toast.error(error?.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

/*  DELETE Product INVENTORY */

export const deleteProductInventoryStart = createAction(
  ActionTypes.DELETE_PRODUCT_INVENTORY_START
);
export const deleteProductInventorySuccess = createAction(
  ActionTypes.DELETE_PRODUCT_INVENTORY_SUCCESS,
  (response) => response
);
export const deleteProductInventoryError = createAction(
  ActionTypes.DELETE_PRODUCT_INVENTORY_ERROR,
  (error) => error
);
export const deleteProductInventory =
  (id, invId, callback) => async (dispatch) => {
    try {
      dispatch(deleteProductInventoryStart());

      const response = await _deleteProductInevntory(id);
      if (response) {
        callback(response);
      }
      dispatch(deleteProductInventorySuccess(response));
      toast.success(response.message);
    } catch (error) {
      dispatch(deleteProductInventoryError(error));
      if (error?.status.length > 0) {
        toast.error(error?.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

/*  Product INVENTORY DETAIL */

export const productInventoryDetailStart = createAction(
  ActionTypes.GET_PRODUCT_INVENTORY_DETAIL_START
);
export const productInventoryDetailSuccess = createAction(
  ActionTypes.GET_PRODUCT_INVENTORY_DETAIL_SUCCESS,
  (response) => response
);
export const productInventoryDetailError = createAction(
  ActionTypes.GET_PRODUCT_INVENTORY_DETAIL_ERROR,
  (error) => error
);
export const getProductInventoryDetail = (id, callback) => async (dispatch) => {
  try {
    dispatch(productInventoryDetailStart());

    const response = await _getProductInventoryDetail(id);

    dispatch(productInventoryDetailSuccess(response));
    if (response) {
      callback(response);
    }
  } catch (error) {
    dispatch(productInventoryDetailError(error));
    if (error?.status.length > 0) {
      toast.error(error?.message);
    } else {
      toast.error("Something went wrong");
    }
  }
};
/*  UPDATE INVENTORY  */

export const updateInventoryDetailStart = createAction(
  ActionTypes.UPDATE_INVENTORY_DETAIL_START
);
export const updateInventoryDetailSuccess = createAction(
  ActionTypes.UPDATE_INVENTORY_DETAIL_SUCCESS,
  (response) => response
);
export const updateInventoryDetailError = createAction(
  ActionTypes.UPDATE_INVENTORY_DETAIL_ERROR,
  (error) => error
);
export const updateProductInventoryDetail =
  (id, data, invId, handleClose, callback) => async (dispatch) => {
    try {
      dispatch(updateInventoryDetailStart());

      const response = await _updateProductInventory(id, data);
      if (response) {
        callback(response);
        handleClose();
      }
      dispatch(updateInventoryDetailSuccess(response));
      toast.success(response.message);
    } catch (error) {
      dispatch(updateInventoryDetailError(error));
      if (error?.status.length > 0) {
        toast.error(error?.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

// Get all wish-lists
export const getInventoryWishListsStart = createAction(
  ActionTypes.GET_INVENTORY_WISH_LISTS_START
);
export const getInventoryWishListsSuccess = createAction(
  ActionTypes.GET_INVENTORY_WISH_LISTS_SUCCESS,
  (response) => response
);
export const getInventoryWishListsError = createAction(
  ActionTypes.GET_INVENTORY_WISH_LISTS_ERROR,
  (error) => error
);
export const getInventoryWishLists =
  (callback, callbackError = null) =>
  async (dispatch) => {
    try {
      dispatch(getInventoryWishListsStart());

      const response = await _getInventoryWishLists();
      dispatch(getInventoryWishListsSuccess(response));
      if (response) {
        callback(response);
      }
    } catch (error) {
      if (callbackError) {
        callbackError(error);
      }
      dispatch(getInventoryWishListsError(error));
      if (error?.status.length > 0) {
        toast.error(error?.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

// Add wish-list
export const addInventoryWishListStart = createAction(
  ActionTypes.ADD_INVENTORY_WISHLIST_START
);
export const addInventoryWishListSuccess = createAction(
  ActionTypes.ADD_INVENTORY_WISHLIST_SUCCESS,
  (response) => response
);
export const addInventoryWishListError = createAction(
  ActionTypes.ADD_INVENTORY_WISHLIST_ERROR,
  (error) => error
);

export const addInventoryWishList = (invId, callback) => async (dispatch) => {
  try {
    dispatch(addInventoryWishListStart());

    const response = await _addInventoryWishList(invId);
    if (response) {
      callback(response);
    }
    dispatch(addInventoryWishListSuccess(response));
    // toast.success(response?.message);
  } catch (error) {
    dispatch(addInventoryWishListError(error));
    if (error?.message) {
      toast.error(error?.message);
    } else {
      toast.error("Something went wrong");
    }
  }
};

// Remove wish-list
export const removeInventoryWishListStart = createAction(
  ActionTypes.REMOVE_INVENTORY_WISHLIST_START
);
export const removeInventoryWishListSuccess = createAction(
  ActionTypes.REMOVE_INVENTORY_WISHLIST_SUCCESS,
  (response) => response
);
export const removeInventoryWishListError = createAction(
  ActionTypes.REMOVE_INVENTORY_WISHLIST_ERROR,
  (error) => error
);

export const removeInventoryWishList =
  (invId, callback) => async (dispatch) => {
    try {
      dispatch(removeInventoryWishListStart());
      const response = await _removeInventoryWishList(invId);

      if (response) {
        callback(response);
      }
      dispatch(removeInventoryWishListSuccess(response));
      // toast.success(response?.message);
    } catch (error) {
      dispatch(removeInventoryWishListError(error));
      if (error?.message) {
        toast.error(error?.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

/*  ADD INVENTORY  */

export const addProductInventoryStart = createAction(
  ActionTypes.ADD_PRODUCT_INVENTORY_START
);
export const addProductInventorySuccess = createAction(
  ActionTypes.ADD_PRODUCT_INVENTORY_SUCCESS,
  (response) => response
);
export const addProductInventoryError = createAction(
  ActionTypes.ADD_PRODUCT_INVENTORY_ERROR,
  (error) => error
);
export const addProductInventory =
  (data, invId, exist, handleClose, navigate, callback) => async (dispatch) => {
    try {
      dispatch(addProductInventoryStart());

      const response = await _addProductInventory(data);

      if (exist == "true") {
        navigate(`/dash/edit-product?id=${invId}`);
      }
      if (response) {
        callback(response);
        handleClose();
      }

      dispatch(addProductInventorySuccess(response));
      toast.success(response?.message);
      if (response) {
        callback(response);
      }
    } catch (error) {
      dispatch(addProductInventoryError(error));
      if (error?.message) {
        toast.error(error?.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };
/*  SEARCH PRODUCTS */

export const searchProductsStart = createAction(
  ActionTypes.SEARCH_PRODUCTS_START
);
export const searchProductsSuccess = createAction(
  ActionTypes.SEARCH_PRODUCTS_SUCCESS,
  (response) => response
);
export const searchProductsError = createAction(
  ActionTypes.SEARCH_PRODUCTS_ERROR,
  (error) => error
);
export const getSearchProducts = (data, callback) => async (dispatch) => {
  try {
    dispatch(searchProductsStart());

    const response = await _getSearchProducts(data);

    if (response) {
      callback(response);
    }

    dispatch(searchProductsSuccess(response));
  } catch (error) {
    dispatch(searchProductsError(error));
    if (error?.message) {
      toast.error(error?.message);
    } else {
      toast.error("Something went wrong");
    }
  }
};

/*  ENLIST DELIST PRODUCTS */

export const enlistDelistProductsStart = createAction(
  ActionTypes.ENLIST_DELIST_PRODUCTS_START
);
export const enlistDelistProductsSuccess = createAction(
  ActionTypes.ENLIST_DELIST_PRODUCTS_SUCCESS,
  (response) => response
);
export const enlistDelistProductsError = createAction(
  ActionTypes.ENLIST_DELIST_PRODUCTS_ERROR,
  (error) => error
);

export const enlistDelistProducts =
  (id, status, callback) => async (dispatch) => {
    try {
      const obj = { status };
      dispatch(enlistDelistProductsStart());

      const response = await _enlistDelistProducts(id, obj);
      if (response) {
        callback(response);
      }

      dispatch(enlistDelistProductsSuccess(response));
    } catch (error) {
      dispatch(enlistDelistProductsError(error));
      if (error?.message) {
        toast.error(error?.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };
/*  ENLIST DELIST INVENTORY */

export const enlistDelistInventoryStart = createAction(
  ActionTypes.ENLIST_DELIST_INVENTORY_START
);
export const enlistDelistInventorySuccess = createAction(
  ActionTypes.ENLIST_DELIST_INVENTORY_SUCCESS,
  (response) => response
);
export const enlistDelistInventoryError = createAction(
  ActionTypes.ENLIST_DELIST_INVENTORY_ERROR,
  (error) => error
);

export const enlistDelistInventory =
  (id, status, callback) => async (dispatch) => {
    try {
      const obj = { status };
      dispatch(enlistDelistInventoryStart());

      const response = await _enlistDelistInventory(id, obj);

      if (response) {
        callback(response);
      }

      dispatch(enlistDelistInventorySuccess(response));
    } catch (error) {
      dispatch(enlistDelistInventoryError(error));
      if (error?.message) {
        toast.error(error?.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

/* Related Products */
export const relatedProductsStart = createAction(
  ActionTypes.GET_RELATED_PRODUCTS_START
);
export const relatedProductsSuccess = createAction(
  ActionTypes.GET_RELATED_PRODUCTS_SUCCESS,
  (response) => response
);
export const relatedProductsError = createAction(
  ActionTypes.GET_RELATED_PRODUCTS_ERROR,
  (error) => error
);
export const getRelatedProducts = (data, callback) => async (dispatch) => {
  try {
    dispatch(relatedProductsStart());

    const response = await _getRelatedProducts(data);

    dispatch(relatedProductsSuccess(response));
    if (response) {
      callback(response);
    }
  } catch (error) {
    dispatch(relatedProductsError(error));
    if (error?.status.length > 0) {
      toast.error(error?.message);
    } else {
      toast.error("Something went wrong");
    }
  }
};

/* Products Listing */
export const productsListingStart = createAction(
  ActionTypes.PRODUCTS_LISTING_START
);
export const productsListingSuccess = createAction(
  ActionTypes.PRODUCTS_LISTING_SUCCESS,
  (response) => response
);
export const productsListingError = createAction(
  ActionTypes.PRODUCTS_LISTING_ERROR,
  (error) => error
);
export const getProductsListing =
  (query, callback, callbackError) => async (dispatch) => {
    try {
      dispatch(productsListingStart());

      const response = await _productsListing(query);

      dispatch(productsListingSuccess(response));
      if (response) {
        callback(response);
      }
    } catch (error) {
      callbackError(error);
      dispatch(productsListingError(error));
      if (error?.status.length > 0) {
        toast.error(error?.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };
/* CATEGORIES BRAND  */
export const categoriesBrandsStart = createAction(
  ActionTypes.CATEGORIES_BRANDS_START
);
export const categoriesBrandsSuccess = createAction(
  ActionTypes.CATEGORIES_BRANDS_SUCCESS,
  (response) => response
);
export const categoriesBrandsError = createAction(
  ActionTypes.CATEGORIES_BRANDS_ERROR,
  (error) => error
);
export const getCategoriesAndBrands = (callback) => async (dispatch) => {
  try {
    dispatch(categoriesBrandsStart());

    const response = await _getcategoriesAndBrands();

    dispatch(categoriesBrandsSuccess(response));
    if (response) {
      callback(response);
    }
  } catch (error) {
    dispatch(categoriesBrandsError(error));
    if (error?.status.length > 0) {
      toast.error(error?.message);
    } else {
      toast.error("Something went wrong");
    }
  }
};
/* STORES  */
export const getStoresStart = createAction(ActionTypes.GET_STORES_START);
export const getStoresSuccess = createAction(
  ActionTypes.GET_STORES_SUCCESS,
  (response) => response
);
export const getStoresError = createAction(
  ActionTypes.GET_STORES_ERROR,
  (error) => error
);
export const getStores = (callback) => async (dispatch) => {
  try {
    dispatch(getStoresStart());

    const response = await _getStores();

    dispatch(getStoresSuccess(response));
    if (response) {
      callback(response);
    }
  } catch (error) {
    dispatch(getStoresError(error));
    if (error?.status.length > 0) {
      toast.error(error?.message);
    } else {
      toast.error("Something went wrong");
    }
  }
};

/* GET ALL WATCHLIST */

export const getAllWatchListStart = createAction(
  ActionTypes.GET_ALL_WATCHLIST_START
);
export const getAllWatchListSuccess = createAction(
  ActionTypes.GET_ALL_WATCHLIST_SUCCESS,
  (response) => response
);
export const getAllWatchListError = createAction(
  ActionTypes.GET_ALL_WATCHLIST_ERROR,
  (error) => error
);
export const getAllWatchList =
  (search, page, limit, callback) => async (dispatch) => {
    try {
      dispatch(getAllWatchListStart());

      const response = await _getAllWatchList(search, page, limit);

      dispatch(getAllWatchListSuccess(response));
      if (response) {
        callback(response);
      }
    } catch (error) {
      dispatch(getAllWatchListError(error));
      if (error?.status.length > 0) {
        toast.error(error?.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };
/* GET SINGLE WATCHLIST */

export const getSingleWatchListStart = createAction(
  ActionTypes.GET_SINGLE_WATCHLIST_START
);
export const getSingleWatchListSuccess = createAction(
  ActionTypes.GET_SINGLE_WATCHLIST_SUCCESS,
  (response) => response
);
export const getSingleWatchListError = createAction(
  ActionTypes.GET_SINGLE_WATCHLIST_ERROR,
  (error) => error
);
export const getSingleWatchList = (id, callback) => async (dispatch) => {
  try {
    dispatch(getSingleWatchListStart());

    const response = await _getSingleWatchList(id);

    dispatch(getSingleWatchListSuccess(response));
    if (response) {
      callback(response);
    }
  } catch (error) {
    dispatch(getSingleWatchListError(error));
    if (error?.status.length > 0) {
      toast.error(error?.message);
    } else {
      toast.error("Something went wrong");
    }
  }
};
/* ADD  WATCHLIST */

export const addWatchListStart = createAction(ActionTypes.ADD_WATCHLIST_START);
export const addWatchListSuccess = createAction(
  ActionTypes.ADD_WATCHLIST_SUCCESS,
  (response) => response
);
export const addWatchListError = createAction(
  ActionTypes.ADD_WATCHLIST_ERROR,
  (error) => error
);
export const addWatchList = (data, callback) => async (dispatch) => {
  try {
    dispatch(addWatchListStart());

    const response = await _addWatchList(data);

    dispatch(addWatchListSuccess(response));
    if (response) {
      callback(response);
    }
  } catch (error) {
    dispatch(addWatchListError(error));
    if (error?.status.length > 0) {
      toast.error(error?.message);
    } else {
      toast.error("Something went wrong");
    }
  }
};
/* UPDATE  WATCHLIST */

export const updateWatchListStart = createAction(
  ActionTypes.UPDATE_WATCHLIST_START
);
export const updateWatchListSuccess = createAction(
  ActionTypes.UPDATE_WATCHLIST_SUCCESS,
  (response) => response
);
export const updateWatchListError = createAction(
  ActionTypes.UPDATE_WATCHLIST_ERROR,
  (error) => error
);
export const updateWatchList = (id, data, callback) => async (dispatch) => {
  try {
    dispatch(updateWatchListStart());

    const response = await _updateWatchList(id, data);

    dispatch(updateWatchListSuccess(response));
    if (response) {
      callback(response);
    }
  } catch (error) {
    dispatch(updateWatchListError(error));
    if (error?.status.length > 0) {
      toast.error(error?.message);
    } else {
      toast.error("Something went wrong");
    }
  }
};
/* DELETE  WATCHLIST */

export const deleteWatchListStart = createAction(
  ActionTypes.DELETE_WATCHLIST_START
);
export const deleteWatchListSuccess = createAction(
  ActionTypes.DELETE_WATCHLIST_SUCCESS,
  (response) => response
);
export const deleteWatchListError = createAction(
  ActionTypes.DELETE_WATCHLIST_ERROR,
  (error) => error
);
export const deleteWatchList = (id, callback) => async (dispatch) => {
  try {
    dispatch(deleteWatchListStart());

    const response = await _deleteWatchList(id);

    dispatch(deleteWatchListSuccess(response));
    if (response) {
      callback(response);
    }
  } catch (error) {
    dispatch(deleteWatchListError(error));
    if (error?.status.length > 0) {
      toast.error(error?.message);
    } else {
      toast.error("Something went wrong");
    }
  }
};
const reducer = handleActions(
  {
    //Theme settings
    [ActionTypes.ROOT_CATEGORY_START]: (state) => ({
      ...state,
      rootCategory: {
        loading: true,
        response: {},
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.ROOT_CATEGORY_SUCCESS]: (state, action) => ({
      ...state,
      rootCategory: {
        ...state.rootCategory,
        response: action.payload,
        loading: false,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.ROOT_CATEGORY_ERROR]: (state, action) => ({
      ...state,
      rootCategory: {
        ...state.rootCategory,
        error: action.payload,
        loading: false,
        hasError: true,
        response: {},
      },
    }),
    [ActionTypes.PRODUCT_CATEGORY_START]: (state) => ({
      ...state,
      productCategory: {
        loading: true,
        response: {},
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.PRODUCT_CATEGORY_SUCCESS]: (state, action) => ({
      ...state,
      productCategory: {
        ...state.productCategory,
        response: action.payload,
        loading: false,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.PRODUCT_CATEGORY_ERROR]: (state, action) => ({
      ...state,
      productCategory: {
        ...state.productCategory,
        error: action.payload,
        loading: false,
        hasError: true,
        response: {},
      },
    }),
    [ActionTypes.CREATE_PHARMACY_PRODUCT_START]: (state) => ({
      ...state,
      createPharmacyProduct: {
        loading: true,
        response: {},
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.CREATE_PHARMACY_PRODUCT_SUCCESS]: (state, action) => ({
      ...state,
      createPharmacyProduct: {
        ...state.createPharmacyProduct,
        response: action.payload.data,
        loading: false,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.CREATE_PHARMACY_PRODUCT_ERROR]: (state, action) => ({
      ...state,
      createPharmacyProduct: {
        ...state.createPharmacyProduct,
        error: action.payload,
        loading: false,
        hasError: true,
        response: {},
      },
    }),

    [ActionTypes.UPLOAD_PRODUCT_IMAGE_START]: (state) => ({
      ...state,
      uploadProductImage: {
        loading: true,
        response: {},
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.UPLOAD_PRODUCT_IMAGE_SUCCESS]: (state, action) => ({
      ...state,
      uploadProductImage: {
        ...state.uploadProductImage,
        response: action.payload.data,
        loading: false,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.UPLOAD_PRODUCT_IMAGE_ERROR]: (state, action) => ({
      ...state,
      uploadProductImage: {
        ...state.uploadProductImage,
        error: action.payload,
        loading: false,
        hasError: true,
        response: {},
      },
    }),

    //PRODUCTS
    [ActionTypes.GET_PHARMACY_PRODUCTS_START]: (state) => ({
      ...state,
      products: {
        ...state.products,
        loading: true,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.GET_PHARMACY_PRODUCTS_SUCCESS]: (state, action) => ({
      ...state,
      products: {
        ...state.products,
        loading: false,
        hasError: false,
        error: {},
        response: action.payload?.data,
      },
    }),
    [ActionTypes.GET_PHARMACY_PRODUCTS_ERROR]: (state) => ({
      ...state,
      products: {
        ...state.products,
        loading: false,
        hasError: false,
        error: {},
        response: {},
      },
    }),

    //PRODUCT DETAIL
    [ActionTypes.GET_PHARMACY_PRODUCT_DETAIL_START]: (state) => ({
      ...state,
      product: {
        ...state.product,
        loading: true,
        hasError: false,
        error: {},
        response: {},
      },
    }),
    [ActionTypes.GET_PHARMACY_PRODUCT_DETAIL_SUCCESS]: (state, action) => ({
      ...state,

      product: {
        ...state.product,
        loading: false,
        hasError: false,
        error: {},
        response: action.payload?.data,
      },
    }),
    [ActionTypes.GET_PHARMACY_PRODUCT_DETAIL_ERROR]: (state) => ({
      ...state,

      product: {
        ...state.product,
        loading: false,
        hasError: false,
        error: {},
        response: {},
      },
    }),
    //SAME PRODUCT INVENTORY
    [ActionTypes.GET_SAME_PRODUCT_INVENTORY_START]: (state) => ({
      ...state,
      sameProductInventory: {
        ...state.sameProductInventory,
        loading: true,
        hasError: false,
        error: {},
        response: {},
      },
    }),
    [ActionTypes.GET_SAME_PRODUCT_INVENTORY_SUCCESS]: (state, action) => ({
      ...state,
      sameProductInventory: {
        ...state.sameProductInventory,
        loading: false,
        hasError: false,
        error: {},
        response: action.payload?.data,
      },
    }),
    [ActionTypes.GET_SAME_PRODUCT_INVENTORY_ERROR]: (state) => ({
      ...state,

      sameProductInventory: {
        ...state.sameProductInventory,
        loading: false,
        hasError: false,
        error: {},
        response: {},
      },
    }),

    //Product Inventory By Detail
    [ActionTypes.GET_INVENTORY_BY_DETAIL_START]: (state) => ({
      ...state,
      productInventoryByDetail: {
        ...state.productInventoryByDetail,
        loading: true,
        hasError: false,
        error: {},
        response: {},
      },
    }),
    [ActionTypes.GET_INVENTORY_BY_DETAIL_SUCCESS]: (state, action) => ({
      ...state,
      productInventoryByDetail: {
        ...state.productInventoryByDetail,
        loading: false,
        hasError: false,
        error: {},
        response: action.payload?.data,
      },
    }),
    [ActionTypes.GET_INVENTORY_BY_DETAIL_ERROR]: (state) => ({
      ...state,

      productInventoryByDetail: {
        ...state.productInventoryByDetail,
        loading: false,
        hasError: false,
        error: {},
        response: {},
      },
    }),

    //PRODUCT BY DIN
    [ActionTypes.GET_PRODUCT_BY_DIN_START]: (state) => ({
      ...state,
      productByDIN: {
        ...state.productByDIN,
        loading: true,
        hasError: false,
        error: {},
        response: {},
      },
    }),
    [ActionTypes.GET_PRODUCT_BY_DIN_SUCCESS]: (state, action) => ({
      ...state,

      productByDIN: {
        ...state.productByDIN,
        loading: false,
        hasError: false,
        error: {},
        response: action.payload?.data,
      },
    }),
    [ActionTypes.GET_PRODUCT_BY_DIN_ERROR]: (state) => ({
      ...state,

      productByDIN: {
        ...state.productByDIN,
        loading: false,
        hasError: false,
        error: {},
        response: {},
      },
    }),

    //ADD PRODUCT
    [ActionTypes.ADD_PHARMACY_PRODUCT_START]: (state) => ({
      ...state,
      addProduct: {
        ...state.addProduct,
        loading: true,
        hasError: false,
        error: {},
        response: {},
      },
    }),
    [ActionTypes.ADD_PHARMACY_PRODUCT_SUCCESS]: (state, action) => ({
      ...state,

      addProduct: {
        ...state.addProduct,
        loading: false,
        hasError: false,
        error: {},
        response: action.payload?.data,
      },
    }),
    [ActionTypes.ADD_PHARMACY_PRODUCT_ERROR]: (state) => ({
      ...state,

      addProduct: {
        ...state.addProduct,
        loading: false,
        hasError: false,
        error: {},
        response: {},
      },
    }),

    //UPLOAD PRODUCT IMAGE
    [ActionTypes.UPLOAD_PHARMACY_PRODUCT_IMAGE_START]: (state) => ({
      ...state,
      uploadProductImage: {
        ...state.uploadProductImage,
        loading: true,
        hasError: false,
        error: {},
        response: {},
      },
    }),
    [ActionTypes.UPLOAD_PHARMACY_PRODUCT_IMAGE_SUCCESS]: (state, action) => ({
      ...state,

      uploadProductImage: {
        ...state.uploadProductImage,
        loading: false,
        hasError: false,
        error: {},
        response: action.payload?.data,
      },
    }),
    [ActionTypes.UPLOAD_PHARMACY_PRODUCT_IMAGE_ERROR]: (state) => ({
      ...state,

      uploadProductImage: {
        ...state.uploadProductImage,
        loading: false,
        hasError: false,
        error: {},
        response: {},
      },
    }),

    //REMOVE PRODUCT IMAGE
    [ActionTypes.REMOVE_PHARMACY_PRODUCT_IMAGE_START]: (state) => ({
      ...state,
      removeProductImage: {
        ...state.removeProductImage,
        loading: true,
        hasError: false,
        error: {},
        response: {},
      },
    }),
    [ActionTypes.REMOVE_PHARMACY_PRODUCT_IMAGE_SUCCESS]: (state, action) => ({
      ...state,

      removeProductImage: {
        ...state.removeProductImage,
        loading: false,
        hasError: false,
        error: {},
        response: action.payload?.data,
      },
    }),
    [ActionTypes.REMOVE_PHARMACY_PRODUCT_IMAGE_ERROR]: (state) => ({
      ...state,

      removeProductImage: {
        ...state.removeProductImage,
        loading: false,
        hasError: false,
        error: {},
        response: {},
      },
    }),

    //  LANDING PAGE PRODUCTS
    [ActionTypes.GET_COVER_PRODUCTS_START]: (state) => ({
      ...state,
      landingPageProducts: {
        loading: true,
        response: {},
        hasError: false,
        error: {},
      },
    }),

    [ActionTypes.GET_COVER_PRODUCTS_SUCCESS]: (state, action) => ({
      ...state,
      landingPageProducts: {
        ...state.landingPageProducts,
        response: action.payload,
        loading: false,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.GET_COVER_PRODUCTS_ERROR]: (state, action) => ({
      ...state,
      landingPageProducts: {
        ...state.landingPageProducts,
        error: action.payload,
        loading: false,
        hasError: true,
        response: {},
      },
    }),
    //  LANDING PAGE PRODUCT DETAIL
    [ActionTypes.GET_PRODUCT_DETAIL_START]: (state) => ({
      ...state,
      productDetail: {
        loading: true,
        response: {},
        hasError: false,
        error: {},
      },
    }),

    [ActionTypes.GET_PRODUCT_DETAIL_SUCCESS]: (state, action) => ({
      ...state,
      productDetail: {
        ...state.productDetail,
        response: action.payload,
        loading: false,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.GET_PRODUCT_DETAIL_ERROR]: (state, action) => ({
      ...state,
      productDetail: {
        ...state.productDetail,
        error: action.payload,
        loading: false,
        hasError: true,
        response: {},
      },
    }),
    [ActionTypes.GET_PRODUCT_CATEGORY_START]: (state) => ({
      ...state,
      landingPageCategories: {
        loading: true,
        response: {},
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.GET_PRODUCT_CATEGORY_SUCCESS]: (state, action) => ({
      ...state,
      landingPageCategories: {
        ...state.landingPageCategories,
        response: action.payload,
        loading: false,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.GET_PRODUCT_CATEGORY_ERROR]: (state, action) => ({
      ...state,
      landingPageCategories: {
        ...state.landingPageCategories,
        error: action.payload,
        loading: false,
        hasError: true,
        response: {},
      },
    }),
    //  SIMILAR PRODUCTS
    [ActionTypes.GET_SIMILAR_PRODUCTS_START]: (state) => ({
      ...state,
      similarProducts: {
        loading: true,
        response: {},
        hasError: false,
        error: {},
      },
    }),

    [ActionTypes.GET_SIMILAR_PRODUCTS_SUCCESS]: (state, action) => ({
      ...state,
      similarProducts: {
        ...state.similarProducts,
        response: action.payload,
        loading: false,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.GET_SIMILAR_PRODUCTS_ERROR]: (state, action) => ({
      ...state,
      similarProducts: {
        ...state.similarProducts,
        error: action.payload,
        loading: false,
        hasError: true,
        response: {},
      },
    }),
    //  EDIT PRODUCT DETAIL
    [ActionTypes.EDIT_PRODUCT_DETAIL_START]: (state) => ({
      ...state,
      editProductDetail: {
        loading: true,
        response: {},
        hasError: false,
        error: {},
      },
    }),

    [ActionTypes.EDIT_PRODUCT_DETAIL_SUCCESS]: (state, action) => ({
      ...state,
      editProductDetail: {
        ...state.editProductDetail,
        response: action.payload,
        loading: false,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.EDIT_PRODUCT_DETAIL_ERROR]: (state, action) => ({
      ...state,
      editProductDetail: {
        ...state.editProductDetail,
        error: action.payload,
        loading: false,
        hasError: true,
        response: {},
      },
    }),
    //  ALL PRODUCT INVENTORIES
    [ActionTypes.GET_ALL_PRODUCT_INVENTORY_START]: (state) => ({
      ...state,
      allProductInventories: {
        loading: true,
        response: {},
        hasError: false,
        error: {},
      },
    }),

    [ActionTypes.GET_ALL_PRODUCT_INVENTORY_SUCCESS]: (state, action) => ({
      ...state,
      allProductInventories: {
        ...state.allProductInventories,
        response: action.payload,
        loading: false,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.GET_ALL_PRODUCT_INVENTORY_ERROR]: (state, action) => ({
      ...state,
      allProductInventories: {
        ...state.allProductInventories,
        error: action.payload,
        loading: false,
        hasError: true,
        response: {},
      },
    }),
    //  DELETE PRODUCT INVENTORY
    [ActionTypes.DELETE_PRODUCT_INVENTORY_START]: (state) => ({
      ...state,
      deleteProductInventory: {
        loading: true,
        response: {},
        hasError: false,
        error: {},
      },
    }),

    [ActionTypes.DELETE_PRODUCT_INVENTORY_SUCCESS]: (state, action) => ({
      ...state,
      deleteProductInventory: {
        ...state.deleteProductInventory,
        response: action.payload,
        loading: false,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.DELETE_PRODUCT_INVENTORY_ERROR]: (state, action) => ({
      ...state,
      deleteProductInventory: {
        ...state.deleteProductInventory,
        error: action.payload,
        loading: false,
        hasError: true,
        response: {},
      },
    }),
    //  PRODUCT INVENTORY DETAIL
    [ActionTypes.GET_PRODUCT_INVENTORY_DETAIL_START]: (state) => ({
      ...state,
      productInventoryDetail: {
        loading: true,
        response: {},
        hasError: false,
        error: {},
      },
    }),

    [ActionTypes.GET_PRODUCT_INVENTORY_DETAIL_SUCCESS]: (state, action) => ({
      ...state,
      productInventoryDetail: {
        ...state.productInventoryDetail,
        response: action.payload,
        loading: false,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.GET_PRODUCT_INVENTORY_DETAIL_ERROR]: (state, action) => ({
      ...state,
      productInventoryDetail: {
        ...state.productInventoryDetail,
        error: action.payload,
        loading: false,
        hasError: true,
        response: {},
      },
    }),
    //  UPDATE PRODUCT INVENTORY
    [ActionTypes.UPDATE_INVENTORY_DETAIL_START]: (state) => ({
      ...state,
      updateInventory: {
        loading: true,
        response: {},
        hasError: false,
        error: {},
      },
    }),

    [ActionTypes.UPDATE_INVENTORY_DETAIL_SUCCESS]: (state, action) => ({
      ...state,
      updateInventory: {
        ...state.updateInventory,
        response: action.payload,
        loading: false,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.UPDATE_INVENTORY_DETAIL_ERROR]: (state, action) => ({
      ...state,
      updateInventory: {
        ...state.updateInventory,
        error: action.payload,
        loading: false,
        hasError: true,
        response: {},
      },
    }),
    //  ADD PRODUCT INVENTORY
    [ActionTypes.ADD_PRODUCT_INVENTORY_START]: (state) => ({
      ...state,
      addInventory: {
        loading: true,
        response: {},
        hasError: false,
        error: {},
      },
    }),

    [ActionTypes.ADD_PRODUCT_INVENTORY_SUCCESS]: (state, action) => ({
      ...state,
      addInventory: {
        ...state.addInventory,
        response: action.payload,
        loading: false,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.ADD_PRODUCT_INVENTORY_ERROR]: (state, action) => ({
      ...state,
      addInventory: {
        ...state.addInventory,
        error: action.payload,
        loading: false,
        hasError: true,
        response: {},
      },
    }),

    //Add Inventory WishList
    [ActionTypes.ADD_INVENTORY_WISHLIST_START]: (state) => ({
      ...state,
      addInventoryWishList: {
        loading: true,
        response: {},
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.ADD_INVENTORY_WISHLIST_SUCCESS]: (state, action) => ({
      ...state,
      addInventoryWishList: {
        ...state.addInventoryWishList,
        response: action.payload,
        loading: false,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.ADD_INVENTORY_WISHLIST_ERROR]: (state, action) => ({
      ...state,
      addInventoryWishList: {
        ...state.addInventoryWishList,
        error: action.payload,
        loading: false,
        hasError: true,
        response: {},
      },
    }),

    //Remove Inventory WishList
    [ActionTypes.REMOVE_INVENTORY_WISHLIST_START]: (state) => ({
      ...state,
      removeInventoryWishList: {
        loading: true,
        response: {},
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.REMOVE_INVENTORY_WISHLIST_SUCCESS]: (state, action) => ({
      ...state,
      removeInventoryWishList: {
        ...state.removeInventoryWishList,
        response: action.payload,
        loading: false,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.REMOVE_INVENTORY_WISHLIST_ERROR]: (state, action) => ({
      ...state,
      removeInventoryWishList: {
        ...state.removeInventoryWishList,
        error: action.payload,
        loading: false,
        hasError: true,
        response: {},
      },
    }),

    //  GET INVENTORY WISH-LISTS
    [ActionTypes.GET_INVENTORY_WISH_LISTS_START]: (state) => ({
      ...state,
      getInventoryWishLists: {
        ...state.getInventoryWishLists,
        loading: true,
        hasError: false,
        error: {},
      },
    }),

    [ActionTypes.GET_INVENTORY_WISH_LISTS_SUCCESS]: (state, action) => ({
      ...state,
      getInventoryWishLists: {
        ...state.getInventoryWishLists,
        response: action.payload,
        loading: false,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.GET_INVENTORY_WISH_LISTS_ERROR]: (state, action) => ({
      ...state,
      getInventoryWishLists: {
        ...state.getInventoryWishLists,
        error: action.payload,
        loading: false,
        hasError: true,
        response: {},
      },
    }),
    //  SEARCH_PRODUCTS
    [ActionTypes.SEARCH_PRODUCTS_START]: (state) => ({
      ...state,
      searchProducts: {
        loading: true,
        response: {},
        hasError: false,
        error: {},
      },
    }),

    [ActionTypes.SEARCH_PRODUCTS_SUCCESS]: (state, action) => ({
      ...state,
      searchProducts: {
        ...state.searchProducts,
        response: action.payload,
        loading: false,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.SEARCH_PRODUCTS_ERROR]: (state, action) => ({
      ...state,
      searchProducts: {
        ...state.searchProducts,
        error: action.payload,
        loading: false,
        hasError: true,
        response: {},
      },
    }),
    //  ENLIST DELIST PRODUCTS
    [ActionTypes.ENLIST_DELIST_PRODUCTS_START]: (state) => ({
      ...state,
      enlistDelistProducts: {
        loading: true,
        response: {},
        hasError: false,
        error: {},
      },
    }),

    [ActionTypes.ENLIST_DELIST_PRODUCTS_SUCCESS]: (state, action) => ({
      ...state,
      enlistDelistProducts: {
        ...state.enlistDelistProducts,
        response: action.payload,
        loading: false,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.ENLIST_DELIST_PRODUCTS_ERROR]: (state, action) => ({
      ...state,
      enlistDelistProducts: {
        ...state.enlistDelistProducts,
        error: action.payload,
        loading: false,
        hasError: true,
        response: {},
      },
    }),
    //  ENLIST DELIST INVENTORY
    [ActionTypes.ENLIST_DELIST_INVENTORY_START]: (state) => ({
      ...state,
      enlistDelistInventory: {
        loading: true,
        response: {},
        hasError: false,
        error: {},
      },
    }),

    [ActionTypes.ENLIST_DELIST_INVENTORY_SUCCESS]: (state, action) => ({
      ...state,
      enlistDelistInventory: {
        ...state.enlistDelistInventory,
        response: action.payload,
        loading: false,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.ENLIST_DELIST_INVENTORY_ERROR]: (state, action) => ({
      ...state,
      enlistDelistInventory: {
        ...state.enlistDelistInventory,
        error: action.payload,
        loading: false,
        hasError: true,
        response: {},
      },
    }),
    //  RELATED PRODUCTS
    [ActionTypes.GET_RELATED_PRODUCTS_START]: (state) => ({
      ...state,
      relatedProducts: {
        loading: true,
        response: {},
        hasError: false,
        error: {},
      },
    }),

    [ActionTypes.GET_RELATED_PRODUCTS_SUCCESS]: (state, action) => ({
      ...state,
      relatedProducts: {
        ...state.relatedProducts,
        response: action.payload,
        loading: false,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.GET_RELATED_PRODUCTS_ERROR]: (state, action) => ({
      ...state,
      relatedProducts: {
        ...state.relatedProducts,
        error: action.payload,
        loading: false,
        hasError: true,
        response: {},
      },
    }),
    //   PRODUCTS LISTING
    [ActionTypes.PRODUCTS_LISTING_START]: (state) => ({
      ...state,
      productsLisiting: {
        loading: true,
        response: {},
        hasError: false,
        error: {},
      },
    }),

    [ActionTypes.PRODUCTS_LISTING_SUCCESS]: (state, action) => ({
      ...state,
      productsLisiting: {
        ...state.productsLisiting,
        response: action.payload,
        loading: false,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.PRODUCTS_LISTING_ERROR]: (state, action) => ({
      ...state,
      productsLisiting: {
        ...state.productsLisiting,
        error: action.payload,
        loading: false,
        hasError: true,
        response: {},
      },
    }),
    //   CATEGORIES BRAND
    [ActionTypes.CATEGORIES_BRANDS_START]: (state) => ({
      ...state,
      brands: {
        loading: true,
        response: {},
        hasError: false,
        error: {},
      },
    }),

    [ActionTypes.CATEGORIES_BRANDS_SUCCESS]: (state, action) => ({
      ...state,
      brands: {
        ...state.brands,
        response: action.payload,
        loading: false,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.CATEGORIES_BRANDS_ERROR]: (state, action) => ({
      ...state,
      brands: {
        ...state.brands,
        error: action.payload,
        loading: false,
        hasError: true,
        response: {},
      },
    }),
    //   GET STORES
    [ActionTypes.GET_STORES_START]: (state) => ({
      ...state,
      stores: {
        loading: true,
        response: {},
        hasError: false,
        error: {},
      },
    }),

    [ActionTypes.GET_STORES_SUCCESS]: (state, action) => ({
      ...state,
      stores: {
        ...state.stores,
        response: action.payload,
        loading: false,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.GET_STORES_ERROR]: (state, action) => ({
      ...state,
      stores: {
        ...state.stores,
        error: action.payload,
        loading: false,
        hasError: true,
        response: {},
      },
    }),
    //   GET ALL WATCHLIST
    [ActionTypes.GET_ALL_WATCHLIST_START]: (state) => ({
      ...state,
      getAllWatchList: {
        loading: true,
        response: {},
        hasError: false,
        error: {},
      },
    }),

    [ActionTypes.GET_ALL_WATCHLIST_SUCCESS]: (state, action) => ({
      ...state,
      getAllWatchList: {
        ...state.getAllWatchList,
        response: action.payload.data,
        loading: false,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.GET_ALL_WATCHLIST_ERROR]: (state, action) => ({
      ...state,
      getAllWatchList: {
        ...state.getAllWatchList,
        error: action.payload,
        loading: false,
        hasError: true,
        response: {},
      },
    }),
    //   GET SINGLE WATCHLIST
    [ActionTypes.GET_SINGLE_WATCHLIST_START]: (state) => ({
      ...state,
      getSingleWatchList: {
        loading: true,
        response: {},
        hasError: false,
        error: {},
      },
    }),

    [ActionTypes.GET_SINGLE_WATCHLIST_SUCCESS]: (state, action) => ({
      ...state,
      getSingleWatchList: {
        ...state.getSingleWatchList,
        response: action.payload,
        loading: false,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.GET_SINGLE_WATCHLIST_ERROR]: (state, action) => ({
      ...state,
      getSingleWatchList: {
        ...state.getSingleWatchList,
        error: action.payload,
        loading: false,
        hasError: true,
        response: {},
      },
    }),
    //   ADD WATCHLIST
    [ActionTypes.ADD_WATCHLIST_START]: (state) => ({
      ...state,
      addWatchList: {
        loading: true,
        response: {},
        hasError: false,
        error: {},
      },
    }),

    [ActionTypes.ADD_WATCHLIST_SUCCESS]: (state, action) => ({
      ...state,
      addWatchList: {
        ...state.addWatchList,
        response: action.payload,
        loading: false,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.ADD_WATCHLIST_ERROR]: (state, action) => ({
      ...state,
      addWatchList: {
        ...state.addWatchList,
        error: action.payload,
        loading: false,
        hasError: true,
        response: {},
      },
    }),
    //   UPDATE WATCHLIST
    [ActionTypes.UPDATE_WATCHLIST_START]: (state) => ({
      ...state,
      updateWatchList: {
        loading: true,
        response: {},
        hasError: false,
        error: {},
      },
    }),

    [ActionTypes.UPDATE_WATCHLIST_SUCCESS]: (state, action) => ({
      ...state,
      updateWatchList: {
        ...state.updateWatchList,
        response: action.payload,
        loading: false,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.UPDATE_WATCHLIST_ERROR]: (state, action) => ({
      ...state,
      updateWatchList: {
        ...state.updateWatchList,
        error: action.payload,
        loading: false,
        hasError: true,
        response: {},
      },
    }),
    //   DELETE WATCHLIST
    [ActionTypes.DELETE_WATCHLIST_START]: (state) => ({
      ...state,
      deleteWatchList: {
        loading: true,
        response: {},
        hasError: false,
        error: {},
      },
    }),

    [ActionTypes.DELETE_WATCHLIST_SUCCESS]: (state, action) => ({
      ...state,
      deleteWatchList: {
        ...state.deleteWatchList,
        response: action.payload,
        loading: false,
        hasError: false,
        error: {},
      },
    }),
    [ActionTypes.DELETE_WATCHLIST_ERROR]: (state, action) => ({
      ...state,
      deleteWatchList: {
        ...state.deleteWatchList,
        error: action.payload,
        loading: false,
        hasError: true,
        response: {},
      },
    }),
  },
  initialState
);

export default reducer;
