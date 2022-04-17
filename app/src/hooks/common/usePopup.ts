import { useCallback, useEffect, useRef, useState } from "react";

interface Props {
  onClose?: () => void;
}

export default function usePopup({ onClose }: Props) {
  const [isClosed, setClosed] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      document.addEventListener("touchstart", handleClick, { passive: false });
    }

    return () => document.removeEventListener("touchstart", handleClick, false);
  }, []);

  const closePopup = useCallback(() => {
    onClose?.();
    setClosed(true);
  }, [onClose]);

  const handleClick = useCallback(
    (event: Event) => {
      if (!contentRef.current?.contains(event.target as Node)) {
        closePopup();
      }
      event.preventDefault();
    },
    [closePopup],
  );

  return {
    isClosed,
    contentRef,
    closePopup,
  };
}
