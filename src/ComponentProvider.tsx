import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { ReactNode } from 'react';

const theme = createTheme({
  // Add your custom MUI theme options here if needed
});

export const ComponentProvider = ({ children }: { children: ReactNode }) => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    {children}
  </ThemeProvider>
);

export default ComponentProvider;
