const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DATABASE.replace('<db_username>', process.env.DATABASE_USERNAME).replace(
  '<db_password>',
  process.env.DATABASE_PASSWORD,
);

console.log(DB.replace(process.env.DATABASE_PASSWORD, 'HIDDEN'));

mongoose
  .connect(DB)
  .then(() => console.log('DB connection successful!'))
  .catch((err) => console.log('DB connection FAILED!!', err));

  

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
