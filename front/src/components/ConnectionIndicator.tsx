import type { ConnectionStatus } from "../types";

interface ConnectionIndicatorProps {
  status: ConnectionStatus;
}

const STATUS_LABEL: Record<ConnectionStatus, string> = {
  connecting: "CONNECTING",
  connected: "SIGNAL",
  disconnected: "NO SIGNAL",
};

export function ConnectionIndicator({ status }: ConnectionIndicatorProps) {
  return (
    <div className="connection-indicator">
      <span className={`indicator-dot indicator-dot--${status}`} />
      <span className="indicator-label">{STATUS_LABEL[status]}</span>
    </div>
  );
}
