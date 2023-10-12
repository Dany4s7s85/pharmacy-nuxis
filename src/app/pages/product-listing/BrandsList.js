import { Box, Checkbox, FormControlLabel, FormGroup } from "@mui/material";

const BrandsList = ({ cate, setFilterState, filterState }) => {
  const handelCheckBoxChange = (e, cate) => {
    const selectedBrands = [...filterState.selectedBrands];
    const selectedFilters = [...filterState.selectedFilters];
    const value = e.target.checked;

    if (value) {
      selectedBrands.push(cate);
      selectedFilters.push({
        label: "brand",
        value: cate,
        type: "selectedBrands",
      });
    } else {
      let foundIndex = selectedBrands.findIndex((el) => cate == el);
      let foundFilterIndex = selectedFilters.findIndex(
        (el) => el.label == "brand" && el.value == cate
      );

      if (foundFilterIndex > -1) {
        selectedFilters.splice(foundFilterIndex, 1);
      }
      if (foundIndex > -1) {
        selectedBrands.splice(foundIndex, 1);
      }
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

  return (
    <Box>
      <FormGroup sx={{ marginTop: "10px" }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={isChecked(cate)}
              onChange={(e) => handelCheckBoxChange(e, cate?.label)}
            />
          }
          label={cate?.label}
        />
      </FormGroup>
    </Box>
  );
};

export default BrandsList;
