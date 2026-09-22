import type { GetServerSidePropsContext } from "next";

import { getSessionFromContext } from "@/lib/auth";

// Legacy route: the activity stream lives at /[username]/activity.
export default function ActivityRedirect() {
  return null;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSessionFromContext(context);
  const destination = session ? `/${session.user.username}/activity` : "/login";
  return { redirect: { destination, permanent: false } };
}
