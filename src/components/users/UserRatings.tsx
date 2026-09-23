import Box from "@mui/material/Box";

import RatingHistogram from "@/components/ui/RatingHistogram";

import SectionHeader from "./SectionHeader";

interface Props {
  /** The user's score for each recipe they've rated. */
  scores: number[];
}

export default function UserRatings({ scores }: Props) {
  if (scores.length === 0) return null;
  return (
    <Box>
      <SectionHeader title="Ratings" />
      <RatingHistogram scores={scores} />
    </Box>
  );
}
