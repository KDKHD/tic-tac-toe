import Snackbar from '@material-ui/core/Snackbar';
import React, { Component } from 'react';

function SnackBarComponent({open, message}) {
    <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={open}
        autoHideDuration={6000}
        onClose={()=>{}}
        message={"message"}
      />
}

export default SnackBarComponent;