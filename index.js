const express = require('express')
const mysql = require('mysql')
const bodyParser = require('body-parser')
const app = express()
// 连接到数据库
const mydb = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'root',
    database:'test',
    port:3306
});
mydb.connect()
app.use(bodyParser.urlencoded({ extended: true }));
//接收json格式的数据
app.use(bodyParser.json());

app.use(function(req, res, next){
    // 允许跨域：所有的操作都是跨域，难道每个路由里面都设置CORS吗？
    // res.setHeader('Access-Control-Allow-Origin', '*');
    //res.header('Access-Control-Allow-Origin', 'http://www.baidu.com'); //这样写，只有www.baidu.com 可以访问。
    res.header('Access-Control-Allow-Origin', '*'); //这个表示任意域名都可以访问，这样写不能携带cookie了。
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE');//设置方法
    next();
});
app.get('/', (req, res) => {
    res.send('Hello World!');
});
// 注册的路由
app.post('/reg', function(req, res){
    // 接收post过来的数据
    console.log(req.body)
        let sql = 'INSERT INTO lofteruser(name, passwd, passwdag) VALUES (?,?,?)';
        mydb.query(sql, [req.body.name, req.body.passwd, req.body.passwdag.toLocaleString()], function(err, result){
            if(err){
                 console.log(err);
                 return ;
             }else if(req.body.passwd!=req.body.passwdag){
                 console.log("请输入相同的密码")
            }
             res.json({result:'ok'});//nodejs是非阻塞的 [{},{},{}]  {as:[{},{}]}   [1,2,3,4]
         })
    })

    app.post('/loginin', function(req, res){
        // 接收post过来的数据
        console.log(req.body)
            let sql = 'SELECT * FROM lofteruser WHERE name = ? LIMIT 0, 1';
            mydb.query(sql, [req.body.name, req.body.passwd.toLocaleString()], function(err, result){
                console.log(result)
                if(err){
                     console.log(err);
                     return ;
                 }if(!req.body.name){
                     console.log("请填入用户名")
                 }
                 if(req.body.passwd != result[0].passwd){
                    res.json({r:'passwd_err'});
                    return ;
                }
                // 表示登录成功
                res.json({r:'success'})
        
             })
        })

app.listen(81, () => {
    console.log('app listening on port 81!');
});
