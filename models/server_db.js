var db = require('../db.js');

const save_user_information = (data) => new Promise((resolve, reject) => {
  db.query('INSERT INTO lottery_information SET amount = ?, email = ?', [data.amount, data.email], function(err, results, fields) {
    if (err) {
      reject(new Error('Could not insert into lottery information: ' + err.message));
    }
    resolve('Success');
  });
});

const get_total_amount = () => new Promise((resolve, reject) => {
    db.query('select sum(amount) as total_amount from lottery_information', null, function(err, results, fields) {
      if (err) {
        reject(new Error('Could not get total amount ' + err.message));
      }
      resolve(results);
    });
  });

module.exports = { save_user_information,get_total_amount };
