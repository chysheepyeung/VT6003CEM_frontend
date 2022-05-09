import * as React from 'react';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

export default function BasicAlerts(props) {
  return (
    <Stack sx={{ width: '100%' , marginTop: "100px"}} spacing={2}>
      <Alert variant="filled" severity={props.type || 'info'}>
        {props.children}
      </Alert>
    </Stack>
  );
}