#!/usr/bin/env node
const fs = require('fs-extra')
const execa = require('execa')
const path = require('path')

const package = require(path.join(__dirname, '../package.json'))
const wd = path.join(__dirname, '../standalone')
const v = package.version
const { name } = package

const plats = ['macos', 'win.exe', 'linux']
const repo = 'github.com/jondot/homebrew-tap'
const opts = { shell: true }

const main = async () => {
  for (const plat of plats) {
    console.log(`standalone: packing ${plat}`)
    const file = `${name}-${plat}`

    await fs.remove(`${wd}/tar-${file}`)
    await fs.mkdir(`${wd}/tar-${file}`)
    // give Windows special treatment: it should be a zip file and keep an .exe suffix
    if (plat === 'win.exe') {
      await fs.move(`${wd}/${file}`, `${wd}/tar-${file}/pinion.exe`)
      await execa.command(
        `cd ${wd}/tar-${file} && zip ../pinion.${plat}.v${v}.zip pinion.exe`,
        opts,
      )
    } else {
      await fs.move(`${wd}/${file}`, `${wd}/tar-${file}/pinion`)
      await execa.command(
        `cd ${wd}/tar-${file} && tar -czvf ../pinion.${plat}.v${v}.tar.gz pinion`,
        opts,
      )
    }
    await fs.remove(`${wd}/tar-${file}`)
  }

  console.log('standalone: done.')
  console.log((await execa.command(`ls ${wd}`, opts)).stdout)

  console.log('standalone: publishing to homebrew tap...')
  const matches = (
    await execa.command(`shasum -a 256 ${wd}/pinion.macos.v${v}.tar.gz`, opts)
  ).stdout.match(/([a-f0-9]+)\s+/)
  console.log(matches)
  if (matches && matches.length > 1) {
    const sha = matches[1]
    await fs.writeFile('/tmp/pinion.rb', brewFormula(sha, v))
    const cmd = [
      `cd /tmp`,
      `git clone git://${repo} brew-tap`,
      `cd brew-tap`,
      `mv /tmp/pinion.rb .`,
      `git config user.email hello@feathersjs.com`,
      `git config user.name 'Feathers Contributor'`,
      `git add .`,
      `git commit -m 'pinion: auto-release'`,
      `git push https://${process.env.GITHUB_TOKEN}@${repo}`,
    ].join(' && ')
    console.log(await execa.command(cmd, opts).stdout)

    console.log('standalone: publish done.')
  }
}

const brewFormula = (sha, ver) => `
VER = "${ver}"
SHA = "${sha}"

class Pinion < Formula
  desc "The scalable code generator that saves you time."
  url "https://github.com/feathersjs/pinion/releases/download/v#{VER}/pinion.macos.v#{VER}.tar.gz"
  version VER
  sha256 SHA

  def install
    bin.install "pinion"
  end
end
`
main()
