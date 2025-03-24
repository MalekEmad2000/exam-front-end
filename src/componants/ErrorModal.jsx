import { useState,useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

function ErrorModal({errorMsg,isOpen, onClose }) {
  const [localIsOpen, setLocalIsOpen] = useState(isOpen);
//   console.log(errorMsg)
useEffect(()=>{
    if(!errorMsg){
        handleClose()
    }
})

  const handleClose = () => {
    setLocalIsOpen(false);
    onClose();
  };
  useEffect(() => {
    setLocalIsOpen(isOpen);
  }, [isOpen]);

  return (
    <Dialog open={localIsOpen} onClose={handleClose}>
      <DialogTitle>Error</DialogTitle>
      <DialogContent>
        <p>{errorMsg}</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>ok</Button>
      </DialogActions>
    </Dialog>
  );
}
export default ErrorModal;
