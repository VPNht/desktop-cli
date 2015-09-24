(function() {
  var child_process, path, semver;

  child_process = require('child_process');

  path = require('path');

  semver = require('semver');

  module.exports = {
    getHomeDirectory: function() {
      if (process.platform === 'win32') {
        return process.env.USERPROFILE;
      } else {
        return process.env.HOME;
      }
    }
  };

}).call(this);
