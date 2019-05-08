/*
Imports & configuration
!! Don't edit this code unless you are sure of what you do !!
*/
// Class
const express = require('express');
const userCollection = require('../data/users');
const classRouter = express.Router({
  mergeParams: true
});
const helmet = require('helmet')
// var session = require('cookie-session');


var cookieParser = require('cookie-parser')
classRouter.use(cookieParser())
classRouter.use(helmet())
var passwordHash = require('password-hash');
//var expiryDate = new Date( Date.now() + 60 * 60 * 1000 ); // 1 hour
// classRouter.use(bodyparser())
// 


/*
Class definition
*/
class RouterClass {

  constructor() {}

  // Définition des routes
  routes() {
    /* 
    Route to display the home page
    - To send data to the route, juste add an object has second param
    */
    classRouter.get('/', (req, res) => {
      // res.cookie('coucou',{test:"caca"})
      if (req.cookies.name != undefined && req.cookies.name != null)
        res.render('index', {
          connectedUser: 1,
          userCollection: userCollection
        })
      else
        res.render('index', {
          connectedUser: 0,
          userCollection: userCollection
        })

    });

    classRouter.get('/erreurpage', (req, res) => {
      res.render('page-erreur')
    })
    //

    /* 
    Route to connect a user
    - Make 2 const to get email and password from the request
    - Make a loop on the const 'userCollection'
    - Check if yoou find the email
    - Check if the password is correct
    - Send back the correct page
    */

    classRouter.get('/login', (req, res) => {
      if (req.cookies.name != undefined && req.cookies.name != null)
        res.redirect('/')
      else
        res.render('connexion', {
          connectedUser: 0
        })
    });


    classRouter.get('/deconnexion', (req, res) => {
      res.clearCookie('name')
      res.redirect('/')

    });
    /*
    classRouter.get('/login/1',(req,res)=>{
        res.render('connexion',{texte:"mauvais mot de passe",connectedUser:0})
    })*/

    classRouter.post('/loginform', (req, res) => {
      //res.end(JSON.stringify(req.body.password))
      //res.redirect('/index')

      var password = passwordHash.generate(req.body.pass)
      var email = req.body.emai
      var response = 0

      for (let item of userCollection) {
        if (item.email === email && passwordHash.verify(item.password, password)) {
          response = 1
          var composant = passwordHash.generate(item._id)
          res.cookie('name', composant, {
            maxAge: 900000,
            httpOnly: true
          });
          res.json({
            test: 1
          })

        }

      }
      if (response != 1) {

        res.json({
          test: 2
        })
      }
    });

    classRouter.get('/me', (req, res) => {
      if (req.cookies.name != undefined && req.cookies.name != null) {
        var user = []

        for (let item of userCollection) {
          if (passwordHash.verify(item._id, req.cookies.name))

          {

            user.push(item.age)
            user.push(item.name)
            user.push(item.gender)
            user.push(item.email)
            user.push(item.phone)
            user.push(item.address)
          }
        }

        res.render('compte', {
          connectedUser: 1,
          userData: user
        })
      } else
        res.redirect('/erreurpage')

    });
    //

    /* 
    Route test API
    */
    classRouter.post('/api', (req, res) => {
      // console.log("test : " + req.body)
      return res.json(req.body)
    });
    //
  };


  /* 
  Initialize routes 
  !! Don't edit this code unless you are sure of what you do !!
  */
  init() {
    this.routes();
    return classRouter;
  };
};
//


/*
Export class
!! Don't edit this code unless you are sure of what you do !!
*/
module.exports = RouterClass;
//