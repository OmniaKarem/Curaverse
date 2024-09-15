import React, { useState, useCallback } from "react";
import "./Reviews.css";

type ReviewProps = {
  doctorId: number;
};

type Review = {
  rating: number;
  review: string;
};

function Reviews({ doctorId }: ReviewProps) {
  const [newReview, setNewReview] = useState<Review>({
    rating: 0,
    review: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewReview({
      ...newReview,
      [name]: name === "rating" ? Number(value) : value,
    });
  };

  const addReview = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const response = await fetch(
          `http://localhost:3000/api/doctors/${doctorId}/reviews`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newReview),
          }
        );
        window.alert("Review added successfully!");
        if (response.ok) {
          const addedReview = await response.json();
          setNewReview({ rating: 0, review: "" });
          console.log("Added review: ", addedReview);
        } else {
          console.error("Error adding review:", response.statusText);
        }
      } catch (error) {
        console.error("Error adding review: ", error);
      }
    },
    [doctorId, newReview]
  );

  return (
    <form onSubmit={addReview} className="review-form">
      <input
        className="rating"
        type="number"
        name="rating"
        min={1}
        max={5}
        value={newReview.rating}
        onChange={handleInputChange}
        placeholder="Rating"
      />
      <input
        className="review"
        type="text"
        name="review"
        value={newReview.review}
        onChange={handleInputChange}
        placeholder="Review"
      />
      <button type="submit" className="submit-btn">
        Review
      </button>
    </form>
  );
}

export default Reviews;
