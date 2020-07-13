import {query} from './databasecon.js';
import {sql} from 'slonik';

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

    // const range_offset = sql`1=1`;

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

export { getUsers, postUser, postLogin, putUsers};

 //export {getSamples, deleteSampleRows, getFreezers, getBoxSamples, getSStatus, getUsers, postUser,
 //        postLogin, getProjects, putSamples, putUsers, putProjects, getSample,
 //        postSamples, getSampleStore, postProject};
