import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { get } from "../api";

export default function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    const verify = async () => {
      try {
        const data = await get(`/api/auth/verify-email/${token}`);
        setStatus("success");
        setMessage(data.message || "Email verified successfully.");
      } catch (error) {
        setStatus("error");
        setMessage(error.message || "Email verification failed.");
      }
    };

    verify();
  }, [token]);

  return (
    <section className="auth-page">
      <h1>Email Verification</h1>
      <p className={status === "error" ? "error" : ""}>{message}</p>
      {status !== "loading" && (
        <Link to="/login" className="button">
          Go to Login
        </Link>
      )}
    </section>
  );
}
