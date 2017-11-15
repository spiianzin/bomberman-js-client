"use strict";

var BombermanBlocks =
{
  Unknown: 0,

  Bomberman: '☺',
  BombBomberman: '☻',
  DeadBomberman: 'Ѡ',

  OtherBomberman: '♥',
  OtherBombBomberman: '♠',
  OtherDeadBomberman: '♣',

  BombTimer5: '5',
  BombTimer4: '4',
  BombTimer3: '3',
  BombTimer2: '2',
  BombTimer1: '1',
  Boom: '҉',

  Wall: '☼',
  WallDestroyable: '#',
  DestroyedWall: 'H',

  MeatChopper: '&',
  DeadMeatChopper: 'x',

  Space: ' '
};

var Direction = {
    UP : "UP",
    RIGHT : "RIGHT",
    DOWN : "DOWN",
    LEFT : "LEFT"
};

var State = {
    WALKING: "***WALKING***",
    SAVING: "***SAVING***",
    ATACK: "***ATACK***"
}

var log = function(logger, text) {
    logger.value += text + "\n";
}

class GameManager {
    constructor(client, text) {
        this.client = client;
        this.isBombSetted = false;
        this.bombTimer = 0;
        this.direction = Direction.UP;
        this.state = State.WALKING;
        this.dangerSearch = new DangerSearch();
        this.logger = new Logger(text);
    }

    logic() {
        this.atack(); 
        if (this.dangerSearch.isDangerous(this.client.playerX, this.client.playerY, this.client.map)) {
            if (this.state != State.SAVING) {
                this.state = State.SAVING;
                this.logger.log(State.SAVING); 
            }
        } else if (this.state != State.WALKING) {
            this.state = State.WALKING;
            this.logger.log(State.WALKING);
        }

        switch(this.state) {
            case State.WALKING: this.walking(); break;
            case State.SAVING: this.save_ass(); break;
        }

    }

    save_ass() {
        this.walking();
    }

    walking() {
        if (!this.isDirectionFree(this.direction)) {
            this.direction = this.getFreeDirection(this.client.playerX, this.client.playerY, this.client.map);
        }

        this.logger.log(this.direction);
        this.goTo(this.direction);
        this.tic();
    }

    atack() {
        if (!this.isBombSetted) {
            this.client.act();
            this.bomb();
            this.logger.log("Bomb has been planted");
        }
    }

    goback() {

    }

    bomb() {
      this.isBombSetted = true;
      this.bombTimer = 5;
    }

    tic() {
      if (this.bombTimer > 5) {
        this.bombTimer = 5;
      }
      if (this.bombTimer <= 0) {
        this.bombTimer = 0;
        this.isBombSetted = false;
      }
      this.bombTimer--;
    }

    isBlock(block) {
      var result = false;
      result =
        block == BombermanBlocks.Wall ||
        block == BombermanBlocks.WallDestroyable ||
        block == BombermanBlocks.MeatChopper ||
        block == BombermanBlocks.BombTimer1 ||
        block == BombermanBlocks.BombTimer2 ||
        block == BombermanBlocks.BombTimer3 ||
        block == BombermanBlocks.BombTimer4 ||
        block == BombermanBlocks.BombTimer5 ||
        block == BombermanBlocks.OtherBomberman ||
        block == BombermanBlocks.OtherBombBomberman;
      return result;
    }

    getFreeDirection(x,y,map) {
        var direction = Direction.UP;

        if (this.isBlock(map[y-1][x]) == false) {}
        else if (this.isBlock(map[y][x + 1]) == false) { direction = Direction.RIGHT; }
        else if (this.isBlock(map[y+1][x]) == false) { direction = Direction.DOWN; }
        else if (this.isBlock(map[y][x - 1]) == false) { direction = Direction.LEFT; }
        return direction;
    }

    isDirectionFree(direction) {
        switch(direction) {
            case Direction.UP: return this.isBlock(this.client.map[this.client.playerY - 1][this.client.playerX]) == false
            case Direction.RIGHT: return this.isBlock(this.client.map[this.client.playerY][this.client.playerX + 1]) == false
            case Direction.DOWN: return this.isBlock(this.client.map[this.client.playerY + 1][this.client.playerX]) == false
            case Direction.LEFT: return this.isBlock(this.client.map[this.client.playerY][this.client.playerX - 1]) == false
        }
        return false;
    }

    goTo(direction) {
        var done = false;
        if (direction == Direction.UP) {this.client.up(); done = true;}
        if (direction == Direction.RIGHT) {this.client.right(); done = true;}
        if (direction == Direction.DOWN) {this.client.down(); done = true;}
        if (direction == Direction.LEFT) {this.client.left(); done = true;}
        if (!done) { this.client.blank(); }
    }
};

class DangerSearch {

    constructor() {
        this.BOMB_AREA = 3;
    }

    isDangerous(x, y, map) {
        return this.isBombLine(x, y, map) || this.isEnemyClose();
    }

    isBombLine(x, y, map) {
        var me = this;
        for (var offset = 1; offset <= this.BOMB_AREA; offset++) {
            if (this.isBomb(map[y][x + offset]) ||
                this.isBomb(map[y][x - offset]) ||
                this.isBomb(map[y + offset][x]) ||
                this.isBomb(map[y - offset][x])) {
                return true;
            }
        }
        return false;
    }

    isEnemyClose() {
        return false;
    }

    isBomb(block) {
        return  block == BombermanBlocks.BombTimer1 ||
                block == BombermanBlocks.BombTimer2 ||
                block == BombermanBlocks.BombTimer3 ||
                block == BombermanBlocks.BombTimer4 ||
                block == BombermanBlocks.BombTimer5 ||
                block == BombermanBlocks.OtherBombBomberman;
    }
}

class Logger {
    constructor(elem) {
        this.logger = elem;
    }

    log(text) {
        this.logger.value += text + "\n";
    }
}