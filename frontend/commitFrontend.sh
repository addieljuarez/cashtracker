#!/bin/bash

# This script is used to generate the list of all the files in the repository

git status
git add -A .
git status 
read -p "Enter the commit message: " message
git commit -am "fromtend - $message"
git status

# read -p "Enter the branch name: " branch
git push origin main

git status
exit 0
