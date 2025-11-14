import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import Box from "@mui/material/Box";

const columns: GridColDef[] = [
  { field: "tradeId", headerName: "Trade Id" },
  { field: "version", headerName: "Version" },
  { field: "counterPartyId", headerName: "Counter-Party Id" },
  { field: "bookId", headerName: "Book-Id" },
  { field: "maturityDate", headerName: "Maturity Date" },
  { field: "createdDate", headerName: "Created Date" },
  { field: "expired", headerName: "Expired" },
];

const today = new Date().toLocaleDateString("en-GB");

const rows = [
  {
    id: 1,
    tradeId: "T1",
    version: 1,
    counterPartyId: "CP-1",
    bookId: "B1",
    maturityDate: "20/05/2020",
    createdDate: today,
    expired: "N",
  },
  {
    id: 2,
    tradeId: "T2",
    version: 2,
    counterPartyId: "CP-2",
    bookId: "B1",
    maturityDate: "20/05/2021",
    createdDate: today,
    expired: "N",
  },
  {
    id: 3,
    tradeId: "T2",
    version: 1,
    counterPartyId: "CP-1",
    bookId: "B1",
    maturityDate: "20/05/2021",
    createdDate: "14/03/2015",
    expired: "N",
  },
  {
    id: 4,
    tradeId: "T3",
    version: 3,
    counterPartyId: "CP-3",
    bookId: "B2",
    maturityDate: "20/05/2014",
    createdDate: today,
    expired: "Y",
  },
];

function App() {
  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: { paginationModel: { pageSize: 5 } },
        }}
        pageSizeOptions={[5, 10, 20]}
        disableRowSelectionOnClick
      />
    </Box>
  );
}

export default App;
