import { useState,useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

function SimpleModal({submitHandler,data,isOpen, onClose,passwordLogin }) {
  const [localIsOpen, setLocalIsOpen] = useState(isOpen);
//   console.log(data)

  const handleClose = () => {
    setLocalIsOpen(false);
    onClose();
  };
  useEffect(() => {
    setLocalIsOpen(isOpen);
  }, [isOpen]);

  function handleJoin() {
    // event.preventDefault();


    // document.getElementById("join-form").submit();
    submitHandler();
  }


  return (
    <Dialog open={localIsOpen} onClose={handleClose}>
      <DialogTitle>Please Verify Your Data Entry</DialogTitle>
      <DialogContent>
        <p>Name :<b> {data.name}</b> </p>
        {!passwordLogin?(<>
                  <p>Email : <b> {data.email}</b></p>
                  <p>National ID : <b> {data.nat_id}</b></p>
                  </>




        ):null}
        <p>University ID : <b> {data.univ_id}</b></p>



      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button form="join-form" type='submit' onClick={handleJoin} autoFocus>
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}
export default SimpleModal;
