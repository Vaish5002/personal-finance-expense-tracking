import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import { Button, Modal, Form, Container, Card, Row, Col } from "react-bootstrap";
// import loading from "../../assets/loader.gif";
import "./home.css";
import { addTransaction, getTransactions } from "../../utils/ApiRequest";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "../../components/Spinner";
import TableData from "./TableData";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import BarChartIcon from "@mui/icons-material/BarChart";
import Analytics from "./Analytics";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import HomeIcon from "@mui/icons-material/Home";
import PaymentsIcon from "@mui/icons-material/Payments";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import BoltIcon from "@mui/icons-material/Bolt";
import MovieIcon from "@mui/icons-material/Movie";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import CategoryIcon from "@mui/icons-material/Category";

const Home = () => {
  const navigate = useNavigate();

  const toastOptions = {
    position: "bottom-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "dark",
  };
  const [cUser, setcUser] = useState();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [frequency, setFrequency] = useState("7");
  const [type, setType] = useState("all");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [view, setView] = useState("table");

  const summary = React.useMemo(() => {
    const earned = transactions
      .filter((t) => t.transactionType === "credit")
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);

    const spent = transactions
      .filter((t) => t.transactionType === "expense")
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);

    return {
      earned,
      spent,
      net: earned - spent,
      count: transactions.length,
    };
  }, [transactions]);

  const handleStartChange = (date) => {
    setStartDate(date);
  };

  const handleEndChange = (date) => {
    setEndDate(date);
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    const avatarFunc = async () => {
      if (localStorage.getItem("user")) {
        const user = JSON.parse(localStorage.getItem("user"));
        console.log(user);

        if (user.isAvatarImageSet === false || user.avatarImage === "") {
          navigate("/setAvatar");
        }
        setcUser(user);
        setRefresh(true);
      } else {
        navigate("/login");
      }
    };

    avatarFunc();
  }, [navigate]);

  const [values, setValues] = useState({
    title: "",
    amount: "",
    description: "",
    category: "",
    date: "",
    transactionType: "",
  });

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleChangeFrequency = (e) => {
    setFrequency(e.target.value);
  };

  const handleSetType = (e) => {
    setType(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { amount, category, date, transactionType } = values;

    if (
      !amount ||
      !category ||
      !date ||
      !transactionType
    ) {
      toast.error("Please enter all the fields", toastOptions);
      return;
    }
    try {
      setLoading(true);

      const { data } = await axios.post(addTransaction, {
        title: category,
        amount: amount,
        description: category,
        category: category,
        date: date,
        transactionType: transactionType,
        userId: cUser._id,
      });

      if (data.success === true) {
        toast.success(data.message, toastOptions);
        handleClose();
        setRefresh(!refresh);
      } else {
        toast.error(data.message || data.messages || "Unable to add transaction", toastOptions);
      }
    } catch (err) {
      const apiMsg =
        err?.response?.data?.message ||
        err?.response?.data?.messages ||
        err?.message ||
        "Unable to add transaction";
      toast.error(apiMsg, toastOptions);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setType("all");
    setStartDate(null);
    setEndDate(null);
    setFrequency("7");
  };


  


  useEffect(() => {

    const fetchAllTransactions = async () => {
      try {
        setLoading(true);
        console.log(cUser._id, frequency, startDate, endDate, type);
        const { data } = await axios.post(getTransactions, {
          userId: cUser._id,
          frequency: frequency,
          startDate: startDate,
          endDate: endDate,
          type: type,
        });
        console.log(data);
  
        setTransactions(data.transactions);
  
        setLoading(false);
      } catch (err) {
        // toast.error("Error please Try again...", toastOptions);
        setLoading(false);
      }
    };

    fetchAllTransactions();
  }, [refresh, frequency, endDate, type, startDate]);

  const handleTableClick = (e) => {
    setView("table");
  };

  const handleChartClick = (e) => {
    setView("chart");
  };

  const categoryOptions = [
    { value: "Groceries", label: "Grocery", Icon: ShoppingCartIcon },
    { value: "Rent", label: "Rent", Icon: HomeIcon },
    { value: "Salary", label: "Salary", Icon: PaymentsIcon },
    { value: "Food", label: "Food", Icon: RestaurantIcon },
    { value: "Medical", label: "Medical", Icon: MedicalServicesIcon },
    { value: "Utilities", label: "Utility", Icon: BoltIcon },
    { value: "Entertainment", label: "Fun", Icon: MovieIcon },
    { value: "Transportation", label: "Transport", Icon: DirectionsBusIcon },
    { value: "Other", label: "Other", Icon: CategoryIcon },
  ];

  return (
    <>
      <Header />

      {loading ? (
        <>
          <Spinner />
        </>
      ) : (
        <>
          <Container
            style={{ position: "relative", zIndex: "2 !important" }}
            className="mt-3"
          >
            <div className="trackHeader">
              <div>
                <div className="trackTitle">Track your money</div>
                <div className="trackSubtitle">
                  Filter transactions, switch views, and add new entries quickly.
                </div>
              </div>
              <div className="trackHeaderActions">
                <Button onClick={handleShow} className="trackAddBtn">
                  Add transaction
                </Button>
              </div>
            </div>

            <Row className="g-3 mt-1">
              <Col md={3} sm={6}>
                <Card className="trackStatCard">
                  <Card.Body>
                    <div className="trackStatRow">
                      <div className="trackStatIcon trackStatIconGreen">
                        <TrendingUpIcon sx={{ fontSize: 22 }} />
                      </div>
                      <div>
                        <div className="trackStatLabel">Earned</div>
                        <div className="trackStatValue">{summary.earned.toFixed(2)}</div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3} sm={6}>
                <Card className="trackStatCard">
                  <Card.Body>
                    <div className="trackStatRow">
                      <div className="trackStatIcon trackStatIconRed">
                        <TrendingDownIcon sx={{ fontSize: 22 }} />
                      </div>
                      <div>
                        <div className="trackStatLabel">Spent</div>
                        <div className="trackStatValue">{summary.spent.toFixed(2)}</div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3} sm={6}>
                <Card className="trackStatCard">
                  <Card.Body>
                    <div className="trackStatRow">
                      <div className="trackStatIcon trackStatIconBlue">
                        <AccountBalanceWalletIcon sx={{ fontSize: 22 }} />
                      </div>
                      <div>
                        <div className="trackStatLabel">Net</div>
                        <div className="trackStatValue">{summary.net.toFixed(2)}</div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={3} sm={6}>
                <Card className="trackStatCard">
                  <Card.Body>
                    <div className="trackStatRow">
                      <div className="trackStatIcon trackStatIconPurple">
                        <FormatListBulletedIcon sx={{ fontSize: 22 }} />
                      </div>
                      <div>
                        <div className="trackStatLabel">Transactions</div>
                        <div className="trackStatValue">{summary.count}</div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <div className="filterRow">
              <div className="text-white">
                <Form.Group className="mb-3" controlId="formSelectFrequency">
                  <Form.Label>Select Frequency</Form.Label>
                  <Form.Select
                    name="frequency"
                    value={frequency}
                    onChange={handleChangeFrequency}
                  >
                    <option value="7">Last Week</option>
                    <option value="30">Last Month</option>
                    <option value="365">Last Year</option>
                    <option value="custom">Custom</option>
                  </Form.Select>
                </Form.Group>
              </div>

              <div className="text-white type">
                <Form.Group className="mb-3" controlId="formSelectFrequency">
                  <Form.Label>Type</Form.Label>
                  <Form.Select
                    name="type"
                    value={type}
                    onChange={handleSetType}
                  >
                    <option value="all">All</option>
                    <option value="expense">Expense</option>
                    <option value="credit">Earned</option>
                  </Form.Select>
                </Form.Group>
              </div>

              <div className="text-white iconBtnBox">
                <FormatListBulletedIcon
                  sx={{ cursor: "pointer" }}
                  onClick={handleTableClick}
                  className={`${
                    view === "table" ? "iconActive" : "iconDeactive"
                  }`}
                />
                <BarChartIcon
                  sx={{ cursor: "pointer" }}
                  onClick={handleChartClick}
                  className={`${
                    view === "chart" ? "iconActive" : "iconDeactive"
                  }`}
                />
              </div>

              <div className="filterActions">
                <Button variant="outline-light" onClick={handleReset} className="resetBtnTop">
                  Reset
                </Button>
                <Button onClick={handleShow} className="mobileBtn">
                  +
                </Button>
                <Modal show={show} onHide={handleClose} centered>
                  <Modal.Header closeButton>
                    <Modal.Title>Add Transaction</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form>
                      <div className="txnTypeRow">
                        <div
                          className={`txnTypePill ${
                            values.transactionType === "expense" ? "txnTypePillActive" : ""
                          }`}
                          onClick={() =>
                            setValues({ ...values, transactionType: "expense" })
                          }
                          role="button"
                          tabIndex={0}
                        >
                          Expense
                        </div>
                        <div
                          className={`txnTypePill ${
                            values.transactionType === "credit" ? "txnTypePillActive" : ""
                          }`}
                          onClick={() =>
                            setValues({ ...values, transactionType: "credit" })
                          }
                          role="button"
                          tabIndex={0}
                        >
                          Credit
                        </div>
                      </div>

                      <Form.Group className="mb-3" controlId="formCategory">
                        <Form.Label>Category</Form.Label>
                        <div className="categoryGrid">
                          {categoryOptions.map(({ value, label, Icon }) => (
                            <button
                              type="button"
                              key={value}
                              className={`categoryChip ${
                                values.category === value ? "categoryChipActive" : ""
                              }`}
                              onClick={() => setValues({ ...values, category: value })}
                            >
                              <span className="categoryChipIcon">
                                <Icon sx={{ fontSize: 20 }} />
                              </span>
                              <span className="categoryChipLabel">{label}</span>
                            </button>
                          ))}
                        </div>
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="formAmount">
                        <Form.Label>Amount</Form.Label>
                        <Form.Control
                          name="amount"
                          type="number"
                          placeholder="Enter your Amount"
                          value={values.amount}
                          onChange={handleChange}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="formDate">
                        <Form.Label>Date</Form.Label>
                        <Form.Control
                          type="date"
                          name="date"
                          value={values.date}
                          onChange={handleChange}
                        />
                      </Form.Group>

                      {/* Add more form inputs as needed */}
                    </Form>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                      Close
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                      Submit
                    </Button>
                  </Modal.Footer>
                </Modal>
              </div>
            </div>
            <br style={{ color: "white" }}></br>

            {frequency === "custom" ? (
              <>
                <div className="date">
                  <div className="form-group">
                    <label htmlFor="startDate" className="text-white">
                      Start Date:
                    </label>
                    <div>
                      <DatePicker
                        selected={startDate}
                        onChange={handleStartChange}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="endDate" className="text-white">
                      End Date:
                    </label>
                    <div>
                      <DatePicker
                        selected={endDate}
                        onChange={handleEndChange}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        minDate={startDate}
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <></>
            )}
            {view === "table" ? (
              <>
                <TableData data={transactions} user={cUser} />
              </>
            ) : (
              <>
                <Analytics transactions={transactions} user={cUser} />
              </>
            )}
            <ToastContainer />
          </Container>
        </>
      )}
    </>
  );
};

export default Home;
