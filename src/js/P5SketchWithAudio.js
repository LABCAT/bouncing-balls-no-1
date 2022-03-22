import React, { useRef, useEffect } from "react";
import "./helpers/Globals";
import "p5/lib/addons/p5.sound";
import * as p5 from "p5";
import { Midi } from '@tonejs/midi'
import PlayIcon from './functions/PlayIcon.js';

import audio from "../audio/bouncing-balls-no-1.ogg";
import midi from "../audio/bouncing-balls-no-1.mid";

const P5SketchWithAudio = () => {
    const sketchRef = useRef();

    const Sketch = p => {

        p.canvas = null;

        p.canvasWidth = window.innerWidth;

        p.canvasHeight = window.innerHeight;

        p.audioLoaded = false;

        p.player = null;

        p.PPQ = 3840 * 4;

        p.loadMidi = () => {
            Midi.fromUrl(midi).then(
                function(result) {
                    const noteSet1 = result.tracks[3].notes; // Synth 1
                    p.scheduleCueSet(noteSet1, 'executeCueSet1');
                    p.audioLoaded = true;
                    document.getElementById("loader").classList.add("loading--complete");
                    document.getElementById("play-icon").classList.remove("fade-out");
                }
            );
            
        }

        p.preload = () => {
            p.song = p.loadSound(audio, p.loadMidi);
            p.song.onended(p.logCredits);
        }

        p.scheduleCueSet = (noteSet, callbackName, poly = false)  => {
            let lastTicks = -1,
                currentCue = 1;
            for (let i = 0; i < noteSet.length; i++) {
                const note = noteSet[i],
                    { ticks, time } = note;
                if(ticks !== lastTicks || poly){
                    note.currentCue = currentCue;
                    p.song.addCue(time, p[callbackName], note);
                    lastTicks = ticks;
                    currentCue++;
                }
            }
        } 

        p.setup = () => {
            p.canvas = p.createCanvas(p.canvasWidth, p.canvasHeight, p.WEBGL);
            console.log(p.canvas);
            p.smooth();
            p.background(0);
        }

        p.xPos=0;
        p.yPos=0;
        p.zPos=0;

        p.xSpeed=4;
        p.ySpeed=4;
        p.zSpeed=4;

        p.xDirection=1;
        p.yDirection=1;
        p.zDirection=1;

        p.draw = () => {
            p.background(0);
            p.lights();


            // box setup
            p.stroke(255);

            const dist = p.height / 2;

            // background square
            p.translate (-p.width/2, -p.height/2, 0);
            p.line(0, 0, -dist, p.width, 0, -dist);
            p.line(0, 0, -dist, 0, p.height, -dist);
            p.line(0, p.height, -dist, p.width, p.height, -dist);
            p.line(p.width, p.height, -dist, p.width, 0, -dist);

            // perspective lines
            p.line(0, 0, -dist, 0, 0, 0);
            p.line(p.width, 0, -dist, p.width, 0, 0);
            p.line(0, p.height, -dist, 0, p.height, 0);
            p.line(p.width, p.height, -dist, p.width, p.height, 0);
            p.translate (p.width/2, p.height/2, 0);


            // inital ball set up

            p.translate (p.xPos, p.yPos, -p.zPos);
            p.emissiveMaterial(255, 0, 0);
            p.shininess(100);
            p.fill(255, 0, 0);
            p.stroke(0, 0, 255);
            p.sphere(100);
            

            // motion setup

            p.xPos = p.xPos + (p.xSpeed * p.xDirection);  
            p.yPos = p.yPos + (p.ySpeed * p.yDirection); 
            p.zPos = p.zPos + (p.zSpeed * p.zDirection);

            if (p.xPos > ((p.width / 2) - 100)) {
                p.xDirection =- 1;
            }

            if (p.yPos > (dist - 100)) {
                p.yDirection =- 1;
            }

            if (p.zPos > dist) {
                p.zDirection =- 1;
            }

            if (p.xPos <  -((p.width / 2) - 100)) {
                p.xDirection =+ 1;
            }

            if (p.yPos< -(dist - 100)) {
                p.yDirection =+ 1;
            }

            if (p.zPos < 0) {
                p.zDirection =+ 1;
            }
            
            if(p.audioLoaded && p.song.isPlaying()){

            }
        }

        p.executeCueSet1 = (note) => {
            p.background(p.random(255), p.random(255), p.random(255));
            p.fill(p.random(255), p.random(255), p.random(255));
            p.noStroke();
            p.ellipse(p.width / 2, p.height / 2, p.width / 4, p.width / 4);
        }

        p.mousePressed = () => {
            if(p.audioLoaded){
                if (p.song.isPlaying()) {
                    p.song.pause();
                } else {
                    if (parseInt(p.song.currentTime()) >= parseInt(p.song.buffer.duration)) {
                        p.reset();
                    }
                    document.getElementById("play-icon").classList.add("fade-out");
                    p.canvas.classList.add("fade-in");
                    p.song.play();
                }
            }
        }

        p.creditsLogged = false;

        p.logCredits = () => {
            if (
                !p.creditsLogged &&
                parseInt(p.song.currentTime()) >= parseInt(p.song.buffer.duration)
            ) {
                p.creditsLogged = true;
                    console.log(
                    "Music By: http://labcat.nz/",
                    "\n",
                    "Animation By: https://github.com/LABCAT/"
                );
                p.song.stop();
            }
        };

        p.reset = () => {

        }

        p.updateCanvasDimensions = () => {
            p.canvasWidth = window.innerWidth;
            p.canvasHeight = window.innerHeight;
            p.canvas = p.resizeCanvas(p.canvasWidth, p.canvasHeight);
        }

        if (window.attachEvent) {
            window.attachEvent(
                'onresize',
                function () {
                    p.updateCanvasDimensions();
                }
            );
        }
        else if (window.addEventListener) {
            window.addEventListener(
                'resize',
                function () {
                    p.updateCanvasDimensions();
                },
                true
            );
        }
        else {
            //The browser does not support Javascript event binding
        }
    };

    useEffect(() => {
        new p5(Sketch, sketchRef.current);
    }, []);

    return (
        <div ref={sketchRef}>
            <PlayIcon />
        </div>
    );
};

export default P5SketchWithAudio;
