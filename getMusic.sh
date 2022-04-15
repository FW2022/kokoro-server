#!/bin/bash

# export PATH=~/miniforge3/bin:~/miniforge3/condabin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
# bash getColor.sh img/BG.jpeg result1.csv

source ~/miniforge3/etc/profile.d/conda.sh
conda activate kokoro

cd ~/Projects/kokoro-server/music
python music.py ${1}

# ${1} = 60,62,64,65,67,69,71,72,74,76,77,79,81,83,84,84,86,88,89,91,93,95,96,98,100