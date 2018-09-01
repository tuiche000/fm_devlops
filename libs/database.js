const mysql=require('mysql');
const assert=require('assert');

let db=mysql.createPool({
  host:       'localhost',
  port:       '3306',
  user:       'root',
  password:   '123456',
  database:   'swgpro',
});

function filterValue(val){
  return val.toString().replace(/'/g, "\\'").replace(/"/g, "\\\"");
}






db._query=db.query;

db.query=function (sql){
  return new Promise((resolve, reject)=>{
    db._query(sql, (err, rows)=>{
      if(err){
        reject(err);
      }else{
        resolve(rows);
      }
    });
  });
};

//1.方便
//2.换也方便
//3.校验、缓存、...
db.insert=function (table, data){
  let keys=[];
  let vals=[];

  for(let key in data){
    keys.push(key);
    vals.push('\''+filterValue(data[key])+'\'');
  }

  console.log(`INSERT INTO ${table} (${keys.join(',')}) VALUES(${vals.join(',')})`)

  return db.query(`INSERT INTO ${table} (${keys.join(',')}) VALUES(${vals.join(',')})`);
};
db.delete=function (table, where){
  assert(where);
  assert(typeof where=='object');

  let arr=[];
  for(let key in where){
    arr.push(`${key}='${filterValue(where[key])}'`);
  }
  where=arr.join(' AND ');

  return db.query(`DELETE FROM ${table} WHERE ${where}`);
};
db.update=function (table, ID, data){
  let arr=[];
  for(let key in data){
    arr.push(`${key}='${filterValue(data[key])}'`)
  }

  return db.query(`
    UPDATE ${table}
    SET ${arr.join(',')}
    WHERE ID='${ID}'
  `);
};
db.select=function (table, fields, where){
  if(!where){
    where='1=1';
  }else{
    let arr=[];
    for(let key in where){
      arr.push(`${key}='${filterValue(where[key])}'`);
    }

    where=arr.join(' AND ');
  }

  return db.query(`SELECT ${fields} FROM ${table} WHERE ${where}`);
};

module.exports=db;
