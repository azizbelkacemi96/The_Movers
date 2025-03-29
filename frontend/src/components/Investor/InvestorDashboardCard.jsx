import React from "react";

const InvestorDashboardCard = ({ investor }) => {
  const balance = investor.balance.toFixed(2);
  const balanceClass =
    investor.balance < 0 ? "text-red-600" : "text-green-600";

  return (
    <div className="bg-white border shadow p-4 mb-4 rounded text-sm">
      <h2 className="text-lg font-semibold mb-2">👤 {investor.name}</h2>
      <p>💰 Deposits: €{investor.totalDeposits.toFixed(2)}</p>
      <p>📤 Withdrawals: €{investor.totalWithdrawals.toFixed(2)}</p>
      <p className={`font-bold ${balanceClass}`}>💼 Balance: €{balance}</p>
    </div>
  );
};

export default InvestorDashboardCard;
