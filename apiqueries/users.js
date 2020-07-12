import {query} from './databasecon.js';
import Slonik from 'slonik';
const sql = Slonik.sql;

//Users
const getUsers = async (req, res) => {
  const {rows} =  await query(
    sql`SELECT * FROM USERS;`)
  res.send(rows);
}

export { getUsers};