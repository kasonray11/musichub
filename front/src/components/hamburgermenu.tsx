import { useState } from "react";
import type { Page } from "../types";

interface HamburgerMenuProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const PAGE_LABELS: Record<Page, string> = {
  "now-playing": "Now Playing",
  history: "History",
  "most-played": "Most Played",
};

export function HamburgerMenu({ currentPage, onNavigate }: HamburgerMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  function handleSelect(page: Page) {
    onNavigate(page);
    setIsOpen(false); 
  }

  return (
    <div className="hamburger-wrap">
      <button
        type="button"
        className="hamburger-button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label="Menu"
        aria-expanded={isOpen}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {isOpen && (
        <div className="hamburger-menu">
          {(Object.keys(PAGE_LABELS) as Page[]).map((page) => (
            <button
              key={page}
              type="button"
              className={`hamburger-menu__item ${page === currentPage ? "hamburger-menu__item--active" : ""}`}
              onClick={() => handleSelect(page)}
            >
              {PAGE_LABELS[page]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
