// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import fs from "fs";
import path from "path";

const moversDir = path.join(process.cwd(), "moversData");

export default async function handler(req, res) {
  const data = req.query;
  let { start, count } = data;
  const fileNames = fs.readdirSync(moversDir);
  let fullPath;
  let fileContent = "";

  switch (parseInt(start)) {
    case 0:
      fullPath = path.join(moversDir, fileNames[0]);
      break;
    case 100:
      fullPath = path.join(moversDir, fileNames[1]);
      break;
    case 125:
      fullPath = path.join(moversDir, fileNames[2]);
      break;
    case 150:
      fullPath = path.join(moversDir, fileNames[3]);
      break;
    case 25:
      fullPath = path.join(moversDir, fileNames[4]);
      break;
    case 50:
      fullPath = path.join(moversDir, fileNames[5]);
      break;
    case 75:
      fullPath = path.join(moversDir, fileNames[6]);
      break;
    default:
      res.status(406).send({ finance: { result: [] } });
      return;
  }

  fileContent = fs.readFileSync(fullPath, "utf8");
  const jsonObj = JSON.parse(fileContent);

  res.status(200).json({ ...jsonObj });
}
