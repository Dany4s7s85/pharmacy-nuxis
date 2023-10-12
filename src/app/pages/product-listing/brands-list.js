import React, { useState } from 'react';
import {
  Box,
  MenuItem,
  Divider,
  Typography,
  FormControl,
  Input,
  InputLabel,
  InputAdornment,
  OutlinedInput,
  IconButton,
  AccordionDetails,
  AccordionSummary,
  Accordion,
  TextField,
  FilledInput,
} from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import SearchIcon from '@mui/icons-material/Search';
const Menus = ({
  brands,
  filterState,
  setFilterState,
  setBrands,
  imuteableBrands,
}) => {
  const handelCheckBoxChange = (cate) => {
    const selectedBrands = [...filterState.selectedBrands];
    const selectedFilters = [...filterState.selectedFilters];
    let foundIndex = selectedBrands.findIndex((el) => cate == el);

    if (foundIndex <= -1) {
      selectedBrands.push(cate);
      selectedFilters.push({
        label: 'brand',
        value: cate,
        type: 'selectedBrands',
      });
    } else {
      let foundFilterIndex = selectedFilters.findIndex(
        (el) => el.label == 'brand' && el.value == cate
      );

      if (foundFilterIndex > -1) {
        selectedFilters.splice(foundFilterIndex, 1);
      }

      selectedBrands.splice(foundIndex, 1);
    }

    setFilterState({ ...filterState, selectedBrands, selectedFilters });
  };

  const isChecked = (cate) => {
    const selectedBrands = [...filterState.selectedBrands];
    let foundIndex = selectedBrands.findIndex((el) => cate.label == el);

    if (foundIndex > -1) {
      return true;
    }

    return false;
  };

  const handleChange = (e) => {
    let tmpBrands = [...brands];
    tmpBrands = imuteableBrands;
    if (e.target.value != '') {
      tmpBrands = imuteableBrands.filter((el) =>
        el?.label?.toLowerCase()?.includes(e.target.value)
      );
    }

    setBrands(tmpBrands);
  };

  return (
    <Accordion
      className="accordian "
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
        <Typography>Brands</Typography>
      </AccordionSummary>
      <AccordionDetails>
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
            {brands && brands?.length
              ? brands?.map((el, i) => (
                <MenuItem
                  className="filter-menu"
                  onClick={() => handelCheckBoxChange(el?.label)}
                >
                  <Box
                    display="flex"
                    paddingX={"0"}
                    alignItems={'center'}
                    sx={{ width: '100%', height: '45px' }}
                  >
                    <Box
                      display="flex"
                      flexDirection="row"
                      justifyContent={'space-between'}
                      alignItems={'center'}
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
