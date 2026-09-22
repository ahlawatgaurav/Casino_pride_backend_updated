const fs = require("fs");
const path = require("path");
const ExcelJS = require("exceljs");
const { uploadFile } = require("applib/fileUpload");

function ensureDirectory(directoryPath) {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }
}

module.exports.generateExcelReport = async (
  rows,
  filters,
  directoryPath,
  spacesFolderName = "Module"
) => {
  ensureDirectory(directoryPath);

  const workbook = new ExcelJS.Workbook();
  const summarySheet = workbook.addWorksheet("Summary");
  const reportSheet = workbook.addWorksheet("Report");

  const fromDate = filters?.fromDate || "-";
  const toDate = filters?.toDate || "-";
  const categoryName = filters?.categoryName || "All Categories";
  const allCount = Number(filters?.allCount || 0);
  const selectedCategoryCount = Number(filters?.selectedCategoryCount || 0);

  summarySheet.columns = [
    { header: "Field", key: "field", width: 30 },
    { header: "Value", key: "value", width: 40 },
  ];

  summarySheet.addRows([
    { field: "From Date", value: fromDate },
    { field: "To Date", value: toDate },
    { field: "Category", value: categoryName },
    { field: "Total Count (All)", value: allCount },
    { field: "Count (Selected Category)", value: selectedCategoryCount },
    { field: "Generated At", value: new Date().toISOString() },
  ]);

  const headers = rows.length > 0 ? Object.keys(rows[0]) : [];
  reportSheet.columns = headers.map((key) => ({
    header: key,
    key,
    width: Math.max(16, String(key).length + 2),
  }));

  if (rows.length > 0) {
    reportSheet.addRows(rows);
  }

  const fileName = `detailed_report_${Date.now()}.xlsx`;
  const filePath = path.join(directoryPath, fileName);
  await workbook.xlsx.writeFile(filePath);

  const file = fs.readFileSync(filePath);
  const fileLink = await uploadFile(file, spacesFolderName, fileName, filePath);

  return {
    filename: fileName,
    path: filePath,
    fileLink,
    Message: "xlsx file has been written successfully",
  };
};
