Command = require './command'
yargs = require 'yargs'

module.exports =
class Ipv6 extends Command
  @commandNames: ['ipv6']

  parseOptions: (argv) ->
    options = yargs(argv).wrap(100)
    options.usage """

      Usage: vpnht ipv6

      Show IPV6 current status

      Run `vpnht ipv6` to see current ipv6 status.
    """
    options.alias('h', 'help').describe('help', 'Print this usage message')
    options.boolean('enable').describe('enable', 'Try to enable IPV6')
    options.boolean('disable').describe('disable', 'Try to disable IPV6')

  run: (options) ->
    {callback} = options
    options = @parseOptions(options.commandArgs)

    if options.argv.enable
      console.log "Enable"
      callback()

    else if options.argv.disable
      console.log "Disable"
      callback()

    console.log "Show current state"
    callback()
