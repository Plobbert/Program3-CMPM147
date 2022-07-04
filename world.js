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
let speed = {};

function p3_tileClicked(i, j) {
  let key = [i, j];
    clicks[key] = 1 + (clicks[key] | 0);
    speed[key] = 0;
    console.log(speed[key]);
}

function p3_drawBefore() { }

function p3_drawTile(i, j) {
    let key = [i, j];
  noStroke();
    decideBaseColor(i, j);
    push();
  let n = clicks[[i, j]] | 0;
  if (n % 2 == 1) {
    //fill(255, 255, 0, 180);
    //ellipse(th/2, tw/2, 10, 10);
      noFill();
      stroke(0, 255, 255);
      strokeWeight(4)
      circle(th / 2, tw / 2, speed[key]);
      speed[key]++;
      if (speed[key] > 42) {
          speed[key] = 0;
      }
  }

  pop();
}

let up, bottom, right, left;

function baseShape(top, right, left, bottom) {
    beginShape();
    vertex(0 + left, 0 + bottom);
    vertex(0 + left, th - top);
    vertex(tw - right, th - top);
    vertex(tw - right, 0 + bottom);
    endShape(CLOSE);
    fill(179, 77, 77);
    beginShape();
    if (bottom != 0) {
        vertex(0 + left, 0 + bottom);
        vertex(0 + left, 0 + bottom + 4);
        vertex(tw - right, 0 + bottom + 4);
        vertex(tw - right, 0 + bottom);
        endShape(CLOSE);
        fill(57, 91, 188);
        beginShape();
        if (right != 0) {
            vertex(tw - right - 4, 0 + bottom);
            vertex(tw - right - 4, 0 + bottom + 4);
            vertex(tw - right, 0 + bottom + 4);
            vertex(tw - right, 0 + bottom);
        }
        endShape(CLOSE);
        beginShape();
        if (left != 0) {
            vertex(0 + left + 4, 0 + bottom);
            vertex(0 + left + 4, 0 + bottom + 4);
            vertex(0 + left, 0 + bottom + 4);
            vertex(0 + left, 0 + bottom);
        }
        endShape(CLOSE);
        fill(179, 77, 77);
    }
    beginShape();
    if (top != 0) {
        vertex(0 + left, th - top);
        vertex(0 + left, th - top - 4);
        vertex(tw - right, th - top - 4);
        vertex(tw - right, th - top);
        endShape(CLOSE);
        fill(57, 91, 188);
        beginShape();
        if (right != 0) {
            vertex(tw - right - 4, th - top);
            vertex(tw - right - 4, th - top - 4);
            vertex(tw - right, th - top - 4);
            vertex(tw - right, th - top);
        }
        endShape(CLOSE);
        beginShape();
        if (left != 0) {
            vertex(0 + left + 4, th - top);
            vertex(0 + left + 4, th - top - 4);
            vertex(0 + left, th - top - 4);
            vertex(0 + left, th - top);
        }
        endShape(CLOSE);
        fill(179, 77, 77);
    }
    beginShape();
    if (right != 0) {
        vertex(tw - right, 0 + bottom);
        vertex(tw - right - 4, 0 + bottom);
        vertex(tw - right - 4, th - top);
        vertex(tw - right, th - top);
        endShape(CLOSE);
        fill(57, 91, 188);
        beginShape();
        if (top != 0) {
            vertex(tw - right - 4, th - top);
            vertex(tw - right - 4, th - top - 4);
            vertex(tw - right, th - top - 4);
            vertex(tw - right, th - top);
        }
        endShape(CLOSE);
        beginShape();
        if (bottom != 0) {
            vertex(tw - right - 4, 0 + bottom);
            vertex(tw - right - 4, 0 + bottom + 4);
            vertex(tw - right, 0 + bottom + 4);
            vertex(tw - right, 0 + bottom);
        }
        endShape(CLOSE);
        fill(179, 77, 77);
    }
    beginShape();
    if (left != 0) {
        vertex(0 + left, 0 + bottom);
        vertex(0 + left + 4, 0  + bottom);
        vertex(0 + left + 4, th - top);
        vertex(0 + left, th - top);
        endShape(CLOSE);
        fill(57, 91, 188);
        beginShape();
        if (top != 0) {
            vertex(0 + left + 4, th - top);
            vertex(0 + left + 4, th - top - 4);
            vertex(0 + left, th - top - 4);
            vertex(0 + left, th - top);
        }
        endShape(CLOSE);
        beginShape();
        if (bottom != 0) {
            vertex(0 + left + 4, 0 + bottom);
            vertex(0 + left + 4, 0 + bottom + 4);
            vertex(0 + left, 0 + bottom + 4);
            vertex(0 + left, 0 + bottom);
        }
        endShape(CLOSE);
    }
    fill(52, 140, 59);
}

