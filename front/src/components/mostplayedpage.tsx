import { useEffect, useState } from "react";
import { BACKEND_HTTP_URL } from "../config";
import type { MostPlayedItem } from "../types";

export function MostPlayedPage() {
  const [items, setItems] = useState<MostPlayedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${BACKEND_HTTP_URL}/stats/most-played`)
      .then((response) => response.json())
      .then((data: MostPlayedItem[]) => {
        setItems(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load most-played stats:", err);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="page-panel">
      <h2 className="page-title">Most Played</h2>

      {isLoading ? (
        <p className="page-empty">Loading…</p>
      ) : items.length === 0 ? (
        <p className="page-empty">Nothing played yet.</p>
      ) : (
        <div className="scroll-list">
          {items.map((item, index) => (
            <div key={`${item.track}-${item.artist}`} className="list-row">
              <span className="list-row__rank">{index + 1}</span>
              <div className="list-row__main">
                <span className="list-row__title">{item.track}</span>
                <span className="list-row__subtitle">{item.artist}</span>
              </div>
              <span className="list-row__meta">{item.playCount}×</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
