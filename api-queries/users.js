import {query} from './databasecon.js';
import Slonik from 'slonik';
const sql = Slonik.sql;

const postLogin = async (req, res) => {
  const bools = [
    sql`TRUE`,
  ];

  const user = req.body;

  // Username
  if (user.username !== undefined) {
    bools.push(
      sql`username = ${user.username}`)
  }
  else{
    res.status(401);
    res.send('Must provide both username and password');
  }

  // Password
  if (user.password !== undefined) {
    bools.push(
      sql`password = ${user.password}`)
  }
  else{
    res.status(401);
    res.send('Must provide both username and password');
  }

  const {rows} =  await query(
    sql`SELECT * FROM users WHERE ${sql.join(bools, sql` AND `)}`);

  if (rows.length < 1) {
    console.log('FAILED RESPONSE');
    res.setHeader("Access-Control-Expose-Headers", "Content-Range");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Range",'bytes:0-9/9');
    res.send(401);
    console.log(res.status);

  }
  else{
    res.setHeader("Access-Control-Expose-Headers", "Content-Range");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Range",'bytes:0-9/9');
    res.send(rows);
    res.status(200);

  }
}

//Users
const getUsers = async (req, res) => {
  const range_qs = req.query.range ? JSON.parse(req.query.range): null;
  const booleanExpressions = [
      sql`TRUE`,
    ];

  if (req.query.filter) {
    const queryString = JSON.parse(req.query.filter);
    if (queryString.id !== undefined) {
      booleanExpressions.push(
        sql`id = ANY(${sql.array(queryString.id, 'int4')})
      `);
    }
  }

  const range_offset = (range_qs != null) ? sql`OFFSET ${range_qs[0]} LIMIT ${range_qs[1] - range_qs[0]}` : sql``;

  const {rows} =  await query(
    sql`SELECT *, COUNT(*) OVER() AS count FROM users WHERE ${sql.join(booleanExpressions,sql` AND `)} ${range_offset}`);

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

const postUser = async (req, res) => {
  const user = req.body;
  const columns = [];
  const values = [];

  if (user.first_name !== undefined) {
    columns.push(
      sql`first_name`)
    values.push(
      sql`${user.first_name}`)
  }

  if (user.last_name !== undefined) {
    columns.push(
      sql`last_name`)
    values.push(
      sql`${user.last_name}`)
  }

  if (user.email !== undefined) {
    columns.push(
      sql`email`)
    values.push(
      sql`${user.email}`)
  }
  if (user.username !== undefined) {
    columns.push(
      sql`username`)
    values.push(
      sql`${user.username}`)
  }
  if (user.password !== undefined) {
    columns.push(
      sql`password`)
    values.push(
      sql`${user.password}`)
  }

  const columnsj = sql.join(columns,sql` , `);

  const valuesj = sql.join(values,sql` , `);
  const {rows} =  await query(
    sql`INSERT INTO users (${columnsj}) VALUES (${valuesj});`);
  res.send(rows);
}

const putUsers = async (req, res) => {
  const update = req.body;
  const columns = [];

  if (update.first_name !== undefined) {
    columns.push(
      sql`first_name = ${update.first_name}
    `)
  }

  if (update.last_name !== undefined) {
    columns.push(
      sql`last_name = ${update.last_name}
    `)
  }

  if (update.email !== undefined) {
    columns.push(
      sql`email = ${update.email}
    `)
  }

  if (update.username !== undefined) {
    columns.push(
      sql`username = ${update.username}
    `)
  }

  if (update.password !== undefined) {
    columns.push(
      sql`password = ${update.password}
    `)
  }

  const columnsj = sql.join(columns,sql` , `)
  const condition = sql`id = ANY(${sql.array(update.ids, 'int4')})`;
  const {rows} =  await query(
    sql`UPDATE users SET ${columnsj} WHERE ${condition};`);
  res.send(rows);
}

export { getUsers, postUser, postLogin, putUsers};