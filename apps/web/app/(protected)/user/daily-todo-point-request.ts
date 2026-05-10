/**
 * Helper to submit daily completion bonus point request
 */

import { createPointsRequestAction } from "../../actions/points";

export async function submitDailyCompletionBonus(): Promise<void> {
  const formData = new FormData();
  formData.append("amount", "1");
  formData.append("description", "Виконав всі заплановані справи!");

  await createPointsRequestAction(formData);
}
