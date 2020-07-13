import {query} from './databasecon.js';
import Slonik from 'slonik';
const sql = Slonik.sql;

//Projects
const getProjects = async (req, res) => {
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
      //filter for user...
    if (queryString.u_id !== undefined) {
      booleanExpressions.push(
        sql`u_id = ${queryString.u_id}
      `);
    }
  }

  const range_offset = (range_qs != null) ? sql`OFFSET ${range_qs[0]} LIMIT ${range_qs[1] - range_qs[0]}` : sql``;
    const {rows} =  await query(
      sql`SELECT *, COUNT(*) OVER() AS count FROM projects WHERE ${sql.join(booleanExpressions,sql` AND `)} ${range_offset}`);

    if (rows.length > 0) {
      res.setHeader("X-Total-Count", rows[0].count);
    }
    else{
      res.setHeader("X-Total-Count", 0);
    }
    res.setHeader("Access-Control-Expose-Headers", "X-Total-Count");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.send(rows);
}

const postProject = async (req, res) => {

  const proj = req.body;
  const columns = [];
  const values = [];

  if (proj.p_name !== undefined) {
    columns.push(
      sql`p_name`)
    values.push(
      sql`${proj.p_name}`)
  }

  if (proj.u_id !== undefined) {
    columns.push(
      sql`u_id`)
    values.push(
      sql`${proj.u_id}`)
  }

  if (proj.t_name !== undefined) {
    columns.push(
      sql`t_name`)
    values.push(
      sql`${proj.t_name}`)
  }

  if (proj.samp_type !== undefined) {
    columns.push(
      sql`samp_type`)
    values.push(
      sql`${proj.samp_type}`)
  }

  if (proj.inv_date !== undefined) {
    columns.push(
      sql`inv_date`)
    values.push(
      sql`${proj.inv_date}`)
  }

  if (proj.sto_terms !== undefined) {
    columns.push(
      sql`sto_terms`)
    values.push(
      sql`${proj.sto_terms}`)
  }

  const columnsj = sql.join(columns,sql` , `);

  const valuesj = sql.join(values,sql` , `);

  const {rows} =  await query(
    sql`INSERT INTO projects (${columnsj}) VALUES (${valuesj});`);
  res.send(rows);
}

const putProjects = async (req, res) => {
  const update = req.body;
  const columns = [];

  if (update.p_name !== undefined) {
    columns.push(
      sql`p_name = ${update.p_name}
    `)
  }

  if (update.u_id !== undefined) {
    columns.push(
      sql`u_id = ${update.u_id}
    `)
  }

  if (update.t_name !== undefined) {
    columns.push(
      sql`t_name = ${update.t_name}
    `)
  }

  if (update.samp_type !== undefined) {
    columns.push(
      sql`samp_type = ${update.samp_type}
    `)
  }

  if (update.inv_date !== undefined) {
    columns.push(
      sql`inv_date = ${update.inv_date}
    `)
  }

  if (update.sto_terms !== undefined) {
    columns.push(
      sql`sto_terms = ${update.sto_terms}
    `)
  }

  const columnsj = sql.join(columns,sql` , `)
  const condition = sql`id = ANY(${sql.array(update.ids, 'int4')})`;
  const {rows} =  await query(
    sql`UPDATE projects SET ${columnsj} WHERE ${condition};`);
  res.send(rows);
}

export {getProjects, putProjects, postProject};
