import React, { useEffect, useMemo, useState } from "react";
import { Button, Card, Col, Container, Row, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import "./dashboard.css";
import axios from "axios";
import moment from "moment";
import { getTransactions } from "../../utils/ApiRequest";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (localStorage.getItem("user")) {
      const u = JSON.parse(localStorage.getItem("user"));
      if (u.isAvatarImageSet === false || u.avatarImage === "") {
        navigate("/setAvatar");
        return;
      }
      setUser(u);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchRecent = async () => {
      if (!user?._id) return;
      try {
        setLoading(true);
        const { data } = await axios.post(getTransactions, {
          userId: user._id,
          frequency: "7",
          startDate: null,
          endDate: null,
          type: "all",
        });
        setTransactions(data?.transactions || []);
      } finally {
        setLoading(false);
      }
    };

    fetchRecent();
  }, [user]);

  const metrics = useMemo(() => {
    const credit = transactions
      .filter((t) => t.transactionType === "credit")
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);

    const expense = transactions
      .filter((t) => t.transactionType === "expense")
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);

    const balance = credit - expense;

    return {
      credit,
      expense,
      balance,
    };
  }, [transactions]);

  const recent = useMemo(() => {
    const sorted = [...transactions].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
    return sorted.slice(0, 6);
  }, [transactions]);

  const handleTrack = () => {
    navigate("/track");
  };

  return (
    <>
      <Header />
      <Container className="mt-4" style={{ position: "relative", zIndex: "2 !important" }}>
        <Row className="mb-4">
          <Col lg={8}>
            <div className="dash-hero">
              <div className="dash-hero__content">
                <div className="dash-hero__title">Welcome{user?.name ? `, ${user.name}` : ""}</div>
                <div className="dash-hero__subtitle">
                  See how your last 7 days look at a glance and jump back into tracking.
                </div>
                <div className="dash-hero__actions">
                  <Button className="dash-primary" onClick={handleTrack}>
                    Track your money
                  </Button>
                </div>
              </div>
              {user?.avatarImage ? (
                <div className="dash-hero__avatar">
                  <img src={user.avatarImage} alt="avatar" />
                </div>
              ) : null}
            </div>
          </Col>

          <Col lg={4} className="mt-3 mt-lg-0">
            <Card className="dash-card dash-card--glass">
              <Card.Body>
                <div className="dash-card__kicker">This week</div>
                <div className="dash-card__metric">
                  <AccountBalanceWalletIcon sx={{ fontSize: 26 }} />
                  <span className="dash-card__metricValue">{metrics.balance.toFixed(2)}</span>
                </div>
                <div className="dash-card__meta">
                  Net balance (credit - expense)
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="g-3">
          <Col md={4}>
            <Card className="dash-card">
              <Card.Body>
                <div className="dash-stat">
                  <div className="dash-stat__icon dash-stat__icon--green">
                    <TrendingUpIcon sx={{ fontSize: 26 }} />
                  </div>
                  <div>
                    <div className="dash-stat__label">Total earned</div>
                    <div className="dash-stat__value">{metrics.credit.toFixed(2)}</div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="dash-card">
              <Card.Body>
                <div className="dash-stat">
                  <div className="dash-stat__icon dash-stat__icon--red">
                    <TrendingDownIcon sx={{ fontSize: 26 }} />
                  </div>
                  <div>
                    <div className="dash-stat__label">Total spent</div>
                    <div className="dash-stat__value">{metrics.expense.toFixed(2)}</div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="dash-card">
              <Card.Body>
                <div className="dash-stat">
                  <div className="dash-stat__icon dash-stat__icon--blue">
                    <AccountBalanceWalletIcon sx={{ fontSize: 26 }} />
                  </div>
                  <div>
                    <div className="dash-stat__label">Transactions</div>
                    <div className="dash-stat__value">{transactions.length}</div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col>
            <Card className="dash-card">
              <Card.Body>
                <div className="dash-sectionHeader">
                  <div>
                    <div className="dash-sectionHeader__title">Recent transactions</div>
                    <div className="dash-sectionHeader__subtitle">
                      Your latest activity from the last 7 days
                    </div>
                  </div>
                  <Button variant="outline-light" className="dash-outline" onClick={handleTrack}>
                    Open tracker
                  </Button>
                </div>

                <div className="dash-tableWrap">
                  <Table responsive hover borderless className="dash-table">
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Type</th>
                        <th className="text-end">Amount</th>
                        <th className="text-end">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan={4} className="text-center text-white-50">
                            Loading...
                          </td>
                        </tr>
                      ) : recent.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="text-center text-white-50">
                            No transactions yet. Click "Track your money" to add one.
                          </td>
                        </tr>
                      ) : (
                        recent.map((t) => (
                          <tr key={t._id}>
                            <td className="text-white">{t.title}</td>
                            <td>
                              <span
                                className={`dash-pill ${
                                  t.transactionType === "credit" ? "dash-pill--green" : "dash-pill--red"
                                }`}
                              >
                                {t.transactionType}
                              </span>
                            </td>
                            <td className="text-end text-white">
                              {Number(t.amount || 0).toFixed(2)}
                            </td>
                            <td className="text-end text-white-50">
                              {t.date ? moment(t.date).format("DD MMM YYYY") : ""}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Dashboard;
