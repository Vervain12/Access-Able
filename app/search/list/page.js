"use client";
import { useState, useEffect, Suspense } from "react";
import LocationSelect from "../../components/location-select";
import DisabilityChoice from "../../components/disability-choice";
import { useSearchParams } from "next/navigation";
import Header from "../../components/header";
import SearchControls from "../search-controls";
import GetPosition from "../get-position";
import { Pagination, Stack, CircularProgress } from "@mui/material";

// Separate component to avoid error (Added a suspense boundary)
function SearchContent() {
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState(sessionStorage.getItem("query") || "");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 20;
  const searchParams = useSearchParams();
  const fromConfirm = searchParams.get("fromConfirm");

  GetPosition(setQuery, setResults, setLatitude, setLongitude);

  const filteredResults = results.filter(
    (place) => place.tags && place.tags.name
  );
  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);

  const paginatedResults = filteredResults.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      <Header />
      {/*Refreshing should remove fromconfirm somehow*/}
      {fromConfirm && <DisabilityChoice />}
      <div style={{ background: "#f5f5f5", minHeight: "100vh", padding: 20 }}>
        <div
          style={{
            width: 400,
            margin: "0 auto",
            background: "white",
            padding: 16,
            borderRadius: 8,
            borderBottom: "5px solid #D0D0D0",
          }}
        >
          <div style={{ display: "flex", gap: 20 }}>
            <SearchControls
              initialQuery={query}
              setResults={setResults}
              setLatitude={setLatitude}
              setLongitude={setLongitude}
              setLoading={setLoading}
            />
          </div>
        </div>
        <div style={{ width: "90%", margin: "30px auto", color: "black" }}>
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", marginTop: 40 }}>
              <CircularProgress />
            </div>
          ) : (
            paginatedResults.map((item) => (
              <LocationSelect
                key={item.id}
                name={item.tags?.name || "Unnamed Place"}
                id={item.id}
                item={item}
                distance={item.distance}
              />
            ))
          )}
        </div>

        {filteredResults.length > itemsPerPage && (
          <Stack alignItems="center" sx={{ mt: 4 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </Stack>
        )}
      </div>
    </div>
  );
}

// Loading fallback component
function SearchLoading() {
  return (
    <div style={{ background: "#f5f5f5", minHeight: "100vh", padding: 20 }}>
      <div
        style={{
          width: 400,
          margin: "0 auto",
          background: "white",
          padding: 16,
          borderRadius: 8,
          borderBottom: "5px solid #D0D0D0",
          textAlign: "center",
          color: "black",
        }}
      >
        Loading search...
      </div>
    </div>
  );
}

export default function Search() {
  return (
    <Suspense fallback={<SearchLoading />}>
      <SearchContent />
    </Suspense>
  );
}
