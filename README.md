# jy

A very simple JSON, JSON5 and YAML parser.

```
$ jy --help
jy [infile] [outfile]

JSON to YAML parsers, plus more formats

Positionals:
  infile   Read from input. If not exists, assume to be from previous pipe.
                                                                        [string]
  outfile  Write to output. If not exists, write to stdout.             [string]

Options:
      --help     Show help                                             [boolean]
      --version  Show version number                                   [boolean]
  -i, --input    Input format. Inferred from filename, or assume JSON.
                                                      [string] [default: "json"]
  -f, --format   Output format. Inferred from filename, or assume JSON.
                                                      [string] [default: "json"]
  -o, --options  Outputting options, in JSON, or JavaScript (evaluated with
                 safe-eval)                                             [string]
```

## Installation

NPM allows installation from GitHub with a shorthand syntax.

```sh
npm i -g patarapolw/jy
# npm i -g patarapolw/jy@version
```

## Another website implementation

I find a decent website implementation to be <https://toolkit.site/format.html>

## Note on JSON format

Indeed, JSON can be parsed further programmatically with [jq](https://stedolan.github.io/jq/).

## Note on JSON5 format

It is an extended JSON format, which

- By default, resembles JavaScript standard style
- Can parse JSONC (JSON with comments), which is used in `tsconfig.json`

## Naming

The name comes from backward of a Golang module -- [sclevine/yj](https://github.com/sclevine/yj).
