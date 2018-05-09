#!/usr/bin/env node

const { spawn, exec } = require('child_process');
const colors = require('colors')

const args = require('minimist')(process.argv.slice(2))
let constant = false
if (args.f){
  constant = true
}
if (args.help || args.h){
  console.log(`usage: kubelogs
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
`)
  process.exit(0)
}
let pods = []
// console.log(args)

const getColor = (id) => {
  const colors = [
    text => text.green,
    text => text.red,
    text => text.yellow,
    text => text.blue,
    text => text.magenta,
    text => text.cyan,
    text => text.white,
    text => text.green.underline,
    text => text.red.underline,
    text => text.yellow.underline,
    text => text.blue.underline,
    text => text.magenta.underline,
    text => text.cyan.underline,
    text => text.white.underline,
  ]
  let index = pods.indexOf(id)
  if (index === -1) process.exit(0)
  if (index => colors.length) index %= colors.length
  let length = Math.max.apply(null, pods.map(podName => podName.length))
  return `${colors[index](id.toString())}${id.padEnd(length).replace(id, '')} ${colors[index]('|')}`
}

const print = (id, line) => {
  if (line.trim().length === 0 && args.thin) return
  console.log(`${getColor(id)} ${line.replace('\n', '')}`)
}

exec('kubectl get pods | tail -n +2 | grep -oE \'^[^ ]+\'', (err, stdout, stderr) => {
  if (err){
    console.error(err)
  }
  pods = stdout.trim().split('\n')
  if (args._.length !== 0){
    pods = pods.filter(pod => args._.map(arg => pod.startsWith(arg)).includes(true))
  }
  pods.forEach(pod => {
    const tail = args.hasOwnProperty('tail') ? `--tail=${args.tail}` : null
    const child = spawn('kubectl', ['logs', constant ? '-f' : null, tail, pod].filter(i => i !== null));

    child.stdout.on('data', (chunk) => {
      // data from standard output is here as buffers
      let string = chunk.toString('utf-8')
      string.split(/[\r\n]{1,}/).forEach(line => print(pod, line))
    });

    // since these are streams, you can pipe them elsewhere
    // child.stderr.pipe(dest);

    child.on('close', (code) => {
      if (constant) console.log(`${pod} exited with code ${code}`);
    });
  })
})