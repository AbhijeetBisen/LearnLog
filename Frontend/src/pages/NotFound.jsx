import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="page-center">
      <div className="card notfound-card">
        <h1>Page not found</h1>
        <p>The page you're looking for isn't available.</p>
        <Link to="/">Go back home</Link>
      </div>
    </section>
  );
}
