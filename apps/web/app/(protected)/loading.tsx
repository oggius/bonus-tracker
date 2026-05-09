import { LoadingSpinner } from "../components/loading-spinner";

export default function ProtectedLoading() {
  return (
    <div className="app-splash" role="status" aria-live="polite" aria-label="Завантаження даних">
      <div className="app-splash__panel">
        <div className="app-splash__logo">BonusTracker</div>
        <div className="app-splash__loader">
          <LoadingSpinner className="h-5 w-5" />
          <span>Оновлюємо дані...</span>
        </div>
      </div>
    </div>
  );
}
