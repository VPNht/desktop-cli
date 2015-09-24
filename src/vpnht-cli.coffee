{spawn} = require 'child_process'
path = require 'path'

_ = require 'lodash'
colors = require 'colors'
yargs = require 'yargs'
wordwrap = require 'wordwrap'

config = require './vpnht'

commandClasses = [
  require './ipv6'
]

commands = {}
for commandClass in commandClasses
  for name in commandClass.commandNames ? []
    commands[name] = commandClass

parseOptions = (args=[]) ->
  options = yargs(args).wrap(100)
  options.usage """

    vpnht - VPN.ht Command Line Manager

    Usage: vpnht <command>

    where <command> is one of:
    #{wordwrap(4, 80)(Object.keys(commands).sort().join(', '))}.

    Run `vpnht help <command>` to see the more details about a specific command.
  """
  options.alias('v', 'version').describe('version', 'Print the vpnht-cli version')
  options.alias('h', 'help').describe('help', 'Print this usage message')
  options.boolean('color').default('color', true).describe('color', 'Enable colored output')
  options.command = options.argv._[0]
  for arg, index in args when arg is options.command
    options.commandArgs = args[index+1..]
    break
  options

showHelp = (options) ->
  return unless options?

  help = options.help()
  if help.indexOf('Options:') >= 0
    help += "\n  Prefix an option with `no-` to set it to false such as --no-color to disable"
    help += "\n  colored output."

  console.error(help)

printVersions = (args, callback) ->
  cliVersion =  require('../package.json').version ? ''
  nodeVersion = process.versions.node ? ''

  if args.json
    versions =
      vpnhtcli: cliVersion
      node: nodeVersion

    console.log JSON.stringify(versions)
  else
    versions =  """
      #{'vpnhtcli'.red}  #{cliVersion.red}
      #{'node'.green}  #{nodeVersion.green}
    """

    console.log versions
  callback()

module.exports =
  run: (args, callback) ->
    options = parseOptions(args)

    unless options.argv.color
      colors.setTheme
        blue: 'stripColors'
        cyan: 'stripColors'
        green: 'stripColors'
        magenta: 'stripColors'
        red: 'stripColors'
        yellow: 'stripColors'
        rainbow: 'stripColors'

    callbackCalled = false
    options.callback = (error) ->
      return if callbackCalled
      callbackCalled = true
      if error?
        if _.isString(error)
          message = error
        else
          message = error.message ? error

        if message is 'canceled'
          # A prompt was canceled so just log an empty line
          console.log()
        else if message
          console.error(message.red)
      callback?(error)

    args = options.argv
    command = options.command
    if args.version
      printVersions(args, options.callback)
    else if args.help
      if Command = commands[options.command]
        showHelp(new Command().parseOptions?(options.command))
      else
        showHelp(options)
      options.callback()
    else if command
      if command is 'help'
        if Command = commands[options.commandArgs]
          showHelp(new Command().parseOptions?(options.commandArgs))
        else
          showHelp(options)
        options.callback()
      else if Command = commands[command]
        new Command().run(options)
      else
        options.callback("Unrecognized command: #{command}")
    else
      showHelp(options)
      options.callback()
