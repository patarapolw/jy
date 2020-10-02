// @ts-check

const fs = require('fs')

const eval = require('safe-eval')
const json5 = require('json5')
const yargs = require('yargs')
const yaml = require('js-yaml')

const pkg = require('./package.json')

async function main() {
  /**
   * @type {{argv: {
   *  infile?: string
   *  outfile?: string
   *  input?: string
   *  format?: string
   *  options?: string
   * }}}
   */
  const { argv } = yargs
    .scriptName(Object.keys(pkg.bin)[0])
    .version(pkg.version)
    // @ts-ignore
    .usage('$0 [infile] [outfile]', pkg.description, (y) => {
      y.positional('infile', {
        describe:
          'Read from input. If not exists, assume to be from previous pipe.',
        type: 'string',
      }).positional('outfile', {
        describe: 'Write to output. If not exists, write to stdout.',
        type: 'string',
      })
    })
    .option('input', {
      alias: 'i',
      describe: 'Input format. Inferred from filename, or assume JSON.',
      type: 'string',
      default: 'json',
    })
    .option('format', {
      alias: 'f',
      describe: 'Output format. Inferred from filename, or assume JSON.',
      type: 'string',
      default: 'json',
    })
    .option('options', {
      alias: 'o',
      describe:
        'Outputting options, in JSON, or JavaScript (evaluated with safe-eval)',
      type: 'string',
    })

  let inputText = ''

  if (argv.infile) {
    inputText = fs.readFileSync(argv.infile, 'utf-8')
  } else {
    inputText = await new Promise((resolve, reject) => {
      const chunks = []
      process.stdin
        .on('readable', () => {
          const chunk = process.stdin.read()
          chunks.push(chunk)
          if (chunk !== null) {
            const result = Buffer.concat(chunks)
            resolve(result.toString())
          }
        })
        .once('error', reject)
    })
  }

  if (argv.infile) {
    argv.input = (argv.infile.toLocaleLowerCase().match(/\.([a-z]+)$/) || [])[1]
  } else {
    argv.input = argv.input.toLocaleLowerCase()
  }

  let inter = /** @type {any} */ (null)

  if (argv.input === 'yaml') {
    inter = yaml.load(inputText)
  } else if (argv.input === 'json5') {
    inter = json5.parse(inputText)
  } else {
    inter = JSON.parse(inputText)
  }

  let opts = /** @type {any} */ (null)

  if (argv.options) {
    opts = eval(argv.options)
  }

  if (opts && typeof opts === 'object') {
    if (!Array.isArray(opts)) {
      opts = [opts]
    }
  } else {
    opts = [opts]
  }

  if (argv.outfile) {
    argv.format = (argv.outfile.toLocaleLowerCase().match(/\.([a-z]+)$/) ||
      [])[1]
  } else {
    argv.format = argv.format.toLocaleLowerCase()
  }

  let outputText = ''

  if (argv.format === 'yaml') {
    outputText = yaml.dump(inter, ...opts)
  } else if (argv.format === 'json5') {
    outputText = json5.stringify(inter, ...opts)
  } else {
    outputText = JSON.stringify(inter, ...opts)
  }

  if (argv.outfile) {
    fs.writeFileSync(argv.outfile, outputText)
  } else {
    process.stdout.write(outputText)
  }
}

if (require.main === module) {
  main().catch((e) => {
    throw e
  })
}
