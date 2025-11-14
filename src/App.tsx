import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { useEffect, useState } from "react";
import type { TradeRow } from "./mockTrades";
import {
  formatDate,
  formatTradeId,
  getExpirationStatus,
} from "./utils/tradeHelpers";

const columns: GridColDef<TradeRow>[] = [
  {
    field: "tradeId",
    headerName: "Trade Id",
    valueFormatter: (value) => formatTradeId(value as string),
  },
  { field: "version", headerName: "Version" },
  { field: "counterPartyId", headerName: "Counter-Party Id", width: 200 },
  { field: "bookId", headerName: "Book-Id" },
  {
    field: "maturityDate",
    headerName: "Maturity Date",
    valueFormatter: (value) => formatDate(value as string),
    width: 200,
  },
  {
    field: "createdDate",
    headerName: "Created Date",
    valueFormatter: (value) => formatDate(value as string),
    width: 200,
  },
  {
    field: "expired",
    headerName: "Expired",
    valueGetter: (_, row) => getExpirationStatus(row.maturityDate),
    width: 200,
    renderCell: (params) => {
      const value = params.value as string;
      const isExpired = value === "Y";
      return (
        <Chip
          label={isExpired ? "Expired" : "Active"}
          color={isExpired ? "error" : "success"}
          size="small"
          variant={isExpired ? "filled" : "outlined"}
        />
      );
    },
  },
];

function App() {
  const [rows, setRows] = useState<TradeRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/trades")
      .then((res) => res.json())
      .then((data) => setRows(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box sx={{ height: "100vh", width: "100%" }}>
      <DataGrid
        rows={rows.map((row) => ({
          ...row,
          id: `${row.tradeId}_${row.version}`,
        }))}
        columns={columns}
        initialState={{
          pagination: { paginationModel: { pageSize: 100 } },
        }}
        pageSizeOptions={[20, 50, 100]}
        disableRowSelectionOnClick
        loading={loading}
        showToolbar
      />
    </Box>
  );
}

export default App;
