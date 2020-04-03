module.exports = app => {
  const express = require('express');
  const router = express.Router()
  const fs = require('fs')
  const path = require('path')

  /**
   * @description: 将表格型数据转换为对象数组格式
   * @param {tableHead: []} :表头
   * @param {table: []} :整个表格
   * @return: [] : 数组对象
   */
  const tableToArrayObject = function(tableHead, table) {
    const arr = [];
    table.shift();
    for (let i = 0; i < table.length; i++) {
      const hash = {};
      for (let j = 0; j < table[i].length; j++) {
        for (let k = 0; k < tableHead.length; k++) {
          if (k === j) {
            const value = table[i][j]
            hash[tableHead[k]] = value
          }
        }
      }
      arr.push(hash)
    }
    return arr
  }

  router.get('/bills', async (req, res) => {
    const billPath = path.resolve(__dirname, './../static/bill.csv');
    fs.readFile(billPath, function(err, fileData) {
      if (err) console.log(err);
      fileData = fileData.toString();
      var table = new Array();
      var rows = fileData.split("\r\n");
      for (var i = 0; i < rows.length; i++) {
        table.push(rows[i].split(","));
      }
      const data = tableToArrayObject(table[0], table)
      res.send(data)
    })
  })

  router.get('/categories', async (req, res) => {
    const categoriesPath = path.resolve(__dirname, './../static/categories.csv');
    fs.readFile(categoriesPath, function(err, fileData) {
      if (err) console.log(err);
      fileData = fileData.toString();
      const table = new Array();
      const rows = fileData.split("\r\n");
      for (var i = 0; i < rows.length; i++) {
        table.push(rows[i].split(","));
      }
      const data = tableToArrayObject(table[0], table)
      res.send(data)
    })
  })

  router.post('/bill', async (req, res) => {
    const billPath = path.resolve(__dirname, './../static/bill.csv');
    fs.readFile(billPath, function(err, fileData) {
      if (err) res.send(err);
      fileData = fileData.toString();
      const { type, time, category, amount } = req.body
        const newFileData = `${fileData}\r\n${type},${time},${category},${amount}`
        fs.writeFile(billPath, newFileData, function(err) {
          if (err) res.send(err)
          res.send('success')
        })
    })
  })
  app.use('/api', router)
}