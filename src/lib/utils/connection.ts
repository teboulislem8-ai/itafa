import { useEffect, useState } from "react";

type ConnectionStatus = "online" | "slow" | "offline";

interface NavigatorWithConnection extends Navigator {
  connection?: {
    effectiveType: string;
    addEventListener: (type: string, listener: EventListener) => void;
    removeEventListener: (type: string, listener: EventListener) => void;
  };
}

export function useConnection() {
  const [status, setStatus] = useState<ConnectionStatus>("online");

  useEffect(() => {
    function update() {
      setStatus(navigator.onLine ? "online" : "offline");
    }

    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    update();

    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  return status;
}

export function useSlowConnection() {
  const [isSlow, setIsSlow] = useState(false);

  useEffect(() => {
    const nav = navigator as NavigatorWithConnection;
    if ("connection" in nav && nav.connection) {
      const conn = nav.connection;
      const update = () => setIsSlow(conn.effectiveType === "2g" || conn.effectiveType === "slow-2g");
      update();
      conn.addEventListener("change", update);
      return () => conn.removeEventListener("change", update);
    }
  }, []);

  return isSlow;
}
