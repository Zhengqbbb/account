const express = require('express');

const app = express()

app.use(require('cors')())
//app.use(express.json());

app.use('/static', express.static(__dirname + '/static'))
require('./router')(app);
app.listen(3000, () => {
  console.log('localhost: 3000')
})