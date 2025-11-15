import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  TextField,
  MenuItem,
  Alert,
} from "@mui/material";
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { BOOK_OPTIONS, COUNTER_PARTY_OPTIONS } from "../constants";
import { isValidMaturityDate } from "../utils/tradeHelpers";

const tradeSchema = z.object({
  tradeId: z.number().int().positive("Trade Id must be positive"),
  version: z.number().int().positive("Version must be positive"),
  counterPartyId: z.enum(COUNTER_PARTY_OPTIONS),
  bookId: z.enum(BOOK_OPTIONS),
  maturityDate: z
    .string()
    .nonempty("Maturity Date is required")
    .refine(isValidMaturityDate, {
      message: "Maturity Date cannot be earlier than today",
    }),
});

export type TradeFormValues = z.infer<typeof tradeSchema>;

const defaultValues: TradeFormValues = {
  tradeId: 0,
  version: 1,
  counterPartyId: COUNTER_PARTY_OPTIONS[0],
  bookId: BOOK_OPTIONS[0],
  maturityDate: new Date().toISOString().slice(0, 10),
};

type TradeFormDialogProps = {
  open: boolean;
  initialValues?: TradeFormValues;
  onClose: () => void;
  onSubmit: (values: TradeFormValues) => void;
  generalError?: string;
};

const TradeFormDialog = ({
  open,
  initialValues,
  onClose,
  onSubmit,
  generalError,
}: TradeFormDialogProps) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TradeFormValues>({
    resolver: zodResolver(tradeSchema),
    defaultValues: initialValues ?? defaultValues,
  });

  useEffect(() => {
    if (open) {
      reset(initialValues ?? defaultValues);
    }
  }, [open, initialValues, reset]);

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>{initialValues ? "Edit Trade" : "Create Trade"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {generalError && <Alert severity="error">{generalError}</Alert>}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Controller
              name="tradeId"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  value={field.value ?? ""}
                  onChange={(event) => {
                    const value = event.target.value;
                    field.onChange(value === "" ? undefined : Number(value));
                  }}
                  label="Trade Id"
                  type="number"
                  fullWidth
                  error={Boolean(errors.tradeId)}
                  helperText={errors.tradeId?.message}
                />
              )}
            />
            <Controller
              name="version"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  value={field.value ?? ""}
                  onChange={(event) => {
                    const value = event.target.value;
                    field.onChange(value === "" ? undefined : Number(value));
                  }}
                  label="Version"
                  type="number"
                  fullWidth
                  error={Boolean(errors.version)}
                  helperText={errors.version?.message}
                />
              )}
            />
          </Stack>

          <Controller
            name="counterPartyId"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="Counter Party"
                fullWidth
                error={Boolean(errors.counterPartyId)}
                helperText={errors.counterPartyId?.message}
              >
                {COUNTER_PARTY_OPTIONS.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          <Controller
            name="bookId"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="Book Id"
                fullWidth
                error={Boolean(errors.bookId)}
                helperText={errors.bookId?.message}
              >
                {BOOK_OPTIONS.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          <Controller
            name="maturityDate"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="date"
                label="Maturity Date"
                InputLabelProps={{ shrink: true }}
                fullWidth
                error={Boolean(errors.maturityDate)}
                helperText={errors.maturityDate?.message}
              />
            )}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          variant="contained"
          disabled={isSubmitting}
        >
          {initialValues ? "Save" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TradeFormDialog;
