import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import styles from "./SnackbarNotification.module.css";

interface Props {
  open: boolean;
  onClose: () => void;
  message: string;
  autoHideDuration?: number;
  severity?: "default" | "info" | "success" | "warning" | "error";
}

const TRANSITION_MS = 200;

const SnackbarNotification = ({ open, onClose, message, autoHideDuration = 1500, severity = "default" }: Props) => {
  const [shouldRender, setShouldRender] = useState(open);
  const [isVisible, setIsVisible] = useState(false);
  const exitTimeoutRef = useRef<number | undefined>(undefined);
  const autoHideTimeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (open) {
      setShouldRender(true);
      const id = requestAnimationFrame(() => setIsVisible(true));

      return () => cancelAnimationFrame(id);
    }

    if (shouldRender) {
      setIsVisible(false);
      exitTimeoutRef.current = window.setTimeout(() => {
        setShouldRender(false);
      }, TRANSITION_MS);

      return () => {
        if (exitTimeoutRef.current) window.clearTimeout(exitTimeoutRef.current);
      };
    }
  }, [open, shouldRender]);

  const beginClose = useCallback(() => {
    setIsVisible(false);
    if (exitTimeoutRef.current) window.clearTimeout(exitTimeoutRef.current);
    exitTimeoutRef.current = window.setTimeout(() => {
      onClose();
    }, TRANSITION_MS);
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    autoHideTimeoutRef.current = window.setTimeout(() => {
      beginClose();
    }, autoHideDuration);

    return () => {
      if (autoHideTimeoutRef.current) window.clearTimeout(autoHideTimeoutRef.current);
    };
  }, [open, autoHideDuration, beginClose]);

  if (!open && !shouldRender) return null;

  const severityToClassName: Record<string, string> = {
    info: styles.info,
    success: styles.success,
    warning: styles.warning,
    error: styles.error,
    default: styles.default,
  };
  const severityClassName = severityToClassName[severity] ?? styles.default;

  return createPortal(
    <div className={styles.container}>
      <div
        role='status'
        aria-live='polite'
        className={`${styles.snackbar} ${severityClassName} ${isVisible ? styles.visible : styles.hidden}`}
        onClick={beginClose}
      >
        {message}
      </div>
    </div>,
    document.body,
  );
};

export default SnackbarNotification;
