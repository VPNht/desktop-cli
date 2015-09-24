# vpnht-cli

## Building
  * Clone the repository
  * Run `npm install`
  * Run `grunt` to compile the CoffeeScript code

## Using

Run `vpnht help` to see all the supported commands and `vpnht help <command>` to
learn more about a specific command.

## Main idea

The main idea behind that is to allow to exposer a CLI interface to the desktop application.

We can run admin command without having to expose the whole application to the administrator level.

## Sample command

  * Running `/Applications/VPN.ht.app/Contents/Resources/bin/vpnht ipv6 --disable` will automatically disable the IPV6 interface with the right administration level.
