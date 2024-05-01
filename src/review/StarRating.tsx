import StarHalf from "@mui/icons-material/StarHalf";
import StarRate from "@mui/icons-material/StarRate";
import StarOutline from "@mui/icons-material/StarOutline";

interface Props {
  rating: number;
}

function StarRating({ rating }: Props) {
  function starValue() {
    if (rating === 5)
      return (
        <div>
          <StarRate />
          <StarRate />
          <StarRate />
          <StarRate />
          <StarRate />
        </div>
      );
    else if (rating > 4.4)
      return (
        <div>
          <StarRate />
          <StarRate />
          <StarRate />
          <StarRate />
          <StarHalf />
        </div>
      );
    else if (rating > 3.9)
      return (
        <div>
          <StarRate />
          <StarRate />
          <StarRate />
          <StarRate />
          <StarOutline />
        </div>
      );
    else if (rating > 3.4)
      return (
        <div>
          <StarRate />
          <StarRate />
          <StarRate />
          <StarHalf />
          <StarOutline />
        </div>
      );
    else if (rating > 2.9)
      return (
        <div>
          <StarRate />
          <StarRate />
          <StarRate />
          <StarOutline />
          <StarOutline />
        </div>
      );
    else if (rating > 2.4)
      return (
        <div>
          <StarRate />
          <StarRate />
          <StarHalf />
          <StarOutline />
          <StarOutline />
        </div>
      );
    else if (rating > 1.9)
      return (
        <div>
          <StarRate />
          <StarRate />
          <StarOutline />
          <StarOutline />
          <StarOutline />
        </div>
      );
    else if (rating > 1.4)
      return (
        <div>
          <StarRate />
          <StarHalf />
          <StarOutline />
          <StarOutline />
          <StarOutline />
        </div>
      );
    else if (rating > 0.9)
      return (
        <div>
          <StarRate />
          <StarOutline />
          <StarOutline />
          <StarOutline />
          <StarOutline />
        </div>
      );
    else if (rating > 0.4)
      return (
        <div>
          <StarHalf />
          <StarOutline />
          <StarOutline />
          <StarOutline />
          <StarOutline />
        </div>
      );
    else if (rating < 0.5)
      return (
        <div>
          <StarOutline />
          <StarOutline />
          <StarOutline />
          <StarOutline />
          <StarOutline />
        </div>
      );
  }
  return <div>{starValue()}</div>;
}

export default StarRating;
