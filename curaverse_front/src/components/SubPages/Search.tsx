import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Search.css";

function Search({
  placeholder,
  onSearch,
}: {
  placeholder: string;
  onSearch: (term: string) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <nav className="navbar navbar-light bg-light">
      <form className="form-inline" onSubmit={handleSubmit}>
        <input
          className="form-control mr-sm-2"
          type="search"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleSearchChange}
          aria-label="Search"
        />
        <button className="btn btn-outline-success my-2 my-sm-0" type="submit">
          Search
        </button>
      </form>
    </nav>
  );
}

export default Search;
