import React, { useState, useEffect } from "react";

function App() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [urls, setUrls] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/")
      .then((res) => res.json())
      .then((data) => setUrls(data))
      .catch(() => setUrls([]));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setShortUrl("");
    if (!originalUrl) {
      setError("Please enter a URL.");
      return;
    }
    try {
      const res = await fetch("/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ originalUrl }),
      });
      const data = await res.json();
      if (res.ok) {
        setShortUrl(data.shortUrl);
        setUrls((prev) => [...prev, { originalUrl, shortCode: data.shortUrl.split("/").pop() }]);
        setOriginalUrl("");
      } else {
        setError(data.error || "Error shortening URL");
      }
    } catch {
      setError("Server error");
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h2>URL Shortener</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="url"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          placeholder="Enter URL"
          required
          style={{ width: "70%", padding: "0.5rem" }}
        />
        <button type="submit" style={{ padding: "0.5rem 1rem", marginLeft: 8 }}>
          Shorten
        </button>
      </form>
      {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
      {shortUrl && (
        <div style={{ marginTop: 16 }}>
          <strong>Short URL:</strong>{" "}
          <a href={shortUrl} target="_blank" rel="noopener noreferrer">
            {shortUrl}
          </a>
        </div>
      )}
      <h3 style={{ marginTop: 32 }}>All Shortened URLs</h3>
      <ul>
        {urls.map((u, i) => (
          <li key={i}>
            <a href={u.originalUrl} target="_blank" rel="noopener noreferrer">
              {u.originalUrl}
            </a>{" "}
            &rarr;{" "}
            <a
              href={`/${u.shortCode}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {window.location.origin}/{u.shortCode}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;