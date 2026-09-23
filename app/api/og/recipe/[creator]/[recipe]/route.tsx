/** @jsxImportSource react */
// Share cards render outside the MUI/Emotion tree, so use the plain React JSX runtime.
import { getRecipeBySlug } from "@/data/recipes";
import { getRecipeScoreDetail } from "@/data/scores";
import { imageDataUrl, og, renderCard } from "@/lib/og";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ creator: string; recipe: string }> }
) {
  const { creator, recipe: recipeSlug } = await params;
  const recipe = await getRecipeBySlug(creator, recipeSlug);
  if (!recipe) return new Response("Not found", { status: 404 });

  const [{ score, count }, image] = await Promise.all([
    getRecipeScoreDetail(recipe.id),
    imageDataUrl(recipe.image),
  ]);

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
        {score !== null && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontSize: 30,
              color: og.MUTED,
              marginTop: 28,
            }}
          >
            {/* An SVG star: the "★" glyph isn't in the card's fonts. */}
            <svg height="28" viewBox="0 0 24 24" width="28">
              <path
                d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7L12 17.3 5.8 20.9l1.6-7L2 9.2l7.1-.6z"
                fill={og.GOLD}
              />
            </svg>
            {`${score.toFixed(1)} · ${count} ${count === 1 ? "rating" : "ratings"}`}
          </div>
        )}
      </div>
    </div>
  );
}
