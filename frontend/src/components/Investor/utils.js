import * as XLSX from "xlsx";
import { toast } from "react-toastify";

export const exportToExcel = (data, investorName) => {
  if (!data.length) return toast.warn("No data to export");
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");
  XLSX.writeFile(workbook, `transactions_${investorName}.xlsx`);
};
