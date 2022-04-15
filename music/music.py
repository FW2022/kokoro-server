import pygame.midi
from midiutil.MidiFile import MIDIFile
import pygame
from midi2audio import FluidSynth
from collections.abc import Iterable
from tensorflow.keras.models import load_model
import sys

# import IPython.display
import os
import pandas as pd
import numpy as np
import librosa
import librosa.display
import matplotlib.pyplot as plt
import matplotlib.style as style
import seaborn as sns
# import regex
from tqdm import tqdm
from sklearn.preprocessing import StandardScaler
from ast import literal_eval
from sklearn.svm import SVC
from sklearn.model_selection import train_test_split
# from funcs import *

pressed = []
state = False


def calc_rms(x, hop_length=256, frame_length=512):
    rms = librosa.feature.rms(
        x, frame_length=frame_length, hop_length=hop_length, center=True)
    return rms


def calc_energy(x, hop_length=256, frame_length=512):
    hop_length = hop_length
    frame_length = frame_length

    # Calculation for energy
    energy = np.array([
        sum(abs(x[i:i + frame_length] ** 2))
        for i in range(0, len(x), hop_length)
    ])
    return energy


def calc_mfcc(x, sr, n_mfcc=26):
    # librosa has a built in method for calculating mfcc
    return librosa.feature.mfcc(x, sr=sr, n_mfcc=n_mfcc).T


def readInput(input_device, channel):
    count = 0
    degrees = []  # MIDI note number
    while True:
        if input_device.poll():
            # [state, note(음), velocity(속도), something(always 0 for me)]
            event = input_device.read(1)[0]
            # print(event)
            # print("//")
            data = event[0]
            # print(data)
            timestamp = event[1]
            note = event[0][1]
            print(note)
            degrees.append(event[0][1])
            count += 1
            '''' # [state, note, velocity, something(always 0 for me)]
            if data[0] == 128 + channel:  # note off on channel data[0]-128
                if data[1] in pressed:
                    pressed.remove(data[1])
            if data[0] == 144 + channel:  # note on on channel data[0]-144
                if not data[1] in pressed:
                    pressed.append(data[1])
            if all(el in pressed for el in [36, 40, 43, 46]):
                print("chord = Cmaj7")
                '''
            if count % 2 == 0:
                degrees.pop()
        if count == 50:
            print(degrees)
            midi_generator(degrees)
            break


# https://midiutil.readthedocs.io/en/1.2.1/를 들어가서 git clone 후 setup.py 설치 요망
def midi_generator(degrees):
    # degrees = [] # MIDI note number
    track = 0
    channel = 1  # piano
    time = 0  # In beats
    duration = 1  # In beats
    tempo = 120  # In BPM , base = 60
    volume = 100  # 0-127, as per the MIDI standard
    MyMIDI = MIDIFile(1)  # One track, defaults to format 1 (tempo track
    # automatically created)
    MyMIDI.addTempo(track, time, tempo)
    for pitch in degrees:
        MyMIDI.addNote(track, channel, pitch, time, duration, volume)
        time = time + 1
    with open("major-scale.mid", "wb") as output_file:
        MyMIDI.writeFile(output_file)
    print("done!")

# def midi_saver(result) :


if __name__ == '__main__':
    pygame.midi.init()
    my_input = pygame.midi.Input(2)
    print(sys.argv)
    argv = sys.argv.copy()
    argv.pop(0)
    argv = argv[0].split(",")
    argv = list(map(int, argv))
    print(argv)
    midi_generator(argv)
    pygame.init()
    pygame.mixer.music.load("major-scale.mid")
    pygame.mixer.music.set_volume(0.8)
    freq = 44100  # audio CD quality
    bitsize = -16  # unsigned 16 bit
    channels = 1  # 1 is mono, 2 is stereo
    buffer = 1024  # number of samples
    pygame.mixer.init(freq, bitsize, channels, buffer)
    try:
        pygame.mixer.music.load("major-scale.mid")
        print("Music file {} loaded!".format("major-scale.mid"))
    except pygame.error:
        print("File {} not found! {}".format(
            "major-scale.mid", pygame.get_error()))
    pygame.midi.quit()

    fs = FluidSynth(sound_font='font.sf2')
    fs.midi_to_audio('major-scale.mid', 'output.mp3')

    audio_path = 'output.mp3'
    x, sr = librosa.load(audio_path, mono=True, duration=30)
    # ori_sent = '그는 괜찮은 척 하려고 애쓰는 것 같았다'

    # IPython.display.Audio(data=x, rate=sr)

    model = load_model('GenreTraniningModel.h5')

    # conver Audio to Mono
    x = librosa.to_mono(x)

    # Normalize the raw audio
    x = librosa.util.normalize(x)
    hop_length = 256
    frame_length = 512
    n_mfcc = 26

    energy_calc = calc_energy(x)
    rms_calc = calc_rms(x)
    mfcc_calc = calc_mfcc(x, sr, n_mfcc)

    mean_energy = energy_calc.mean()  # progress_apply(lambda x: x.mean())
    std_energy = energy_calc.std()  # progress_apply(lambda x: x.std())
    min_energy = energy_calc.min()  # progress_apply(lambda x: x.min())
    max_energy = energy_calc.max()  # progress_apply(lambda x: x.max())
    mfcc_mean = mfcc_calc.mean(axis=0)  # apply(lambda x: x.mean(axis=0))
    mfcc_std = mfcc_calc.std(axis=0)  # apply(lambda x: x.std(axis=0))
    mfcc_min = mfcc_calc.min(axis=0)  # apply(lambda x: x.min(axis=0))
    mfcc_max = mfcc_calc.max(axis=0)  # apply(lambda x: x.max(axis=0))
    max_rms = np.max(rms_calc)  # apply(np.max)
    std_rms = np.std(rms_calc)  # apply(np.std)
    median_rms = np.median(rms_calc)  # apply(np.median)
    min_rms = np.min(rms_calc)  # apply(np.min)

    mfcc_mean = mfcc_mean.tolist()
    mfcc_std = mfcc_std.tolist()
    mfcc_min = mfcc_min.tolist()
    mfcc_max = mfcc_max.tolist()

    print(mfcc_mean)

    #mfcc = librosa.feature.mfcc(x=x, sr=sr)
    #
    buffer = []
    labels = ['Dark', 'Happy', 'Relaxing', 'Romance', 'Sad']  # 조사하기

    # https://m.blog.naver.com/hankrah/221929249131 참조 : 예제 9

    def deep_flatten(lst):
        return [a for i in lst for a in deep_flatten(i)] if isinstance(lst, Iterable) else [lst]

        # for element in mfcc:
    buffer.extend([min_energy, max_energy, max_rms, std_rms, median_rms, min_rms,
                   mfcc_mean, mfcc_std, mfcc_max, mfcc_min])  # list 안에 list 모두 flatten, input 맞추기
    x_test = deep_flatten(buffer)  # np.array([buffer]) # 다시 2차원 배열로 만든다.
    x_test = np.array([x_test])
    # print(x_test) # https://wikidocs.net/71755 model.predict 참조

    y_predict = model.predict(x_test)

    # print(y_predict) #[[3.3286267e-21 9.8352991e-02 2.0311566e-15 1.0989858e-11 9.0164697e-01]]
    # print(y_predict.argmax(axis=1)) # [4]
    # print(y_predict.argmax(axis=1)[0]) # 4
    print(labels[y_predict.argmax(axis=1)[0]])  # Sad
