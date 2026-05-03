import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@bonus-tracker/ui";

export default function HomePage() {
  return (
    <main className="container py-12">
      <Card className="p-8 shadow-sm">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-3xl">BonusTracker</CardTitle>
          <CardDescription className="mt-3 leading-relaxed">
            Next.js App Router scaffold is ready. Shared style tokens and UI
            primitives now come from packages/ui.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <p className="text-muted-foreground text-sm">Proceed to Task 6 →</p>
        </CardContent>
      </Card>
    </main>
  );
}
