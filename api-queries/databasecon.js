import Slonik from 'slonik';

const pool = Slonik.createPool('postgresql://postgres:limsabveris@limsdb.chuh9psyb1ub.us-east-2.rds.amazonaws.com:5432/lims');

var query = (q) => pool.query(q);

export {query};
