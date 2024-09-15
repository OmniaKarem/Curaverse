import Search from "./Search";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Doctors,
  Diagnoses,
  Appointments,
  AppointmentsReminder,
  Medications,
  MedicationsReminder,
} from "./Cards";
import "bootstrap/dist/css/bootstrap.min.css";
import "./HomePage.css";

function HomePage() {
  type DoctorReview = {
    user_id: number;
    rating: number;
    review: string;
  };

  type Doctor = {
    doctor_id: number;
    name: string;
    speciality: string;
    contact_info: string;
    doctor_reviews: DoctorReview[];
  };

  const [searchResults, setSearchResults] = useState<Doctor[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const searchDoctors = async (searchTerm: string) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/search?search=${encodeURIComponent(
          searchTerm
        )}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
        setIsSearching(true);
      } else {
        console.error("Error searching doctors:", response.statusText);
      }
    } catch (error) {
      console.error("Error searching doctors:", error);
    }
  };

  const handleSearch = (term: string) => {
    searchDoctors(term);
  };

  return (
    <div className="home-page">
      <div className="home-page-content">
        <div className="home-page-header">
          <Search placeholder="Search Any Doctor" onSearch={handleSearch} />
        </div>

        {isSearching && searchResults.length > 0 && (
          <div>
            <div className="alert alert-success" role="alert">
              {searchResults.length} doctors found!
            </div>
            <ul className="list-group">
              {searchResults.map((doctor) => {
                const averageRating =
                  doctor.doctor_reviews.reduce(
                    (acc: number, review: { rating: number }) =>
                      acc + review.rating,
                    0
                  ) / (doctor.doctor_reviews.length || 1);

                return (
                  <li key={doctor.doctor_id} className="list-group-item">
                    <strong>{doctor.name}</strong>
                    Average Rating: {averageRating.toFixed(1)}
                    <div>
                      <strong>Specialty: </strong>
                      {doctor.speciality}
                    </div>
                    <div>
                      <strong>Contact: </strong>
                      {doctor.contact_info || "No Contact Info!"}
                    </div>
                    <Link
                      to={`/reviews/${doctor.doctor_id}`}
                      className="reviews"
                    >
                      Reviews
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {isSearching && searchResults.length === 0 && (
          <div className="alert alert-warning" role="alert">
            No doctors found!
          </div>
        )}
        <div className="home-page-cards">
          <Doctors />
          <Diagnoses />
          <Appointments />
          <AppointmentsReminder />
          <Medications />
          <MedicationsReminder />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
