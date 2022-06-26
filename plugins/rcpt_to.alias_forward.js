// rcpt_to.alias_forward

// documentation via: haraka -c /Users/swetashaw/Work/Questbook/haraka/haraka_test -h plugins/rcpt_to.alias_forward

// Put your plugin code here
// type: `haraka -h Plugins` for documentation on how to create a plugin
let Address = require('address-rfc2821').Address,
  util = require('util');

exports.register = function () {
  this.register_hook('rcpt', 'alias_forward');
};

exports.alias_forward = function(next, connection, params) {
    this.loginfo('in forward hooks')
  let
    plugin = this,
    aliases = this.config.get('rcpt_to.alias_forward', 'json') || {},
    rcpt = params[0],
    list;

  if(aliases[rcpt.host] && (aliases[rcpt.host][rcpt.user] || aliases[rcpt.host]["*"])) {
    list = aliases[rcpt.host][rcpt.user] || aliases[rcpt.host]["*"];
    this.loginfo('list', list)
    if(!(list.constructor === Array))
      list = [ list ];
    connection.transaction.rcpt_to.pop();
    connection.relaying = true;
    list.forEach(function(address) {
      plugin.loginfo('Relaying to: ' + address);
      connection.transaction.rcpt_to.push(new Address('<' + address + '>'));
    });
    return next(OK);
  }
  next(DENY);
};

