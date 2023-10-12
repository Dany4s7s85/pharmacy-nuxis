import { Box, Checkbox, FormControlLabel, FormGroup } from "@mui/material";

const CategoriesList = ({ cate, setFilterState, filterState }) => {
  const handelCheckBoxChange = (e, cate) => {
    const selectedCategories = [...filterState.selectedCategories];
    const selectedFilters = [...filterState.selectedFilters];
    const value = e.target.checked;

    if (value) {
      selectedCategories.push(cate);
      selectedFilters.push({
        label: "category",
        value: cate,
        type: "selectedCategories",
      });
    } else {
      let foundIndex = selectedCategories.findIndex((el) => cate == el);

      let foundFilterIndex = selectedFilters.findIndex(
        (el) => el.label == "category" && el.value == cate
      );

      if (foundFilterIndex > -1) {
        selectedFilters.splice(foundFilterIndex, 1);
      }

      if (foundIndex > -1) {
        selectedCategories.splice(foundIndex, 1);
      }
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

export default CategoriesList;