let grass;
let water;
let waterToGrassThreshold = .55;

function decideBaseColor(i, j) {
    if (noise(i, j) < waterToGrassThreshold) {
        fill(52, 140, 59);
    } else {
        fill(57, 91, 188);
    }
    left = 0;
    right = 0;
    up = 0;
    bottom = 0;
    grass = numOfGrass(i, j);
    water = numOfWater(i, j);
    fill(57, 91, 188);

    beginShape();
    vertex(0, 0);
    vertex(0, tw);
    vertex(th, tw);
    vertex(th, 0);
    endShape(CLOSE);
    if (noise(i, j) < waterToGrassThreshold && water < 4) {
        if (noise(i, j) < .3) {
            fill(74, 105, 4);
        } else {
            fill(52, 140, 59);
        }
        baseShape(up, right, left, bottom);
    }
    if (noise(i - 1, j - 1) > waterToGrassThreshold && noise(i - 1, j) < waterToGrassThreshold && noise(i, j - 1) < waterToGrassThreshold && noise(i, j) < waterToGrassThreshold) {
        fill(179, 77, 77);
        beginShape();
        vertex(0, 4);
        vertex(0, 0);
        vertex(4, 0);
        vertex(4, 4);
        endShape(CLOSE);
        fill(57, 91, 188);
    }
    if (noise(i - 1, j + 1) > waterToGrassThreshold && noise(i - 1, j) < waterToGrassThreshold && noise(i, j + 1) < waterToGrassThreshold && noise(i, j) < waterToGrassThreshold) {
        fill(179, 77, 77);
        beginShape();
        vertex(0, th - 4);
        vertex(0, th);
        vertex(4, th);
        vertex(4, th - 4);
        endShape(CLOSE);
        fill(57, 91, 188);
    }
    if (noise(i + 1, j + 1) > waterToGrassThreshold && noise(i + 1, j) < waterToGrassThreshold && noise(i, j + 1) < waterToGrassThreshold && noise(i, j) < waterToGrassThreshold) {
        fill(179, 77, 77);
        beginShape();
        vertex(tw, th - 4);
        vertex(tw, th);
        vertex(tw - 4, th);
        vertex(tw - 4, th - 4);
        endShape(CLOSE);
        fill(57, 91, 188);
    }
    if (noise(i + 1, j - 1) > waterToGrassThreshold && noise(i + 1, j) < waterToGrassThreshold && noise(i, j - 1) < waterToGrassThreshold && noise(i, j) < waterToGrassThreshold) {
        fill(179, 77, 77);
        beginShape();
        vertex(tw, 4);
        vertex(tw, 0);
        vertex(tw - 4, 0);
        vertex(tw - 4, 4);
        endShape(CLOSE);
        fill(57, 91, 188);
    }
    grass = 0;
    water = 0;
}

function numOfGrass(i, j) {
    if (noise(i + 1, j) > waterToGrassThreshold) {
        grass++;
        right = 5;
    }
    if (noise(i - 1, j) > waterToGrassThreshold) {
        grass++;
        left = 5;
    }
    if (noise(i, j + 1) > waterToGrassThreshold) {
        grass++;
        up = 5;
    }
    if (noise(i, j - 1) > waterToGrassThreshold) {
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
