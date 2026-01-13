import React, { useEffect, useState } from "react";
import { Card, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState();

  useEffect(() => {
    if (localStorage.getItem("user")) {
      const u = JSON.parse(localStorage.getItem("user"));
      setUser(u);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <>
      <Header />
      <Container className="mt-4" style={{ position: "relative", zIndex: "2 !important" }}>
        <Card style={{ background: "rgba(18,18,18,0.55)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 18 }}>
          <Card.Body style={{ color: "white" }}>
            <h3 style={{ fontWeight: 800 }}>Profile</h3>
            <div style={{ marginTop: 12, color: "rgba(255,255,255,0.75)" }}>
              <div><strong>Name:</strong> {user?.name || ""}</div>
              <div><strong>Email:</strong> {user?.email || ""}</div>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default Profile;
