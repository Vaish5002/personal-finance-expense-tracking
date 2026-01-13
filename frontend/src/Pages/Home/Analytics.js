import React from "react";
// import CardBox from "./CardBox";
import { Card, Col, Container, Row } from "react-bootstrap";
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
// import MovingIcon from '@mui/icons-material/Moving';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";


const Analytics = ({ transactions }) => {
  const TotalTransactions = transactions.length;
  const totalIncomeTransactions = transactions.filter(
    (item) => item.transactionType === "credit"
  );
  const totalExpenseTransactions = transactions.filter(
    (item) => item.transactionType === "expense"
  );

  const totalIncomePercent = TotalTransactions
    ? (totalIncomeTransactions.length / TotalTransactions) * 100
    : 0;
  const totalExpensePercent = TotalTransactions
    ? (totalExpenseTransactions.length / TotalTransactions) * 100
    : 0;

  // console.log(totalIncomePercent, totalExpensePercent);

  const totalTurnOver = transactions.reduce(
    (acc, transaction) => acc + transaction.amount,
    0
  );
  const totalTurnOverIncome = transactions
    .filter((item) => item.transactionType === "credit")
    .reduce((acc, transaction) => acc + transaction.amount, 0);
  const totalTurnOverExpense = transactions
    .filter((item) => item.transactionType === "expense")
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  const TurnOverIncomePercent = totalTurnOver
    ? (totalTurnOverIncome / totalTurnOver) * 100
    : 0;
  const TurnOverExpensePercent = totalTurnOver
    ? (totalTurnOverExpense / totalTurnOver) * 100
    : 0;

  const net = totalTurnOverIncome - totalTurnOverExpense;

  const categories = [
    "Groceries",
    "Rent",
    "Salary",
    "Tip",
    "Food",
    "Medical",
    "Utilities",
    "Entertainment",
    "Transportation",
    "Other",
  ];

  const colors = {
    "Groceries": '#FF6384',
    "Rent": '#36A2EB',
    "Salary": '#FFCE56',
    "Tip": '#4BC0C0',
    "Food": '#9966FF',
    "Medical": '#FF9F40',
    "Utilities": '#8AC926',
    "Entertainment": '#6A4C93',
    "Transportation": '#1982C4',
    "Other": '#F45B69',
  };

  const isLight =
    typeof document !== "undefined" &&
    document.body &&
    document.body.classList.contains("theme-light");

  const axisColor = isLight ? "#111827" : "rgba(255,255,255,0.82)";
  const gridColor = isLight ? "rgba(17,24,39,0.12)" : "rgba(255,255,255,0.10)";

  const incomeExpenseBarData = [
    {
      name: "Income",
      amount: totalTurnOverIncome,
      fill: "#22c55e",
    },
    {
      name: "Expense",
      amount: totalTurnOverExpense,
      fill: "#ef4444",
    },
  ];

  const cashflowByDay = React.useMemo(() => {
    const byKey = new Map();
    transactions.forEach((t) => {
      const key = new Date(t.date).toISOString().slice(0, 10);
      const prev = byKey.get(key) || { date: key, income: 0, expense: 0 };
      if (t.transactionType === "credit") prev.income += t.amount;
      if (t.transactionType === "expense") prev.expense += t.amount;
      byKey.set(key, prev);
    });
    return Array.from(byKey.values())
      .sort((a, b) => (a.date > b.date ? 1 : -1))
      .map((d) => ({
        ...d,
        net: d.income - d.expense,
      }));
  }, [transactions]);

  const categoryPieData = React.useMemo(() => {
    const totals = new Map();
    categories.forEach((c) => totals.set(c, { name: c, income: 0, expense: 0 }));
    transactions.forEach((t) => {
      if (!totals.has(t.category)) totals.set(t.category, { name: t.category, income: 0, expense: 0 });
      const obj = totals.get(t.category);
      if (t.transactionType === "credit") obj.income += t.amount;
      if (t.transactionType === "expense") obj.expense += t.amount;
    });

    const rows = Array.from(totals.values())
      .map((r) => ({
        name: r.name,
        value: r.income + r.expense,
        income: r.income,
        expense: r.expense,
      }))
      .filter((r) => r.value > 0)
      .sort((a, b) => b.value - a.value);

    return rows;
  }, [transactions, categories]);

  return (
    <>
      <Container className="mt-4 analyticsShell">
        <div className="analyticsHeader">
          <div>
            <div className="analyticsTitle">Insights</div>
            <div className="analyticsSubtitle">
              A quick visual breakdown of your filtered transactions.
            </div>
          </div>
        </div>

        <Row className="g-3 mt-1">
          <Col md={3} sm={6}>
            <Card className="analyticsStatCard">
              <Card.Body>
                <div className="analyticsStatLabel">Transactions</div>
                <div className="analyticsStatValue">{TotalTransactions}</div>
                <div className="analyticsStatMeta">
                  Income: <ArrowDropUpIcon /> {totalIncomeTransactions.length} | Expense: <ArrowDropDownIcon /> {totalExpenseTransactions.length}
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3} sm={6}>
            <Card className="analyticsStatCard">
              <Card.Body>
                <div className="analyticsStatLabel">Total Amount</div>
                <div className="analyticsStatValue">{totalTurnOver} <CurrencyRupeeIcon /></div>
                <div className="analyticsStatMeta">
                  Earned: {totalTurnOverIncome} | Spent: {totalTurnOverExpense}
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3} sm={6}>
            <Card className="analyticsStatCard">
              <Card.Body>
                <div className="analyticsStatLabel">Net</div>
                <div className="analyticsStatValue">{net} <CurrencyRupeeIcon /></div>
                <div className="analyticsStatMeta">
                  Income - Expense
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3} sm={6}>
            <Card className="analyticsStatCard">
              <Card.Body>
                <div className="analyticsStatLabel">Top mode</div>
                <div className="analyticsStatValue">
                  {totalTurnOverIncome >= totalTurnOverExpense ? "Income" : "Expense"}
                </div>
                <div className="analyticsStatMeta">
                  Based on total amount
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="g-3 mt-1">
          <Col lg={6}>
            <Card className="analyticsCard">
              <Card.Header className="analyticsCardHeader">Income vs Expense</Card.Header>
              <Card.Body>
                <div className="analyticsChartWrap">
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={incomeExpenseBarData} margin={{ left: 10, right: 10 }}>
                      <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fill: axisColor, fontWeight: 700 }} />
                      <YAxis tick={{ fill: axisColor, fontWeight: 700 }} />
                      <Tooltip
                        contentStyle={{
                          borderRadius: 12,
                          border: `1px solid ${gridColor}`,
                          background: isLight ? "#fff" : "rgba(17,24,39,0.92)",
                          color: axisColor,
                        }}
                      />
                      <Bar dataKey="amount" radius={[10, 10, 0, 0]}>
                        {incomeExpenseBarData.map((entry) => (
                          <Cell key={entry.name} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={6}>
            <Card className="analyticsCard">
              <Card.Header className="analyticsCardHeader">Category breakdown</Card.Header>
              <Card.Body>
                <div className="analyticsChartWrap">
                  {categoryPieData.length ? (
                    <ResponsiveContainer width="100%" height={260}>
                      <PieChart>
                        <Tooltip
                          contentStyle={{
                            borderRadius: 12,
                            border: `1px solid ${gridColor}`,
                            background: isLight ? "#fff" : "rgba(17,24,39,0.92)",
                            color: axisColor,
                          }}
                        />
                        <Legend
                          wrapperStyle={{
                            color: axisColor,
                            fontWeight: 700,
                          }}
                        />
                        <Pie
                          data={categoryPieData}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={60}
                          outerRadius={95}
                          paddingAngle={2}
                          stroke={gridColor}
                        >
                          {categoryPieData.map((entry) => (
                            <Cell
                              key={entry.name}
                              fill={colors[entry.name] || "#60a5fa"}
                            />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="analyticsEmpty">No category data for current filters.</div>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="g-3 mt-1">
          <Col lg={12}>
            <Card className="analyticsCard">
              <Card.Header className="analyticsCardHeader">Cashflow over time</Card.Header>
              <Card.Body>
                <div className="analyticsChartWrap">
                  {cashflowByDay.length ? (
                    <ResponsiveContainer width="100%" height={280}>
                      <LineChart data={cashflowByDay} margin={{ left: 10, right: 10 }}>
                        <CartesianGrid stroke={gridColor} strokeDasharray="3 3" />
                        <XAxis dataKey="date" tick={{ fill: axisColor, fontWeight: 700 }} />
                        <YAxis tick={{ fill: axisColor, fontWeight: 700 }} />
                        <Tooltip
                          contentStyle={{
                            borderRadius: 12,
                            border: `1px solid ${gridColor}`,
                            background: isLight ? "#fff" : "rgba(17,24,39,0.92)",
                            color: axisColor,
                          }}
                        />
                        <Legend wrapperStyle={{ color: axisColor, fontWeight: 700 }} />
                        <Line type="monotone" dataKey="income" stroke="#22c55e" strokeWidth={3} dot={false} />
                        <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={3} dot={false} />
                        <Line type="monotone" dataKey="net" stroke="#60a5fa" strokeWidth={3} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="analyticsEmpty">No time-series data for current filters.</div>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Analytics;
