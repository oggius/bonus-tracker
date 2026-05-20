import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";

import { PushToggle } from "../../app/(protected)/admin/settings/push-toggle";

describe("PushToggle", () => {
  it("shows the unsupported-browser message when service workers are not available", async () => {
    // happy-dom does not implement navigator.serviceWorker, so the component's
    // feature-detection takes the unsupported path on mount.
    render(<PushToggle vapidPublicKey="any-key" />);

    await waitFor(() => {
      expect(
        screen.getByText(/Браузер не підтримує push-сповіщення/)
      ).toBeTruthy();
    });
  });
});
