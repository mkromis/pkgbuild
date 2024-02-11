#!/usr/bin/env -S vite-node --script
// https://wiki.archlinux.org/index.php/DeveloperWiki:Building_in_a_Clean_Chroot
// https://google.github.io/zx/typescript

import 'node:fs'
import 'zx/globals';

// Change this to a directory of your choosing.
// Your repo name and path
const root = path.resolve('.');
const repo=path.resolve("../kitsune_repo/x86_64")
console.log(`Root: ${root}`)
console.log(`Destination: ${repo}`)

// Ideally there will be 2 options for compiling
// 1. chroot"   (Default)
// 2. makepkg"

// #which packages are always going to be build with makepkg or chroot, this should be stored as a json file
// maybe in the future if needed.
const dirs = ScanDirs()
await BuildPackages(dirs)

// List of directories except the ones we don't want
function ScanDirs() : Array<string> {
  let result = new Array<string>()
  const skipFiles = ['.git', 'node_modules']

  fs.readdirSync('.').forEach(file => {
    // Skip invalid dirs,
    if (skipFiles.includes(file)) {return}

    // full path
    const dirPath = path.resolve(file);

    // if not directory skip
    if (!fs.lstatSync(dirPath).isDirectory()) { return }

    result.push(dirPath);
  })
  return result;
}

function BuildPackages(dirs: Array<string>) {
  // This is a list of dirs to process
  dirs.forEach( dir => {
    // We would do a check to see if we are needing a 
    // chroot build or just a makepkg build.
    // Assuming just a chroot build for now.
    MakepkgBuild(dir);
  })
}
// for i in $makepkglist
// do
//   if [[ "$pwd" == "$i" ]] ; then
//   CHOICE=2
//   fi
// done

// search1=$(basename "$PWD")
// search2=arcolinux

// search=$search1
// rm -rf /tmp/tempbuild
// if test -f "/tmp/tempbuild"; then
//   rm /tmp/tempbuild
// fi
// mkdir /tmp/tempbuild
// cp -r $pwdpath/* /tmp/tempbuild/

// cd /tmp/tempbuild/

async function ChrootBuild(path: string) {
  await $`tput setaf 2`
  echo `#############################################################################################`
  echo `#########        Let us build the package in CHROOT "${path}`
  echo `#############################################################################################`
  await $`tput sgr0`
  //CHROOT=$HOME/Documents/chroot-data
  await $`arch-nspawn ${path}/root pacman -Syu`
  await $`makechrootpkg -c -r ${path}`
}

async function MakepkgBuild(path: string) {
  await $`tput setaf 3`
  echo `#############################################################################################`
  echo `#########        Let us build the package with MAKEPKG ${path}`
  echo `#############################################################################################`
  await $`tput sgr0`
  cd (path)
  //await $`makepkg -sc`
  MovePackages(path)
}

async function MovePackages(path: string) {
  echo `#############################################################################################`
  echo `#########        Moving created files to ${repo}`
  echo `#############################################################################################`
  await $`mv ${path}/*pkg.tar.zst ${repo}`
}

// echo "Cleaning up"
// echo "#############################################################################################"
// echo "deleting unnecessary folders"
// echo "#############################################################################################"

// if [[ -f $wpdpath/*.log ]]; then
//   rm $pwdpath/*.log
// fi
// if [[ -f $wpdpath/*.deb ]]; then
//   rm $pwdpath/*.deb
// fi
// if [[ -f $wpdpath/*.tar.gz ]]; then
//   rm $pwdpath/*.tar.gz
// fi

async function BuildDone() {
  await $`tput setaf 10`
  echo `#############################################################################################`
  echo `###################                       build done                   ######################`
  echo `#############################################################################################`
  await $`tput sgr0`
}