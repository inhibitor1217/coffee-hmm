import { useCallback, useState } from "react";

interface Props {
  onClose?: () => void;
}

export default function useBanner({ onClose }: Props) {
  const [isClosed, setClosed] = useState(false);

  const closeBanner = useCallback(() => {
    onClose?.();
    setClosed(true);
  }, [onClose]);

  return {
    isClosed,
    closeBanner,
  };
}
