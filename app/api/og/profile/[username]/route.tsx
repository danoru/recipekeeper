/** @jsxImportSource react */
// Share cards render outside the MUI/Emotion tree, so use the plain React JSX runtime.
import prisma from "@/data/db";
import { og, renderCard } from "@/lib/og";

export async function GET(_req: Request, { params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const user = await prisma.users.findUnique({
    where: { username },
    select: {
      username: true,
      firstName: true,
      lastName: true,
      bio: true,
      _count: { select: { diaryEntries: true, following: true } },
    },
  });
  if (!user) return new Response("Not found", { status: 404 });

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ");
  const stats = [
    { value: user._count.diaryEntries, label: "meals cooked" },
    { value: user._count.following, label: "following" },
  ];

  return renderCard(
    <div
      style={{ display: "flex", flexDirection: "column", justifyContent: "center", width: "100%" }}
    >
      <div style={{ fontFamily: "Serif", fontSize: 84 }}>{user.username}</div>
      {fullName && fullName !== user.username && (
        <div style={{ fontSize: 32, color: og.MUTED, marginTop: 8 }}>{fullName}</div>
      )}
      <div style={{ display: "flex", gap: 72, marginTop: 48 }}>
        {stats.map((s) => (
          <div key={s.label} style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontFamily: "Serif", fontSize: 64, color: og.GOLD }}>
              {String(s.value)}
            </div>
            <div style={{ fontSize: 26, color: og.MUTED }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
