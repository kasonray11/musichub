import { useEffect, useState } from "react";
import { BACKEND_HTTP_URL } from "../config";
import type { HistoryItem } from "../types";

export function HistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    fetch(`${BACKEND_HTTP_URL}/history`)
      .then((response) => response.json())
      .then((data: HistoryItem[]) => {
        setItems(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load history:", err);
        setIsLoading(false);
      });
  }, []);

  function formatTime(isoString: string): string {
    return new Date(isoString).toLocaleString();
  }

  return (
    <div className="page-panel">
      <h2 className="page-title">History</h2>

      {isLoading ? (
        <p className="page-empty">Loading…</p>
      ) : items.length === 0 ? (
        <p className="page-empty">Nothing played yet.</p>
      ) : (
        <div className="scroll-list">

          {items.map((item) => (
            <div key={item.id} className="list-row">
              <div className="list-row__main">
                <span className="list-row__title">{item.track}</span>
                <span className="list-row__subtitle">{item.artist} — {item.album}</span>
              </div>
              <span className="list-row__meta">{formatTime(item.playedAt)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
