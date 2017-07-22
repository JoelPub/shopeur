#!/usr/bin/env bash

options=("Build Android" "Build iOS" "Build Android and iOS" "Ripple Emulator" "Android Simulator" "iOS Simulator" "Run on Android Device" "Run on iOS Device" "Remove all (removes plugins and platforms)" "Prepare 'www'" "Update plugins" "Exit")
width=30
cols=3

buildAndInject() {
  gulp -b
  gulp inject:version -b
}

addAndBuildPlatform() {
  if [[ "$1" ]]
  then
    ionic platform add "$1"
    ionic build "$1"
  else
    ionic platform add android
    ionic platform add ios
    ionic build android
    ionic build ios
  fi
}

removeAll() {
  cordova plugins | grep -Eo '^[^ ]+' | while read line
  do
    ionic plugin remove $line --force
  done

  ionic platform remove android
  ionic platform remove ios
}

for ((i = 0; i < ${#options[@]}; i++)); do
  string="$(($i+1))) ${options[$i]}"
  printf "%s" "$string"
  printf "%$(($width-${#string}))s" " "
  [[ $(((i + 1) % $cols)) -eq 0 ]] && echo
done

while true; do
  echo
  read -p '#? ' opt
  case $opt in
    1)
      echo "${options[$opt-1]}"
      buildAndInject
      addAndBuildPlatform android
      echo "${options[$opt-1]} finished..."
      break
      ;;

    2)
      echo "${options[$opt-1]}"
      buildAndInject
      addAndBuildPlatform ios
      echo "${options[$opt-1]} finished..."
      break
      ;;

    3)
      echo "${options[$opt-1]}"
      buildAndInject
      addAndBuildPlatform
      echo "${options[$opt-1]} finished..."
      break
      ;;

    4)
      echo "${options[$opt-1]}"
      gulp ripple
      break
      ;;

    5)
      echo "${options[$opt-1]}"
      gulp -e android
      break
      ;;

    6)
      echo "${options[$opt-1]}"
      gulp -e ios
      break
      ;;

    7)
      echo "${options[$opt-1]}"
      ionic run android -c --debug --device
      break
      ;;

    8)
      echo "${options[$opt-1]}"
      ionic run ios
      break
      ;;

    9)
      echo "${options[$opt-1]}"
      removeAll
      echo "${options[$opt-1]} done..."
      break
      ;;

    10)
      echo "${options[$opt-1]}"
      buildAndInject
      echo "${options[$opt-1]} finished..."
      break
      ;;

    11)
      echo "${options[$opt-1]}"
      cordova plugins | grep -Eo '^[^ ]+' | while read line
      do
        ionic plugin remove $line --save --force
        ionic plugin add $line --save
      done
      echo "${options[$opt-1]} finished..."
      break
      ;;

    12)
      echo "Exit..."
      break
      ;;

  esac
done