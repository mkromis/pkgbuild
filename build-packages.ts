#!/usr/bin/env -S vite-node --script
// https://wiki.archlinux.org/index.php/DeveloperWiki:Building_in_a_Clean_Chroot
// https://google.github.io/zx/typescript

import 'node:fs'
import ct from 'chalk-template'
import 'zx/globals';

// Change this to a directory of your choosing.
// Your repo name and path
const root = path.resolve('.');
const repo=path.resolve("../kitsune_repo/x86_64")
console.log(`Root: ${root}`)
console.log(`Dest: ${repo}`)

// Ideally there will be 2 options for compiling
// 1. chroot"   (Default)
// 2. makepkg"

// #which packages are always going to be build with makepkg or chroot, this should be stored as a json file
// maybe in the future if needed.
const dirs = ScanDirs()
await BuildPackages(dirs)
BuildDone()

/**
 * List of directories except the ones we don't want
 * @returns list of directories
 */
function ScanDirs() : Array<string> {
  let result = new Array<string>()
  const skipFiles = ['.git', 'node_modules']

  fs.readdirSync('.').forEach((file: string) => {
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

/**
 * Builds each package given the array of directories
 * @param dirs directories as string to parse
 */
function BuildPackages(dirs: Array<string>) {
  // This is a list of dirs to process
  dirs.forEach( dir => {
    // We would do a check to see if we are needing a 
    // chroot build or just a makepkg build.
    // Assuming just a makepkg build for now.
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

/**
 * Tries to build package in a chroot environment
 * @param path Directory of package to build
 */
async function ChrootBuild(path: string) {
  echo(ct`{green
#############################################################################################
#########        Let us build the package in CHROOT
#########        {blue ${path}}
#############################################################################################
  }`)
  //CHROOT=$HOME/Documents/chroot-data
  await $`arch-nspawn ${path}/root pacman -Syu`
  await $`makechrootpkg -c -r ${path}`
}

/**
 * Basic directory build via makepkg
 * @param path Directory to build package
 */
async function MakepkgBuild(path: string) {
  echo(ct`{yellow
#############################################################################################
#########        Let us build the package with MAKEPKG
#########        {blue ${path}}
#############################################################################################
  }`)
  cd (path)
  await $`makepkg -sc`
  MovePackages(path)
  cd (root)
}

/**
 * Moves packages to destination folder
 * @param path Path of directory where packages exist
 */
async function MovePackages(path: string) {
  echo(ct`{green
#############################################################################################
#########        Moving created files to...
#########        {blue ${repo}}
#############################################################################################
  }`)
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

/**
 * Done banner
 */
async function BuildDone() {
  echo(ct`{greenBright
#############################################################################################
###################                       build done                   ######################
#############################################################################################
  }`)
}