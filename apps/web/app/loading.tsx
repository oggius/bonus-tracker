import { LoadingSpinner } from "./components/loading-spinner";

export default function Loading() {
  return (
    <div className="app-splash" role="status" aria-live="polite" aria-label="Завантаження застосунку">
      <div className="app-splash__panel">
        <div className="app-splash__logo">BonusTracker</div>
        <div className="app-splash__loader">
          <LoadingSpinner className="h-5 w-5" />
          <span>Завантаження...</span>
        </div>
      </div>
    </div>
  );
}
