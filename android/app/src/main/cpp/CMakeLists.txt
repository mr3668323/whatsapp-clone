cmake_minimum_required(VERSION 3.13)
project(appmodules)

# React Native 0.72.x with Old Architecture
# This ensures libappmodules.so is generated

add_library(appmodules SHARED
    appmodules.cpp
)
