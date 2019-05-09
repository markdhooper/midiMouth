 /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
 /* Program:     midiMouth                                         */
 /* Programmer:  Mark Hooper                                       */
 /* Description: This program was made to serve as a proof         */
 /*              of concept for a hand-held midi controller        */
 /*              that I was looking to build. I want to be         */
 /*              able to send midi signals by humming a note       */
 /*              and pressing a button. This application was       */
 /*              testing the practicality of using FFT to          */
 /*              analyze the pitch of the voice in a timely        */
 /*              manner.                                           */
 /* How to use:  Sing a note, you'll see the frequency spectrum    */
 /*              on screen. if you click the mouse, you'll hear    */
 /*              a tone played back (use headphones!)              */
 /*                                                                */
 /*                                                                */
 /*                                                                */
 /*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

let numNotes = 36;

let noteFreq = [

  110, 116, 123, 131, 139, 147, 156, 165, 175, 185, 196, 208,   //1st
  220, 233, 247, 261, 277, 293, 311, 334, 349, 370, 392, 415,   //2nd
  440, 466, 494, 523, 554, 587, 622, 659, 698, 740, 784, 831,   //3rd
  880, 932, //988,1046,1108,1174,1244,1338,1396,1480,1568,1662, //4th
// 1760,1864,1975,2093,2217,2349,2489,2637,2794,2960,3136,3322  //5th
];


let noteCol = [
  "#FF0000","#FF8000","#FFFF00",
  "#80FF00","#00FF00","#00FF80",
  "#00FFFF","#0080FF","#0000FF",
  "#8000FF","#FF00FF","#FF0080",
  "#FF0000","#FF8000","#FFFF00",
  "#80FF00","#00FF00","#00FF80",
  "#00FFFF","#0080FF","#0000FF",
  "#8000FF","#FF00FF","#FF0080",
  "#FF0000","#FF8000","#FFFF00",
  "#80FF00","#00FF00","#00FF80",
  "#00FFFF","#0080FF","#0000FF",
  "#8000FF","#FF00FF","#FF0080",
  "#FF0000","#FF8000","#FFFF00",
  "#80FF00","#00FF00","#00FF80",
  "#00FFFF","#0080FF","#0000FF",
  "#8000FF","#FF00FF","#FF0080",
  "#FF0000","#FF8000","#FFFF00",
  "#80FF00","#00FF00","#00FF80",
  "#00FFFF","#0080FF","#0000FF",
  "#8000FF","#FF00FF","#FF0080",
  "#FFFFFF"
];

const cutoff = 880;
const smoothing = 0.8;
const bins = 2048;
const dispBins = 256;

let mic, fft, max;
let threshold = 192;
let lastPitch = 48;
let playing = false;

osc = new p5.Oscillator();

function setup() {
  createCanvas(512, 256);
  mic = new p5.AudioIn();
  mic.start();
  fft = new p5.FFT(smoothing, bins);
  fft.setInput(mic);
  

  osc.setType('square');
  osc.amp(0);
  osc.start();

}

function draw() {
  max = int(numNotes);
  threshold = 150;
  background(0);
    for(i = 0; i < numNotes; i++){
    stroke(noteCol[i]);     
     let x = map(int(noteFreq[i]*2/5.859375),0,dispBins,0,width);
    line(x,0,x,height);
  }

  let spectrum = fft.analyze(2048);
  for(j = 0; j < numNotes; j++){
    let energy = fft.getEnergy(noteFreq[j]);
    if( energy > threshold){
      max = j;
      lastPitch = j%numNotes; 
       osc.freq(noteFreq[lastPitch]);
      threshold = energy;
    }
  }
  osc.freq(noteFreq[lastPitch]);
  noStroke();
  fill(noteCol[max]);
  for (let i = 0; i < dispBins; i++) {
    let x = map(i, 0, dispBins, 0, width);
    let h = -height + map(spectrum[i], 0, 255, height, 0);
    rect(x, height, width / dispBins, h);
  }
}

function mousePressed() {
  if (mouseX > 0 && mouseX < width && mouseY < height && mouseY > 0) {
      // ramp amplitude to 0.5 over 0.05 seconds
      osc.freq(noteFreq[lastPitch]);
      osc.amp(0.5, 0.005);
  }
}

function mouseReleased(){
  if (mouseX > 0 && mouseX < width && mouseY < height && mouseY > 0) {
    // stop playing sound.
    osc.amp(0.0,0.005);
  }
}

function keyTyped(){
if(key === 'a'){
  // cycle through octaves
  lastPitch = (lastPitch + 12)%numNotes;
 }                                         
}