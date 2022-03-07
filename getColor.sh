#!/bin/bash

# export PATH=~/miniforge3/bin:~/miniforge3/condabin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
# bash getColor.sh img/BG.jpeg result1.csv

source ~/miniforge3/etc/profile.d/conda.sh
conda activate kokoro

cd ~/Projects/kokoro-server/FW2022
python fuzzy.py ${1} ${2}