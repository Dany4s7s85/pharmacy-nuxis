import React from 'react';
import {
  Box,
  MenuItem,
  Typography,
  FormControl,
  InputLabel,
  InputAdornment,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FilledInput,
} from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const Menus = ({
  categories,
  setFilterState,
  filterState,
  imuteableCat,
  setCategories,
}) => {
  const handelCheckBoxChange = (cate) => {
    const selectedCategories = [...filterState.selectedCategories];
    const selectedFilters = [...filterState.selectedFilters];
    let foundIndex = selectedCategories.findIndex((el) => cate == el);

    if (foundIndex <= -1) {
      selectedCategories.push(cate);
      selectedFilters.push({
        label: 'category',
        value: cate,
        type: 'selectedCategories',
      });
    } else {
      let foundFilterIndex = selectedFilters.findIndex(
        (el) => el.label == 'category' && el.value == cate
      );

      if (foundFilterIndex > -1) {
        selectedFilters.splice(foundFilterIndex, 1);
      }
      selectedCategories.splice(foundIndex, 1);
    }

    setFilterState({ ...filterState, selectedCategories, selectedFilters });
  };

  const isChecked = (cate) => {
    const selectedCategories = [...filterState.selectedCategories];
    let foundIndex = selectedCategories.findIndex((el) => cate.label == el);

    if (foundIndex > -1) {
      return true;
    }

    return false;
  };

  const handleChange = (e) => {
    let tmpCat = [...categories];
    tmpCat = imuteableCat;
    if (e.target.value != '') {
      tmpCat = imuteableCat.filter((el) =>
        el?.label?.toLowerCase()?.includes(e.target.value)
      );
    }

    setCategories(tmpCat);
  };

  return (
    <Accordion
      className="accordian"
      sx={{
        border: '1px solid #ccc',
        borderRadius: '4px',
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
        <Typography>Categories</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 1 }}>
        <Box>
          <FormControl sx={{ width: '100%', mb: 1 }} variant="filled">
            <InputLabel htmlFor="filled-adornment-password">Search</InputLabel>
            <FilledInput
              id="filled-adornment-password"
              type="text"
              onChange={handleChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    edge="end"
                  >
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
          <Box sx={{ maxHeight: '300px', overflow: 'auto' }}>
            {categories && categories.length
              ? categories?.map((el, i) => (
                <MenuItem
                  className="filter-menu"
                  onClick={() => handelCheckBoxChange(el?.label)}
                >
                  <Box
                    display="flex"
                    alignItems={'center'}
                    sx={{ width: '100%', height: '45px' }}
                  >
                    <Box
                      display="flex"
                      flexDirection="row"
                      justifyContent={'space-between'}
                      alignItems={'center'}
                      gap={1}
                      width={'100%'}
                    >
                      <Typography
                        variant="body"
                        sx={{
                          whiteSpace: 'pre-wrap',
                          whiteSpace: 'pre-wrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {el.label}
                      </Typography>
                      {isChecked(el) && (
                        <DoneIcon style={{ color: '#235D5E' }} />
                      )}
                    </Box>
                  </Box>
                </MenuItem>
              ))
              : ''}
          </Box>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default Menus;
