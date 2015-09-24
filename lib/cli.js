(function() {
  var vpnht;

  vpnht = require('./vpnht-cli');

  vpnht.run(process.argv.slice(2), function(error) {
    var code, exit;
    code = error != null ? 1 : 0;
    if (process.platform === 'win32') {
      exit = require('exit');
      return exit(code);
    } else {
      return process.exit(code);
    }
  });

}).call(this);
