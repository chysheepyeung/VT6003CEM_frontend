import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function LoadingBox() {
  return (
    <Box sx={{ display: 'flex', marginTop: "100px", justifyContent: "center" }}>
      <CircularProgress />
    </Box>
  );
}