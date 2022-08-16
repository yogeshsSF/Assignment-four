import { Pool} from "pg";

const pool = new Pool({
    user:'yogesh',
    host:'localhost',
    database:'mydb',
    password:'yogesh123',
    port: 5432
})

// module.exports = pool;
export default pool;

