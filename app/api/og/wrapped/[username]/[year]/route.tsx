/** @jsxImportSource react */
// Share cards render outside the MUI/Emotion tree, so use the plain React JSX runtime.
import { getYearInReview } from "@/data/stats";
import { og, renderCard } from "@/lib/og";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ username: string; year: string }> }
) {
  const { username, year } = await params;
  if (!/^\d{4}$/.test(year)) return new Response("Not found", { status: 404 });

  const wrapped = await getYearInReview(username, Number(year));
  if (!wrapped) return new Response("Not found", { status: 404 });

  const stats = [
    { value: wrapped.totalMeals, label: "meals cooked" },
    { value: wrapped.distinctRecipes, label: "recipes" },
    { value: wrapped.longestStreak, label: "day best streak" },
  ];

  return renderCard(
    <div
      style={{ display: "flex", flexDirection: "column", justifyContent: "center", width: "100%" }}
    >
      <div style={{ fontSize: 28, letterSpacing: 4, color: og.MUTED, textTransform: "uppercase" }}>
        {`${wrapped.user.username}'s year in the kitchen`}
      </div>
      <div style={{ fontFamily: "Serif", fontSize: 150, color: og.GOLD, lineHeight: 1 }}>
        {year}
      </div>
      <div style={{ display: "flex", gap: 72, marginTop: 36 }}>
        {stats.map((s) => (
          <div key={s.label} style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontFamily: "Serif", fontSize: 60 }}>{String(s.value)}</div>
            <div style={{ fontSize: 24, color: og.MUTED }}>{s.label}</div>
          </div>
        ))}
      </div>
      {wrapped.mostCooked && (
        <div style={{ fontSize: 28, color: og.MUTED, marginTop: 32 }}>
          {`Most cooked: ${wrapped.mostCooked.recipe.name}`}
        </div>
      )}
    </div>
  );
}
