import fs from "fs";
import path from "path";

const stocksDir = path.join(process.cwd(), "stocksData");

export default async function handler(req, res) {
  const data = req.query;

  // String array with symbols of the stocks
  let { symbols } = data;
  if (!symbols) res.status(406).send({ message: "param values are illegal" });

  const fileName = fs.readdirSync(stocksDir);
  const fullPath = path.join(stocksDir, fileName[0]);
  const fileContent = fs.readFileSync(fullPath, "utf8");
  const jsonObj = JSON.parse(fileContent);

  const result = [];
  symbols.split(",").forEach((symbol) => {
    if (jsonObj.hasOwnProperty(symbol)) result.push(jsonObj[symbol]);
  });

  const stocksData = { quoteResponse: { result } };

  res.status(200).json({ ...stocksData });
}
