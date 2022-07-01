"use strict";

/* global XXH */
/* exported --
    p3_preload
    p3_setup
    p3_worldKeyChanged
    p3_tileWidth
    p3_tileHeight
    p3_tileClicked
    p3_drawBefore
    p3_drawTile
    p3_drawSelectedTile
    p3_drawAfter
*/

function p3_preload() {}

function p3_setup() {}

let worldSeed;

function p3_worldKeyChanged(key) {
  worldSeed = XXH.h32(key, 0);
  noiseSeed(worldSeed);
  randomSeed(worldSeed);
}

function p3_tileWidth() {
  return 50;
}
function p3_tileHeight() {
  return 50;
}

let [tw, th] = [p3_tileWidth(), p3_tileHeight()];

let clicks = {};

function p3_tileClicked(i, j) {
  let key = [i, j];
  clicks[key] = 1 + (clicks[key] | 0);
  console.log(i, j);
}

function p3_drawBefore() {}

function p3_drawTile(i, j) {
  noStroke();
    decideBaseColor(i, j);
    push();
  let n = clicks[[i, j]] | 0;
  if (n % 2 == 1) {
    fill(255, 255, 0, 180);
    ellipse(th/2, tw/2, 10, 10);
  }

  pop();
}

let up, bottom, right, left;

function baseShape(top, right, left, bottom) {
    fill(0, 255, 0);
    beginShape();
    vertex(0 + left, 0 + top);
    vertex(0 + left, tw - bottom);
    vertex(th - right, tw - bottom);
    vertex(th - right, 0 + top);
    endShape(CLOSE);
}

let grass;
let water;
let waterToGrassThreshold = .55;

function decideBaseColor(i, j) {
    if (noise(i, j) < waterToGrassThreshold) {
        fill(0, 255, 0);
    } else {
        fill(0, 0, 255);
    }
    left, right, up, bottom = 0;
    grass = numOfGrass(i, j);
    water = numOfWater(i, j);
    if (noise(i, j) >= waterToGrassThreshold && grass == 4) {
        fill(0, 255, 0);

        beginShape();
        vertex(0, 0);
        vertex(0, tw);
        vertex(th, tw);
        vertex(th, 0);
        endShape(CLOSE);
    } else {
        fill(0, 0, 255);

        beginShape();
        vertex(0, 0);
        vertex(0, tw);
        vertex(th, tw);
        vertex(th, 0);
        endShape(CLOSE);
    }
    if (noise(i, j) < waterToGrassThreshold && water == 4) {
        fill(0, 0, 255);

        beginShape();
        vertex(0, 0);
        vertex(0, tw);
        vertex(th, tw);
        vertex(th, 0);
        endShape(CLOSE);
    } else if (noise(i, j) < waterToGrassThreshold && water < 4) {
        fill(0, 0, 255);

        beginShape();
        vertex(0, 0);
        vertex(0, tw);
        vertex(th, tw);
        vertex(th, 0);
        endShape(CLOSE);
        baseShape(up, right, left, bottom);
    }
    console.log(grass);
    grass = 0;
    water = 0;
}

function numOfGrass(i, j) {
    if (noise(i + 1, j) < waterToGrassThreshold) {
        grass++;
        right = 5;
    }
    if (noise(i - 1, j) < waterToGrassThreshold) {
        grass++;
        left = 5;
    }
    if (noise(i, j + 1) < waterToGrassThreshold) {
        grass++;
        up = 5;
    }
    if (noise(i, j - 1) < waterToGrassThreshold) {
        grass++;
        bottom = 5;
    }
    return grass;
}

function numOfWater(i, j) {
    if (noise(i + 1, j) >= waterToGrassThreshold) {
        water++;
    }
    if (noise(i - 1, j) >= waterToGrassThreshold) {
        water++;
    }
    if (noise(i, j + 1) >= waterToGrassThreshold) {
        water++;
    }
    if (noise(i, j - 1) >= waterToGrassThreshold) {
        water++;
    }
    return water;
}

function p3_drawSelectedTile(i, j) {
  noFill();
  stroke(0, 255, 0, 128);

  beginShape();
  vertex(0, 0);
  vertex(0, tw);
  vertex(th, tw);
  vertex(th, 0);
  endShape(CLOSE);

  noStroke();
  fill(0);
  text("(" + [i, j] + ")", 0, 0);
}

function p3_drawAfter() {}
