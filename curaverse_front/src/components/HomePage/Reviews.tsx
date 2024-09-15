import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Reviews.css";
import ReviewItem from "./ReviewItem";

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

const Reviews: React.FC = () => {
  const { doctor_id } = useParams<{ doctor_id: string }>();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [doctorName, setDoctorName] = useState<string | null>(null);

  const fetchReviews = async (doctor_id: number) => {
    try {
      const response = await fetch(`/api/doctors/${doctor_id}/reviews`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setReviews(data);
        if (data && data.length > 0) {
          setDoctorName(data[0].doctorName);
        } else {
          console.error("No reviews found or failed to fetch data.");
        }
      } else {
        const data = await response.json();
        if (data.message === "No reviews found for this doctor") {
          setError(data.message);
        }
        console.error("Error fetching reviews:", response.statusText);
        setError("Error fetching reviews");
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setError("Error fetching reviews");
    }
  };

  useEffect(() => {
    if (doctor_id) {
      fetchReviews(parseInt(doctor_id, 10));
    }
  }, [doctor_id]);

  return (
    <div>
      <h1>Doctor Reviews</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      {doctorName && <h2>Reviews for Dr. {doctorName}</h2>}
      {reviews.length === 0 && !error && <p>No reviews found.</p>}
      <ul>
        {reviews.map((review) => (
          <ReviewItem key={review.review_id} review={review} />
        ))}
      </ul>
    </div>
  );
};

export default Reviews;
