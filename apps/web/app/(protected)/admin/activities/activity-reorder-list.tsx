"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { GripVertical, Pencil } from "lucide-react";

import { Button } from "@bonus-tracker/ui";
import { reorderActivitiesAction } from "../../../actions/activities";
import { DeleteActivityButton } from "./delete-activity-button";

type ActivityItem = {
  id: string;
  description: string;
  points: number;
  order: number;
};

type ActivityReorderListProps = {
  activities: ActivityItem[];
};

function moveItem(items: ActivityItem[], fromId: string, toId: string) {
  const fromIndex = items.findIndex((item) => item.id === fromId);
  const toIndex = items.findIndex((item) => item.id === toId);

  if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) {
    return items;
  }

  const next = [...items];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);

  return next;
}

export function ActivityReorderList({ activities }: ActivityReorderListProps) {
  const router = useRouter();
  const [items, setItems] = useState(activities);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleDrop = async (targetId: string) => {
    if (!draggedId || draggedId === targetId) {
      setDraggedId(null);
      return;
    }

    const reorderedItems = moveItem(items, draggedId, targetId);
    setItems(reorderedItems);
    setDraggedId(null);

    // Apply drag and drop instantly
    setIsSaving(true);
    try {
      await reorderActivitiesAction(reorderedItems.map((item) => item.id));
      router.refresh();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-2" data-testid="activity-reorder-list">
        {items.map((activity) => (
          <div
            key={activity.id}
            draggable={!isSaving}
            onDragStart={() => setDraggedId(activity.id)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => handleDrop(activity.id)}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3"
            data-testid={`activity-row-${activity.id}`}
          >
            <div className="flex min-w-0 items-center gap-3">
              <GripVertical className="h-5 w-5 shrink-0 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">{activity.points} очок</p>
                <p className="font-medium text-gray-900">{activity.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link href={`/admin/activities/${activity.id}/edit`}>
                <Button type="button" variant="outline" className="gap-2">
                  <Pencil className="h-4 w-4" />
                  Редагувати
                </Button>
              </Link>
              <DeleteActivityButton activityId={activity.id} description={activity.description} />
            </div>
          </div>
        ))}
    </div>
  );
}
