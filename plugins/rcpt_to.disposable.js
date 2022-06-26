// rcpt_to.disposable

// documentation via: haraka -c /Users/swetashaw/Work/Questbook/haraka/haraka_test -h plugins/rcpt_to.disposable

// Put your plugin code here
// type: `haraka -h Plugins` for documentation on how to create a plugin

exports.hook_rcpt = function (next, connection, params) {
    var rcpt = params[0];
    this.loginfo("Got recipient: " + rcpt);
    
    // Check user matches regex 'user-YYYYMMDD':
    var match = /^(.*)-(\d{4})(\d{2})(\d{2})$/.exec(rcpt.user);
    if (!match) {
        this.loginfo("Date did not match")
        return next();
    }
    
    // get date - note Date constructor takes month-1 (i.e. Dec == 11).
    var expiry_date = new Date(match[2], match[3]-1, match[4]);
    
    this.loginfo("Email expires on: " + expiry_date);

    var today = new Date();
    
    if (expiry_date < today) {
        // If we get here, the email address has expired
        return next(DENY, "Expired email address");
    }
    
    // now get rid of the extension:
    rcpt.user = match[1];
    this.loginfo("Email address now: " + rcpt);
    
    next();
}