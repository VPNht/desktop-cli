(function() {
  var colors, commandClass, commandClasses, commands, config, name, parseOptions, path, printVersions, showHelp, spawn, wordwrap, yargs, _, _i, _j, _len, _len1, _ref, _ref1;

  spawn = require('child_process').spawn;

  path = require('path');

  _ = require('lodash');

  colors = require('colors');

  yargs = require('yargs');

  wordwrap = require('wordwrap');

  config = require('./vpnht');

  commandClasses = [require('./ipv6')];

  commands = {};

  for (_i = 0, _len = commandClasses.length; _i < _len; _i++) {
    commandClass = commandClasses[_i];
    _ref1 = (_ref = commandClass.commandNames) != null ? _ref : [];
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      name = _ref1[_j];
      commands[name] = commandClass;
    }
  }

  parseOptions = function(args) {
    var arg, index, options, _k, _len2;
    if (args == null) {
      args = [];
    }
    options = yargs(args).wrap(100);
    options.usage("\nvpnht - VPN.ht Command Line Manager\n\nUsage: vpnht <command>\n\nwhere <command> is one of:\n" + (wordwrap(4, 80)(Object.keys(commands).sort().join(', '))) + ".\n\nRun `vpnht help <command>` to see the more details about a specific command.");
    options.alias('v', 'version').describe('version', 'Print the vpnht-cli version');
    options.alias('h', 'help').describe('help', 'Print this usage message');
    options.boolean('color')["default"]('color', true).describe('color', 'Enable colored output');
    options.command = options.argv._[0];
    for (index = _k = 0, _len2 = args.length; _k < _len2; index = ++_k) {
      arg = args[index];
      if (!(arg === options.command)) {
        continue;
      }
      options.commandArgs = args.slice(index + 1);
      break;
    }
    return options;
  };

  showHelp = function(options) {
    var help;
    if (options == null) {
      return;
    }
    help = options.help();
    if (help.indexOf('Options:') >= 0) {
      help += "\n  Prefix an option with `no-` to set it to false such as --no-color to disable";
      help += "\n  colored output.";
    }
    return console.error(help);
  };

  printVersions = function(args, callback) {
    var cliVersion, nodeVersion, versions, _ref2, _ref3;
    cliVersion = (_ref2 = require('../package.json').version) != null ? _ref2 : '';
    nodeVersion = (_ref3 = process.versions.node) != null ? _ref3 : '';
    if (args.json) {
      versions = {
        vpnhtcli: cliVersion,
        node: nodeVersion
      };
      console.log(JSON.stringify(versions));
    } else {
      versions = "" + 'vpnhtcli'.red + "  " + cliVersion.red + "\n" + 'node'.green + "  " + nodeVersion.green;
      console.log(versions);
    }
    return callback();
  };

  module.exports = {
    run: function(args, callback) {
      var Command, callbackCalled, command, options, _base, _base1;
      options = parseOptions(args);
      if (!options.argv.color) {
        colors.setTheme({
          blue: 'stripColors',
          cyan: 'stripColors',
          green: 'stripColors',
          magenta: 'stripColors',
          red: 'stripColors',
          yellow: 'stripColors',
          rainbow: 'stripColors'
        });
      }
      callbackCalled = false;
      options.callback = function(error) {
        var message, _ref2;
        if (callbackCalled) {
          return;
        }
        callbackCalled = true;
        if (error != null) {
          if (_.isString(error)) {
            message = error;
          } else {
            message = (_ref2 = error.message) != null ? _ref2 : error;
          }
          if (message === 'canceled') {
            console.log();
          } else if (message) {
            console.error(message.red);
          }
        }
        return typeof callback === "function" ? callback(error) : void 0;
      };
      args = options.argv;
      command = options.command;
      if (args.version) {
        return printVersions(args, options.callback);
      } else if (args.help) {
        if (Command = commands[options.command]) {
          showHelp(typeof (_base = new Command()).parseOptions === "function" ? _base.parseOptions(options.command) : void 0);
        } else {
          showHelp(options);
        }
        return options.callback();
      } else if (command) {
        if (command === 'help') {
          if (Command = commands[options.commandArgs]) {
            showHelp(typeof (_base1 = new Command()).parseOptions === "function" ? _base1.parseOptions(options.commandArgs) : void 0);
          } else {
            showHelp(options);
          }
          return options.callback();
        } else if (Command = commands[command]) {
          return new Command().run(options);
        } else {
          return options.callback("Unrecognized command: " + command);
        }
      } else {
        showHelp(options);
        return options.callback();
      }
    }
  };

}).call(this);
