import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { usePathname } from "next/navigation";

interface Props {
  username: string;
}

const NAV_LINKS = [
  { label: "Profile", path: "" },
  { label: "Activity", path: "/activity" },
  { label: "Recipes", path: "/recipes" },
  { label: "Diary", path: "/recipes/diary" },
  { label: "Reviews", path: "/recipes/reviews" },
  { label: "Cooklist", path: "/cooklist" },
  { label: "Likes", path: "/likes" },
  { label: "Network", path: "/following" },
];

function ProfileLinkBar({ username }: Props) {
  const pathname = usePathname();

  // Derive active tab from current URL
  const base = `/${username}`;
  const activePath = pathname?.replace(base, "") ?? "";
  const activeIndex = NAV_LINKS.findIndex((l) => l.path === activePath);
  const currentTab = activeIndex === -1 ? 0 : activeIndex;

  return (
    <Box
      sx={{
        borderBottom: 1,
        borderColor: "divider",
        mb: 3,
      }}
    >
      <Tabs
        allowScrollButtonsMobile
        scrollButtons="auto"
        sx={{
          minHeight: 40,
          "& .MuiTab-root": {
            minHeight: 40,
            fontSize: "0.75rem",
            letterSpacing: "0.1em",
            fontWeight: 500,
            color: "text.disabled",
            px: 2,
          },
          "& .Mui-selected": {
            color: "text.primary !important",
          },
          "& .MuiTabs-indicator": {
            backgroundColor: "primary.main",
            height: 1.5,
          },
        }}
        value={currentTab}
        variant="scrollable"
      >
        {NAV_LINKS.map(({ label, path }) => (
          <Tab key={path} component="a" href={`${base}${path}`} label={label} />
        ))}
      </Tabs>
    </Box>
  );
}

export default ProfileLinkBar;
