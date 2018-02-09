var express = require('express');
var router = express.Router();
var orm = require('../orm');

const {OAuth2Client} = require('google-auth-library');

var CLIENT_ID = '38977793520-u51b5kpvkfuokp2ev9vb3vllfkl6oaqo.apps.googleusercontent.com';
var CLIENT_SECRET = '6s9Lnzi4QDq1oX5HDoJDRd_x';
var CLIENT_CALLBACK = 'http://reliacode.com:8080';
var client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, CLIENT_CALLBACK);
var jwt = require('jsonwebtoken');

/* POST home page. */
router.post('/tokensignin', function(req, res, next) {

  var userid = null;
  var userid = 'xxx';
  var resToken = null;
  client.verifyIdToken(
      {
        idToken: req.body.token,
        audience: CLIENT_ID // Specify the CLIENT_ID of the app that accesses the backend
      },  
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3],
      (e, login) => {
        var payload = login.getPayload();
        console.log(["payload", payload]);
        var user = null;

        orm.User.where({google_id: payload['sub']}).fetch({require: true}).then((model) => {
          return Promise.resolve(model);
        })
        .catch((err) => {
          return new orm.User({google_id: payload['sub'], email: payload['email'], given_name: payload['given_name'], family_name: payload['family_name'], picture: payload['picture']}).save().then(function(model) {
            return Promise.resolve(model);
          });
        })
        .then((model) => {
          let user = model.attributes;
          console.log(['user', user]);
          // resToken = jwt.sign({ id: user.id, google_id: payload['sub'], email: payload['email'] }, CLIENT_SECRET);
          resToken = jwt.sign({ id: user.id, google_id: payload['sub'], email: payload['email'], given_name: payload['given_name'], family_name: payload['family_name'], picture: payload['picture'] }, CLIENT_SECRET);
          // console.log(["payload", payload]);
          // console.log(["resToken", resToken]);

          // If request specified a G Suite domain:
          //var domain = payload['hd'];

          res.json({ token: resToken });
        });
      });
});

module.exports = router;


/*

https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=eyJhbGciOiJSUzI1NiIsImtpZCI6ImJhNGRlZDdmNWE5MjQyOWYyMzM1NjFhMzZmZjYxM2VkMzg3NjJjM2QifQ.eyJhenAiOiIzODk3Nzc5MzUyMC11NTFiNWtwdmtmdW9rcDJldjl2YjN2bGxma2w2b2Fxby5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsImF1ZCI6IjM4OTc3NzkzNTIwLXU1MWI1a3B2a2Z1b2twMmV2OXZiM3ZsbGZrbDZvYXFvLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTAyMzExMDcxODkwNzE4NTkxNDQ2IiwiZW1haWwiOiJkY3ZlenphbmlAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiJlRG9nM1RTV1hMaEFmVjhibnVnWlRnIiwiZXhwIjoxNTE4MTAyNzM2LCJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwianRpIjoiMWM2NTYwYjNhNmI4NzY1Y2FlOGJiMDNjNmI4YWQwNjFmMTRhOTMwNSIsImlhdCI6MTUxODA5OTEzNiwibmFtZSI6IkRhdmlkIFZlenphbmkiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDQuZ29vZ2xldXNlcmNvbnRlbnQuY29tLy0tdXhDTW9vZlcyOC9BQUFBQUFBQUFBSS9BQUFBQUFBQUFBQS9BQ1NJTGpYNnUwUnM1c3UydTZ3VGdSYlhCNXlUUGlXM2xBL3M5Ni1jL3Bob3RvLmpwZyIsImdpdmVuX25hbWUiOiJEYXZpZCIsImZhbWlseV9uYW1lIjoiVmV6emFuaSIsImxvY2FsZSI6ImVuIn0.iNMKjU6GMzIcAoLQ1zWIXkdwO7fk-y9D3vMmgfz0GklbKLnp51Zhkeb7AKTR99uJmYiJ5NfOYTBtdGEE8ESHXQOzUt4ZndHlMCkxQcJyiXEBW0CKrI_P7522c_ILNL1L0VlUEnnvVdHGCPclF0CV7ZgR6pNcCPMMVWugetRbT4cvBe4JYrkD1FKmLkYZfpZSADMzN7lJfP83fSt6tdtzwXnvjkan00m6k5jmw4wjE4olQRJluoqO0T1SKMqBzL2cOEz6Bads3Ryo9JATf-POGX-rZ6GoSwTp_P8rS11-NXYU8w73Mk6hFEz1fuw7Bi_Yi6hUQ4HljoA0WwxMljFJ9Q

*/
