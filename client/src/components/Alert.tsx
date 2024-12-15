import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import "../styles/Alert.scss";
import { AlertType } from "../utils/alertType";

export interface AlertHandle {
  showAlert: (message: string, alertType: AlertType, timeout: number) => void;
}

// eslint-disable-next-line no-empty-pattern
const Alert = forwardRef<AlertHandle>(({}, ref) => {
  const [message, setMessage] = useState<string | undefined>();
  const [alertType, setAlertType] = useState<AlertType | undefined>();
  const timeoutRef = useRef<number | undefined>();

  const showAlert = (msg: string, type: AlertType, timeout: number = 2000) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setMessage(msg);
    setAlertType(type);

    timeoutRef.current = window.setTimeout(() => {
      setMessage(undefined);
      timeoutRef.current = undefined;
    }, timeout);
  };

  useImperativeHandle(ref, () => ({
    showAlert,
  }));

  return (
    <>
      {message && <div className={`alert alert-${alertType}`}>{message}</div>}
    </>
  );
});

export default Alert;
