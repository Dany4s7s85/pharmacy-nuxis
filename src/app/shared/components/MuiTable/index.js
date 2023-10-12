import { DataGrid } from "@mui/x-data-grid";

const MuiDataGridTable = ({
  rows = [],
  columns = [],
  className = "table-header",
  filterMode = "client",
  getRowId
}) => {
  return (
    <DataGrid
      rows={rows && rows?.length > 0 ? rows : []}
      columns={columns && columns?.length > 0 ? columns : []}
      getRowId={(row) => Math.random()}
      className={className}
      filterMode={filterMode}
      rowHeight={50}
      autoHeight
      hideFooter={true}
      hideFooterRowCount={true}
      componentsProps={{
        toolbar: {
          showQuickFilter: true,
          quickFilterProps: { debounceMs: 500 },
        },
      }}
    />
  );
};

export default MuiDataGridTable;
