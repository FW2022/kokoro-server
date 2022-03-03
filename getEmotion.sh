#!/bin/bash

# export PATH=~/miniforge3/bin:~/miniforge3/condabin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

source /home/jeonghun/miniforge3/etc/profile.d/conda.sh
conda activate fer

cd /home/jeonghun/SSUstagram/EFFL/
python main_esr9.py image -i ../public/${1} -o ../public/