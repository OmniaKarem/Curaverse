import React, { useState } from "react";
import "./ReviewItem.css";

interface Review {
  review_id: number;
  rating: number;
  review: string;
  user: {
    name: string;
  };
  userName: string;
  doctor: {
    name: string;
  };
  agreeCount: number;
  disagreeCount: number;
}

interface ReviewProps {
  review: Review;
}

const ReviewItem: React.FC<ReviewProps> = ({ review }) => {
  const [agreeCount, setAgreeCount] = useState(review.agreeCount);
  const [disagreeCount, setDisagreeCount] = useState(review.disagreeCount);
  const [agreement, setAgreement] = useState<"Agree" | "Disagree" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAgreement = async (type: "Agree" | "Disagree") => {
    try {
      const response = await fetch(
        `/api/reviews/${review.review_id}/agreements`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ agreement_type: type }),
        }
      );

      if (response.ok) {
        const data = await response.json();

        if (data.agreement_type !== agreement) {
          if (data.agreement_type === "Agree") {
            setAgreeCount((prev) => prev + 1);
            if (agreement === "Disagree") setDisagreeCount((prev) => prev - 1);
          } else if (data.agreement_type === "Disagree") {
            setDisagreeCount((prev) => prev + 1);
            if (agreement === "Agree") setAgreeCount((prev) => prev - 1);
          }

          setAgreement(data.agreement_type);
        }
      } else {
        const errorData = await response.text();
        setError(`Error: ${errorData}`);
      }
    } catch (err) {
      console.error("Error submitting agreement:", err);
      setError("Error submitting agreement.");
    }
  };

  return (
    <li key={review.review_id} className="item">
      <strong>{review.userName}</strong>: {review.review} (Rating:{" "}
      {review.rating})
      <div>
        <button
          onClick={() => handleAgreement("Agree")}
          disabled={agreement === "Agree"}
          className="agree-button"
        >
          Agree ({agreeCount})
        </button>
        <button
          onClick={() => handleAgreement("Disagree")}
          disabled={agreement === "Disagree"}
          className="disagree-button"
        >
          Disagree ({disagreeCount})
        </button>
        {error && <p>{error}</p>}
      </div>
    </li>
  );
};

export default ReviewItem;
