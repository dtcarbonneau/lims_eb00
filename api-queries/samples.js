import {query} from './databasecon.js';
import Slonik from 'slonik';
const sql = Slonik.sql;


//get Sample Status
const getSStatus = async (req, res) => {
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

  const {rows} =  await query(
    sql`SELECT * FROM s_status WHERE ${sql.join(booleanExpressions,sql` AND `)}`);
  res.setHeader("Access-Control-Expose-Headers", "Content-Range");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Range",'bytes:0-9/9');
  res.send(rows);
}

//Samples
const getSample = async (req, res) => {
  const {rows} =  await query(
    sql`SELECT * FROM samples WHERE id =  ${req.params.id}`);
  res.setHeader("Access-Control-Expose-Headers", "Content-Range");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Range",'bytes:0-9/9');
  res.send(rows);
}

//SAMPLES
const getSamples = async (req, res) => {
  const filter_qs = req.query.filter ? JSON.parse(req.query.filter): null;
  const range_qs = req.query.range ? JSON.parse(req.query.range): null;
  // 'be' means boolean expressions
  const filter_be = [
    sql`TRUE`,
  ];
  if (filter_qs) {
    //flter for ids...
    if(filter_qs.id) {
      filter_be.push(
      sql`id = ANY(${sql.array(filter_qs.id, 'int4')})
      `);
    }
    //filter for user...
    if (filter_qs.u_id) {
      filter_be.push(
      sql`u_id = ${filter_qs.u_id}
      `);
    }
    //filter for project...
    if (filter_qs.p_id) {
      filter_be.push(
        sql`p_id = ${filter_qs.p_id}
      `);
    }
    //filter for sample status...
    if (filter_qs.ss_id) {
      filter_be.push(
        sql`ss_id = ${filter_qs.ss_id}
      `);
    }
  }
  // range/offset handling

  const range_offset = (range_qs != null) ? sql`OFFSET ${range_qs[0]} LIMIT ${range_qs[1] - range_qs[0]}` : sql``;

  const {rows} =  await query(
    sql`SELECT *, COUNT(*) OVER() AS count FROM samples WHERE ${sql.join(filter_be,sql` AND `)} ${range_offset} `);
  res.setHeader("Access-Control-Expose-Headers", "X-Total-Count");
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (rows.length > 0) {
    res.setHeader("X-Total-Count", rows[0].count);
  }
  else{
    res.setHeader("X-Total-Count", 0);
  }
  res.send(rows);
}
//res.setHeader("Content-Range",'bytes:0-9/20');

const getBoxSamples = async (req, res) => {
  const queryString = JSON.parse(req.query.filter);
  const range_qs = req.query.range ? JSON.parse(req.query.range): null;

  const {rows} =  await query(
  sql`SELECT *, COUNT(*) OVER() AS count FROM samples WHERE substring(loc,1, 14)
      in (SELECT SUBSTRING(loc, 1, 14) AS ExtractString FROM samples WHERE  p_id = ${queryString.p_id})
      AND ss_id = 1`);
  res.setHeader("Access-Control-Expose-Headers", "X-Total-Count");
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (rows.length > 0) {
      res.setHeader("X-Total-Count", rows[0].count);
  }
  else{
    res.setHeader("X-Total-Count", 0);
  }
  res.send(rows);
}

const putSamples = async (req, res) => {
  const update = req.body;
  const columns = [];

  if (update.ss_id !== undefined) {
    columns.push(
      sql`ss_id = ${update.ss_id}
    `)
  }

  if (update.p_id !== undefined) {
    columns.push(
      sql`p_id = ${update.p_id}
    `)
  }
  const columnsj = sql.join(columns,sql` , `)
  const condition = sql`id = ANY(${sql.array(update.ids, 'int4')})`
  const {rows} =  await query(
    sql`UPDATE samples SET ${columnsj} WHERE ${condition};`);
  res.send(rows);
}


//POST SAMPLES
const postSamples = async (req, res) => {
  console.log(req.body);
  if (req.body !== undefined) {
      const request_data = req.body;

      const inserts=(sql.unnest(req.body,['text','int4','int4','int4', 'date', 'date', 'text']));

      const {rows} =  await query(
         sql`INSERT INTO samples (sa_name, u_id, ss_id, p_id, date_cryo, date_exp, loc)
         SELECT * FROM ${inserts}`);
         res.send(rows);
  }
  else{
     console.log('req is undefined');
     res.send(400);
  };
}

const getSampleStore = async (req, res) => {
    const range_qs = req.query.range ? JSON.parse(req.query.range): null;
    const filter = JSON.parse(req.query.filter).myCustomAttr;
    let ids = JSON.parse(req.query.filter).ids;

    const booleanExpressions = [
      sql`TRUE`,
    ];

    if (ids.length > 0 ) {
      booleanExpressions.push(
        sql`id = ANY(${sql.array(ids, 'int4')})
      `);
    }

    const range_offset = (range_qs != null) ? sql`OFFSET ${range_qs[0]} LIMIT ${range_qs[1] - range_qs[0]}` : sql``

    const {rows} =  await query(
      sql`SELECT *, COUNT(*) OVER() AS count FROM get_avail_store(${filter})
          WHERE ${sql.join(booleanExpressions,sql` AND `)} ${range_offset}`
    );
    res.setHeader("Access-Control-Expose-Headers", "X-Total-Count");
    res.setHeader("Access-Control-Allow-Origin", "*");
    if (rows.length > 0){
      res.setHeader("X-Total-Count", rows[0].count);
    }
    else{
      res.setHeader("X-Total-Count", 0);
    }
    res.send(rows);
}

const deleteSampleRows = async (req, res) => {
  const filter = JSON.parse(req.query.filter).id;

  if (filter.length > 0 ) {
    let idVals = [];
    for (const i of filter){
      idVals.push(
            sql`${i}`)
    }
  const ids_filter = sql.join(idVals,sql` , `);
  // console.log(`DELETE FROM samples WHERE id IN (${idVals})`);
  const {rows} =  await query(
        sql`DELETE FROM samples WHERE id IN (${ids_filter})`);
  res.send(rows);
  };
};

export {getSamples, deleteSampleRows, getBoxSamples, getSStatus,
        putSamples, getSample, postSamples, getSampleStore};
