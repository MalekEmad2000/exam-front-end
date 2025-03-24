import { useState,useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

function EmptyErrorModal({isOpen, onClose }) {
  const [localIsOpen, setLocalIsOpen] = useState(isOpen);
//   console.log(errorMsg)
useEffect(()=>{
    if(!isOpen){
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
      <DialogTitle>Data Fields cannot be empty</DialogTitle>
      {/* <DialogContent>
        <p>{errorMsg}</p>
      </DialogContent> */}
      <DialogActions>
        <Button onClick={handleClose}>ok</Button>
      </DialogActions>
    </Dialog>
  );
}
export default EmptyErrorModal;
