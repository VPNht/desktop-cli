(function() {
  var Command, Ipv6, yargs,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Command = require('./command');

  yargs = require('yargs');

  module.exports = Ipv6 = (function(_super) {
    __extends(Ipv6, _super);

    function Ipv6() {
      return Ipv6.__super__.constructor.apply(this, arguments);
    }

    Ipv6.commandNames = ['ipv6'];

    Ipv6.prototype.parseOptions = function(argv) {
      var options;
      options = yargs(argv).wrap(100);
      options.usage("\nUsage: vpnht ipv6\n\nShow IPV6 current status\n\nRun `vpnht ipv6` to see current ipv6 status.");
      options.alias('h', 'help').describe('help', 'Print this usage message');
      options.boolean('enable').describe('enable', 'Try to enable IPV6');
      return options.boolean('disable').describe('disable', 'Try to disable IPV6');
    };

    Ipv6.prototype.run = function(options) {
      var callback;
      callback = options.callback;
      options = this.parseOptions(options.commandArgs);
      if (options.argv.enable) {
        console.log("Enable");
        callback();
      } else if (options.argv.disable) {
        console.log("Disable");
        callback();
      }
      console.log("Show current state");
      return callback();
    };

    return Ipv6;

  })(Command);

}).call(this);
