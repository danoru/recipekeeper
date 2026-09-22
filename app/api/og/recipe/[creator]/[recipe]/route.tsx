/** @jsxImportSource react */
// Share cards render outside the MUI/Emotion tree, so use the plain React JSX runtime.
import { getRecipeBySlug } from "@/data/recipes";
import { imageDataUrl, og, renderCard } from "@/lib/og";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ creator: string; recipe: string }> }
) {
  const { creator, recipe: recipeSlug } = await params;
  const recipe = await getRecipeBySlug(creator, recipeSlug);
  if (!recipe) return new Response("Not found", { status: 404 });

  const ratings = recipe.reviews.map((r) => r.rating.toNumber());
  const average = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : null;
  const image = await imageDataUrl(recipe.image);

  return renderCard(
    <div style={{ display: "flex", gap: 56, alignItems: "center", width: "100%" }}>
      {image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          alt=""
          height={420}
          src={image}
          style={{ borderRadius: 24, objectFit: "cover" }}
          width={336}
        />
      )}
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <div style={{ fontSize: 26, letterSpacing: 4, color: og.GOLD, textTransform: "uppercase" }}>
          {recipe.creators.name}
        </div>
        <div style={{ fontFamily: "Serif", fontSize: 68, lineHeight: 1.1, marginTop: 16 }}>
          {recipe.name}
        </div>
        {average !== null && (
          <div style={{ fontSize: 30, color: og.MUTED, marginTop: 28 }}>
            {`★ ${average.toFixed(1)} · ${ratings.length} ${ratings.length === 1 ? "review" : "reviews"}`}
          </div>
        )}
      </div>
    </div>
  );
}
