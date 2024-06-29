import Snackbar from "@mui/material/Snackbar";

interface Props {
  open: boolean;
  onClose: () => void;
  message: string;
}

const SnackbarNotification = ({ open, onClose, message }: Props) => {
  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      open={open}
      autoHideDuration={1500}
      onClose={onClose}
      message={message}
    ></Snackbar>
  );
};

export default SnackbarNotification;
