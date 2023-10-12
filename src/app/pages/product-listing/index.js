import React, { useContext, useEffect, useRef, useState } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  OutlinedInput,
} from '@mui/material';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import DoneIcon from '@mui/icons-material/Done';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import AppsIcon from '@mui/icons-material/Apps';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import {
  getCategoriesAndBrands,
  getProductsListing,
} from '../../services/products';
import { useDispatch, useSelector } from 'react-redux';
import { removeDuplicates } from '../../helpers/formatting';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ProductLists from './productsList';
import { FilterContext } from '../../context/FilterContext';
import { Button } from '@mui/material';
// import InfiniteScroll from "react-infinite-scroller";
import InfiniteScroll from 'react-infinite-scroll-component';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import { set } from 'lodash';
import BrandsList from './brands-list';
import CategoriesList from './categories-list';
import tile from '../../assets/images/tile.svg';
import tile1 from '../../assets/images/tile1.svg';
import './product-listing.scss';
import sideDashboard from '../../assets/images/sideDashboard.svg';
import lineIcon from '../../assets/images/lineIcon.svg';

const ProductListing = () => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [imuteableBrands, setImuteableBrands] = useState([]);
  const [imuteableCat, setImuteableCat] = useState([]);
  const [limit, setLimit] = useState(12);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [listBulleted, setListBulleted] = useState(false);
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  const [state, setState] = useState({
    data: [],
    totalRecodes: null,
  });
  const [filterState, setFilterState] = useContext(FilterContext);
  const maxPriceRef = useRef(null);
  const minPriceRef = useRef(null);
  const productsLisitingLoading = useSelector(
    (state) => state?.product?.productsLisiting?.loading
  );
  const brandsLoading = useSelector((state) => state?.product?.brands?.loading);
  const dispatch = useDispatch();

  useEffect(() => {
    window.addEventListener('resize', () => setInnerWidth(window.innerWidth));
    if (innerWidth <= 900) {
      setListBulleted(false);
    }
    return () => {
      window.removeEventListener('resize', () =>
        setInnerWidth(window.innerWidth)
      );
    };
  });
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    setIsLoading(true);
    dispatch(
      getProductsListing(
        { ...filterState, page: 1, limit },
        function (response) {
          if (response?.status == 'success') {
            setState({
              ...state,
              data: response?.data[0]?.data,
              totalRecodes: response?.data[0]?.metadata[0]?.total,
            });
            setIsLoading(false);
            setPage(response?.data[0]?.metadata[0]?.page + 1);
          }
        },
        function (err) {
          setIsLoading(false);
        }
      )
    );
  }, [filterState]);

  useEffect(() => {
    dispatch(
      getCategoriesAndBrands(function (response) {
        if (response?.status == 'success') {
          let tempCat = response?.data?.categories_brands?.map((item) => {
            return {
              label: item?.PRODUCT_CATEGORIZATION,
              value: item?.PRODUCT_CATEGORIZATION,
            };
          });

          if (tempCat?.length) {
            tempCat = removeDuplicates(tempCat, 'label');
          }

          let tempBrands = response?.data?.categories_brands?.map((item) => {
            return {
              label: item?.brand,
              value: item?.brand,
            };
          });

          if (tempBrands?.length) {
            tempBrands = removeDuplicates(tempBrands, 'label');
          }

          setCategories(tempCat);
          setBrands(tempBrands);
          setImuteableBrands(tempBrands);
          setImuteableCat(tempCat);
        }
      })
    );
  }, []);

  const fetchData = async () => {
    if (state?.data?.length == state?.totalRecodes) {
      return false;
    } else {
      dispatch(
        getProductsListing(
          { ...filterState, page, limit },
          function (response) {
            if (response?.status == 'success') {
              setState({
                ...state,
                data: [...state?.data, ...response?.data[0]?.data],
                totalRecodes: response?.data[0]?.metadata[0]?.total,
              });
              setPage(response?.data[0]?.metadata[0]?.page + 1);
            }
          },
          function (err) { }
        )
      );
    }
  };

  const handleDelete = (item, i) => {
    let filterType = item.type;
    const selectedFilters = [...filterState.selectedFilters];

    selectedFilters.splice(i, 1);

    if (item.type == 'selectedBrands' || item.type == 'selectedCategories') {
      const array = [...filterState[filterType]];
      let foundIndex = array.findIndex((el) => el == item.value);

      if (`${foundIndex}`) {
        array.splice(foundIndex, 1);
      }

      setFilterState({ ...filterState, [filterType]: array, selectedFilters });
    } else {
      if (filterType == 'price') {
        if (minPriceRef) {
          minPriceRef.current.value = '';
        }

        if (maxPriceRef) {
          maxPriceRef.current.value = '';
        }
      }

      setFilterState({
        ...filterState,
        ...(filterType == 'sort' && { sort: '' }),
        ...(filterType == 'price' && { max_price: '', min_price: '' }),
        selectedFilters,
      });
    }
  };

  const handleClearAll = () => {
    setFilterState({
      selectedFilters: [],
      selectedBrands: [],
      selectedCategories: [],
      max_price: null,
      min_price: null,
      sort_by: '',
    });

    if (minPriceRef) {
      minPriceRef.current.value = '';
    }

    if (maxPriceRef) {
      maxPriceRef.current.value = '';
    }
  };

  const handlePriceRange = () => {
    let max_price = maxPriceRef?.current?.value;
    let min_price = minPriceRef?.current?.value;
    let selectedFilters = [...filterState.selectedFilters];

    if (`${max_price}` || `${min_price}`) {
      let index = selectedFilters.findIndex((el) => el.type == 'price');
      if (index > -1) {
        selectedFilters[index] = {
          ...selectedFilters[index],
          value: `${min_price}-${max_price}`,
        };
      } else {
        selectedFilters.push({
          label: 'price',
          value: `${min_price}-${max_price}`,
          type: 'price',
        });
      }

      setFilterState({ ...filterState, max_price, min_price, selectedFilters });
    }
  };

  const handleSortChange = (value) => {
    let selectedFilters = [...filterState.selectedFilters];

    let index = selectedFilters.findIndex((el) => el.type == 'sort');

    if (index > -1) {
      selectedFilters[index] = { ...selectedFilters[index], value: value };
    } else {
      selectedFilters.push({ label: 'sort', value: value, type: 'sort' });
    }
    setFilterState({ ...filterState, sort: value, selectedFilters });
  };

  const filters = [
    {
      label: 'High to Low Price',
      value: 'pricedesc',
    },
    {
      label: 'Low to High Price',
      value: 'priceasc',
    },
  ];

  return (
    <Box>
      <Grid container spacing={1}>
        <Grid item md={2} lg={2} sm={12} xs={12}>
          <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            <InputLabel shrink>Sort by:</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              label="Select"
              id="demo-simple-select"
              className="membersSelect"
              input={<OutlinedInput notched={false} />}
              placeholder="Select"
              displayEmpty
              inputProps={{ 'aria-label': 'Without label' }}
              value={filterState?.sort ? filterState?.sort : null}
              onChange={(e) => handleSortChange(e.target.value)}
            >
              <MenuItem value="">
                <Typography
                  sx={{
                    fontWeight: '500',
                    fontSize: '14px',
                    color: '#9FA3A9',
                  }}
                >
                  Select
                </Typography>
              </MenuItem>
              {filters.map((filter) => {
                return (
                  <MenuItem value={filter?.value}>
                    <Typography
                      sx={{
                        fontWeight: '500',
                        fontSize: '14px',
                        color: '#9FA3A9',
                      }}
                    >
                      {filter?.label}
                    </Typography>
                  </MenuItem>
                );
              })}
            </Select>
          </Box>
        </Grid>
        <Grid item md={6} lg={6} sm={12} xs={12}>
          <InputLabel shrink>Filter By:</InputLabel>
          <Grid container spacing={1}>
            <Grid item md={4} lg={4} sm={4} xs={12}>
              <Box>
                <BrandsList
                  brands={brands}
                  imuteableBrands={imuteableBrands}
                  setBrands={setBrands}
                  filterState={filterState}
                  setFilterState={setFilterState}
                />
              </Box>
            </Grid>
            <Grid item md={4} lg={4} sm={4} xs={12}>
              <Box>
                <CategoriesList
                  imuteableCat={imuteableCat}
                  setCategories={setCategories}
                  categories={categories}
                  filterState={filterState}
                  setFilterState={setFilterState}
                />
              </Box>
            </Grid>
            <Grid item md={4} lg={4} sm={4} xs={12}>
              <Box>
                <Accordion
                  className="accordian "
                  sx={{
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    boxShadow: 'none',
                    color: '#949AB1 !important',
                    backgroundColor: 'transparent !important',
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2a-content"
                    id="panel2a-header"
                  >
                    <Typography>Price</Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ p: 1 }}>
                    <Box sx={{ display: 'flex', marginTop: '10px' }}>
                      <TextField
                        placeholder="Min"
                        type="number"
                        inputRef={minPriceRef}
                        size="small"
                        // value={filterState?.min_price}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        sx={[
                          {
                            marginRight: '5px',
                            '.MuiInputBase-root': {
                              backgroundColor: '#e9ecef!important',
                            },
                          },
                        ]}
                      />
                      <TextField
                        size="small"
                        placeholder="Max"
                        type="number"
                        inputRef={maxPriceRef}
                        // value={filterState?.max_price}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        sx={[
                          {
                            mx: '5px',
                            '.MuiInputBase-root': {
                              backgroundColor: '#e9ecef!important',
                            },
                          },
                        ]}
                      />
                      <IconButton
                        sx={{ background: '#fff' }}
                        onClick={handlePriceRange}
                      >
                        <DoneIcon />
                      </IconButton>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              </Box>
            </Grid>
          </Grid>
        </Grid>
        <Grid item md={4} lg={4} sm={12} xs={12} alignSelf="center">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            {innerWidth > 900 && (
              <Box className="toggleActiveList">
                <IconButton
                  className={!listBulleted ? 'activeList' : 'notActiveList'}
                  disabled={!listBulleted ? true : false}
                >
                  <img
                    src={sideDashboard}
                    style={{
                      width: '22px',
                      height: '22px',
                      filter: 'brightness(50%) hue-rotate(87deg)',
                    }}
                    onClick={() => setListBulleted(false)}
                  />
                </IconButton>
                <IconButton
                  className={listBulleted ? 'activeList' : 'notActiveList'}
                  disabled={listBulleted ? true : false}
                >
                  <img
                    src={lineIcon}
                    style={{
                      width: '22px',
                      height: '22px',
                      filter: 'brightness(50%) hue-rotate(87deg)',
                    }}
                    onClick={() => setListBulleted(true)}
                  />
                </IconButton>
              </Box>
            )}
          </Box>
        </Grid>
        {filterState?.selectedFilters?.length > 0 ?
          <Grid item md={12} lg={12} xs={12}>
            <Stack
              direction="row"
              spacing={1}
              gap={2}
              sx={{ flex: '1', flexWrap: 'wrap' }}
            >
              {filterState &&
                filterState?.selectedFilters &&
                filterState?.selectedFilters?.length
                ? filterState?.selectedFilters.map((el, i, array) => (
                  <>
                    <Chip
                      label={`${el.label} : ${el.value}`}
                      onDelete={() => handleDelete(el, i)}
                    />
                    {i == array?.length - 1 ? (
                      <Button
                        variant="outlined"
                        startIcon={<ClearAllIcon />}
                        onClick={handleClearAll}
                      >
                        Clear All
                      </Button>
                    ) : (
                      ''
                    )}
                  </>
                ))
                : ''}
            </Stack>
          </Grid>
          : ""
        }

        <Grid item md={12} lg={12} sm={12} xs={12}>
          {isLoading ? (
            <Box
              sx={{
                display: 'flex',
                margin: '5rem auto',
                width: '100%',
                justifyContent: 'center',
              }}
            >
              <CircularProgress sx={{ color: ' #235D5E' }} />
            </Box>
          ) : (
            <InfiniteScroll
              dataLength={state?.data?.length}
              next={fetchData}
              hasMore={state?.data?.length !== state?.totalRecodes}
              loader={
                state?.data?.length != 0 ? (
                  <Box
                    sx={{
                      display: 'flex',
                      margin: '5rem auto',
                      width: '100%',
                      justifyContent: 'center',
                    }}
                  >
                    <CircularProgress sx={{ color: ' #235D5E' }} />
                  </Box>
                ) : (
                  <Box
                    sx={{
                      display: 'flex',
                      margin: '5rem auto',
                      width: '100%',
                      justifyContent: 'center',
                    }}
                  >
                    No Products are available!
                  </Box>
                )
              }
            >
              <Grid container spacing={1}>
                {state?.data && state?.data?.length > 0
                  ? state?.data?.map((item, index) => {
                    return (

                      <ProductLists
                        key={index}
                        prod={item}
                        listBulleted={listBulleted}
                      />

                    );
                  })
                  : null}
              </Grid>
            </InfiniteScroll>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};
export default ProductListing;
