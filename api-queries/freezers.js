import {query} from './databasecon.js';
import Slonik from 'slonik';
const sql = Slonik.sql;

//Freezers
const getFreezers = async (req, res) => {
  const {rows} =  await query(sql`SELECT *, COUNT(*) OVER() AS count  FROM freezers`);
  res.setHeader("Access-Control-Expose-Headers", "X-Total-Count");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Range",'bytes:0-9/9');
  if (rows.length > 0) {
    res.setHeader("X-Total-Count", rows[0].count);
  }
  else{
    res.setHeader("X-Total-Count", 0);
  }
  res.send(rows);
}

export { getFreezers};
