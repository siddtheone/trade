import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import { useCallback, useEffect, useMemo, useState } from "react";
import TradeFormDialog, {
  type TradeFormValues,
} from "./components/TradeFormDialog";
import type { TradeRow } from "./mockTrades";
import {
  formatDate,
  formatTradeId,
  getExpirationStatus,
  sortTrades,
  toISODateString,
} from "./utils/tradeHelpers";

const createColumns = (
  onEdit: (trade: TradeRow) => void
): GridColDef<TradeRow>[] => [
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
    width: 160,
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
  {
    field: "actions",
    headerName: "Actions",
    width: 140,
    sortable: false,
    filterable: false,
    renderCell: (params) => (
      <Button size="small" onClick={() => onEdit(params.row)}>
        Edit
      </Button>
    ),
  },
];

function App() {
  const [rows, setRows] = useState<TradeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [formInitialValues, setFormInitialValues] =
    useState<TradeFormValues | null>(null);
  const [generalError, setGeneralError] = useState("");
  const [pendingTrade, setPendingTrade] = useState<TradeRow | null>(null);

  useEffect(() => {
    fetch("/api/trades")
      .then((res) => res.json())
      .then((data) => setRows(sortTrades(data)))
      .finally(() => setLoading(false));
  }, []);

  const upsertTrade = useCallback((trade: TradeRow) => {
    setRows((prev) =>
      sortTrades([
        ...prev.filter(
          (row) =>
            !(row.tradeId === trade.tradeId && row.version === trade.version)
        ),
        trade,
      ])
    );
  }, []);

  const closeForm = () => {
    setFormOpen(false);
    setFormInitialValues(null);
    setGeneralError("");
  };

  const handleCreateClick = () => {
    setFormInitialValues(null);
    setFormOpen(true);
    setGeneralError("");
  };

  const handleEditClick = useCallback((trade: TradeRow) => {
    setFormInitialValues({
      tradeId: trade.tradeId,
      version: trade.version,
      counterPartyId: trade.counterPartyId,
      bookId: trade.bookId,
      maturityDate: trade.maturityDate.slice(0, 10),
    });
    setFormOpen(true);
    setGeneralError("");
  }, []);

  const columns = useMemo(
    () => createColumns(handleEditClick),
    [handleEditClick]
  );

  const handleConfirmReplacement = () => {
    if (pendingTrade) {
      upsertTrade(pendingTrade);
      setPendingTrade(null);
      closeForm();
    }
  };

  const handleCancelReplacement = () => {
    setPendingTrade(null);
  };

  const handleTradeSubmit = (values: TradeFormValues) => {
    setGeneralError("");
    const newTrade: TradeRow = {
      tradeId: values.tradeId,
      version: values.version,
      counterPartyId: values.counterPartyId,
      bookId: values.bookId,
      maturityDate: toISODateString(values.maturityDate),
      createdDate:
        rows.find(
          (row) =>
            row.tradeId === values.tradeId && row.version === values.version
        )?.createdDate ?? new Date().toISOString(),
    };

    const relatedTrades = rows.filter(
      (trade) => trade.tradeId === newTrade.tradeId
    );

    if (relatedTrades.length > 0) {
      const maxVersion = Math.max(
        ...relatedTrades.map((trade) => trade.version)
      );
      if (newTrade.version < maxVersion) {
        setGeneralError(
          `Version must be greater than or equal to ${maxVersion} for Trade Id ${newTrade.tradeId}.`
        );
        return;
      }

      const matchingVersion = relatedTrades.find(
        (trade) => trade.version === newTrade.version
      );
      if (matchingVersion) {
        setPendingTrade(newTrade);
        return;
      }
    }

    upsertTrade(newTrade);
    closeForm();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems={{ xs: "stretch", sm: "center" }}
        justifyContent="space-between"
        mb={2}
      >
        <Box component="span" sx={{ fontSize: 24, fontWeight: 600 }}>
          Trades
        </Box>
        <Button variant="contained" onClick={handleCreateClick}>
          Create Trade
        </Button>
      </Stack>

      <Box sx={{ height: "75vh", width: "100%" }}>
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
        />
      </Box>

      <TradeFormDialog
        open={formOpen}
        onClose={closeForm}
        onSubmit={handleTradeSubmit}
        initialValues={formInitialValues ?? undefined}
        generalError={generalError}
      />

      <Dialog open={Boolean(pendingTrade)} onClose={handleCancelReplacement}>
        <DialogTitle>Replace Existing Trade</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Trade {pendingTrade?.tradeId} version {pendingTrade?.version}{" "}
            already exists. Replace it?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelReplacement}>Cancel</Button>
          <Button
            onClick={handleConfirmReplacement}
            variant="contained"
            color="primary"
          >
            Replace
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default App;
