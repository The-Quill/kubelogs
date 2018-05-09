# `kubelogs`

a CLI tool to print multiple kubernetes pod logs at once.

## Installation

`npm i -g kubelogs`

## Usage

`kubelogs -h`:

    usage: kubelogs
      [-h|--help]: get help
      -f: continue to print logs
      --tail: only print the last <input> lines of the log
      --thin: don't print empty lines

      list out the names of the services/deployments/pods you want to log

      Examples:
        kubelogs -f api websockets
        kubelogs -f --tail=1 api
        kubelogs --thin
        kubelogs --help