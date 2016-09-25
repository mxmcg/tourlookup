import { Meteor } from 'meteor/meteor';

const User = class User {

  constructor(properties) {
    this.properties = properties;
    this.inspectIncomingUser();
  }

  inspectIncomingUser() {
    const sid = Random.id([20]);
    const uid = Random.id([20]);
    const cookieValue = this.getCookie('uid');
    let options = {
      sid,
      uid: cookieValue,

    }
    console.log(navigator.userAgent)
    if (cookieValue) {  
      Meteor.call('addNewSession', options, function (err, res) {
        if (err) {
          return err;
        } else {
          
        }
      });

    } else {
      this.createCookie('uid', uid, 90);
      this.createCookie('sid', sid, 90);
    } 
  }

  getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
  }

  createCookie(name, value, days) {
    var date, expires;
    if (days) {
        date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        expires = "; expires="+date.toGMTString();
    } else {
        expires = "";
    }
    document.cookie = name+"="+value+expires+"; path=/";
	}

};

module.exports = {
  User
};