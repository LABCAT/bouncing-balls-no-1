import React, { useRef, useEffect } from "react";
import "./helpers/Globals";
import "p5/lib/addons/p5.sound";
import * as p5 from "p5";
import { Midi } from '@tonejs/midi'
import PlayIcon from './functions/PlayIcon';
import BouncingBall from './classes/BouncingBall';
import NaturalBouncingBall from './classes/NaturalBouncingBall';

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
                    console.log(result);
                    const noteSet1 = result.tracks[3].notes; // Sampler 2 - Twinkle Stars
                    const noteSet2 = result.tracks[5].notes.filter(note => note.midi !== 43); // Redrum 1 - Abstract Kit 01
                    const noteSet3 = result.tracks[0].notes; // Synth 1 - HyperBottom
                    const noteSet4 = result.tracks[2].notes; // Synth 3 - Laid Down
                    p.scheduleCueSet(noteSet1, 'executeCueSet1');
                    p.scheduleCueSet(noteSet2, 'executeCueSet2');
                    p.scheduleCueSet(noteSet3, 'executeCueSet3');
                    p.scheduleCueSet(noteSet4, 'executeCueSet4');
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
            p.colorMode(p.HSB);
            p.smooth();
            p.background(0);
            const bigBall = new BouncingBall(
                p, 
                0,
                0,
                0,
                p.random(p.height / 8, p.height / 16), 
                16,
                'random',
                p.color(p.random(0, 360), 100, 100),
                p.color(p.random(0, 360), 100, 100),
                false
            );
            bigBall.canDraw = false;
            p.balls.push(bigBall);
        }

        p.balls = [];

        p.draw = () => {
            let locX = p.mouseX - p.height / 2;
            let locY = p.mouseY - p.width / 2;
            p.ambientLight(60, 60, 60);
            p.pointLight(255, 255, 255, locX, locY, 100);
            if(p.audioLoaded && p.song.isPlaying()){
                p.background(0);
                p.lights();

                const dist = p.height / 2;
                p.stroke(255);
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
                
                for (let i = 0; i < p.balls.length; i++) {
                    const ball = p.balls[i];
                    ball.draw();
                }
            }
        }

        p.boxCorners = [];

        p.executeCueSet1 = () => {
            p.balls.push(
                new BouncingBall(
                    p, 
                    p.random(-p.width/8, p.width/8), 
                    -p.height/2, 
                    p.random(-p.height/8, p.height/8), 
                    p.height / 16, 
                    24,
                    'up-down',
                    p.color(p.random(0, 360), 100, 0),
                    p.color(p.random(0, 360), 100, 100)
                )
            );
        }

        p.executeCueSet2 = (note) => {
            const { midi } = note,
                fill = midi === 36 ? p.color(0, 100, 0) : p.color(0, 0, 100),
                stroke = midi === 36 ? p.color(0, 0, 100) : p.color(0, 100, 0);
            p.balls.push(
                new NaturalBouncingBall(
                    p, 
                    (-p.width / 2) - (p.height / 16 * 8), 
                    -p.height/2, 
                    p.height, 
                    p.height / 16, 
                    24,
                    'right',
                    fill,
                    stroke,
                    false
                )
            );
        }

        p.executeCueSet3 = (note) => {
            // p.balls.push(
            //     new BouncingBall(
            //         p, 
            //         0,
            //         0,
            //         0,
            //         p.random(p.height / 12, p.height / 24), 
            //         16,
            //         'random',
            //         p.color(p.random(0, 360), 100, 100),
            //         p.color(p.random(0, 360), 100, 100),
            //         false
            //     )
            // );
        }

        p.executeCueSet4 = (note) => {
            // const ball = p.balls[0]
            // ball.canDraw = true;
        }

        p.loadBoxCorners = () => {
            const dist = p.height / 2;
            p.boxCorners = [
                {
                    x: -p.width/2,
                    y: -p.height/2,
                    z: 0
                },
                {
                    x: p.width/2,
                    y: -p.height/2,
                    z: 0
                },
                {
                    x: -p.width/2,
                    y: p.height/2,
                    z: 0
                },
                {
                    x: p.width/2,
                    y: p.height/2,
                    z: 0
                },
                {
                    x: -p.width/2,
                    y: -p.height/2,
                    z: -dist
                },
                {
                    x: p.width/2,
                    y: -p.height/2,
                    z: -dist
                },
                {
                    x: -p.width/2,
                    y: p.height/2,
                    z: -dist
                },
                {
                    x: p.width/2,
                    y: p.height/2,
                    z: -dist
                },
            ];
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
