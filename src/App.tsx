import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { useEffect, useState } from "react";

const columns: GridColDef[] = [
  { field: "tradeId", headerName: "Trade Id" },
  { field: "version", headerName: "Version" },
  { field: "counterPartyId", headerName: "Counter-Party Id" },
  { field: "bookId", headerName: "Book-Id" },
  { field: "maturityDate", headerName: "Maturity Date" },
  { field: "createdDate", headerName: "Created Date" },
  { field: "expired", headerName: "Expired" },
];

function App() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("/api/trades")
      .then((res) => res.json())
      .then((data) => setRows(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box sx={{ height: 600, width: "100%" }}>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 600,
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <DataGrid
          rows={rows.map((row, i) => ({
            ...row,
            id: `${row.tradeId}_${row.version}`,
          }))}
          columns={columns}
          initialState={{
            pagination: { paginationModel: { pageSize: 20 } },
          }}
          pageSizeOptions={[20, 50, 100]}
          disableRowSelectionOnClick
        />
      )}
    </Box>
  );
}

export default App;
