import Box from "@mui/material/Box";
import MuiLink from "@mui/material/Link";
import NextLink from "next/link";
import Typography from "@mui/material/Typography";
import UserAvatar from "../users/UserAvatar";
import StarRating from "../ui/StarRating";
import type { SReviewWithUser } from "../../types/serialized";

interface Props {
  reviews: SReviewWithUser[];
}

export default function RecipeFriendRatings({ reviews }: Props) {
  if (!reviews?.length) return null;

  return (
    <Box>
      <Typography
        sx={{
          fontSize: "0.625rem",
          fontWeight: 500,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "#4a4744",
          mb: 1.5,
          pb: 1,
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        Activity from friends
      </Typography>
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        {reviews.map((review, i) => (
          <Box
            key={i}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            <MuiLink
              component={NextLink}
              href={`/${review.users.username}`}
              underline="none"
            >
              <UserAvatar avatarSize="32px" name={review.users.username} />
            </MuiLink>
            <StarRating rating={review.rating} size="sm" />
            {review.comment && (
              <Typography
                sx={{
                  fontSize: "0.6875rem",
                  color: "text.secondary",
                  maxWidth: "120px",
                  textAlign: "center",
                  lineHeight: 1.4,
                }}
              >
                {review.comment}
              </Typography>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
