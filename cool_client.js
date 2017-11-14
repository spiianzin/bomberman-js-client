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

class GameManager {
    constructor(client) {
        this.client = client;
        this.isBombSetted = false;
        this.bombTimer = 0;
        this.direction = Direction.UP;
    }

    behaviour(text) {
        var done = false;
        if (!this.isBombSetted) {
            this.client.act();
            this.bomb();
            done = true;
        }
        if (!this.isDirectionFree(this.direction)) {
            this.direction = this.getFreeDirection();
        }

        text.value += this.direction + "\n";
        this.goTo(this.direction);
        this.tic();
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

    getFreeDirection() {
        var direction = Direction.UP;
        if (this.isBlock(this.client.map[this.client.playerY - 1][this.client.playerX]) == false) {}
        else if (this.isBlock(this.client.map[this.client.playerY][this.client.playerX + 1]) == false) { direction = Direction.RIGHT; }
        else if (this.isBlock(this.client.map[this.client.playerY + 1][this.client.playerX]) == false) { direction = Direction.DOWN; }
        else if (this.isBlock(this.client.map[this.client.playerY][this.client.playerX - 1]) == false) { direction = Direction.LEFT; }
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

class GameClient {
  constructor(server, userEmail, userPassword = "")
  {
    this.path = "ws://" + server + "/codenjoy-contest/ws?user=" + userEmail + (userPassword == "" ? "" : "&pwd=" + userPassword)
  }

  run(callback)
  {
    this.socket = new WebSocket(this.path);
    this.socket.onmessage = function(event)
    {
      var data = event.data.substring(6);
      this.size = Math.sqrt(data.length);
      var currentChar = 0;

      this.map = [];
      this.isBombSetted = false;
      for(var j = 0; j < this.size; j++)
      {
        this.map[j] = [];
        for(var i = 0; i < this.size; i++)
        {
          for(var key in BombermanBlocks)
          {
            if(data[currentChar] == BombermanBlocks[key])
            {
              this.map[j][i] = BombermanBlocks[key];
              if(
                this.map[j][i] == BombermanBlocks.Bomberman ||
                this.map[j][i] == BombermanBlocks.BombBomberman ||
                this.map[j][i] == BombermanBlocks.DeadBomberman
                )
              {
                this.playerX = i;
                this.playerY = j;
              }
            }
          }
          currentChar++;
        }
      }

      callback();
    }
  }

  get size()    { return this.socket.size;    }
  get map()     { return this.socket.map;     }
  get playerX() { return this.socket.playerX; }
  get playerY() { return this.socket.playerY; }

  set onopen(callback)  { this.socket.onopen  = callback; }
  set onclose(callback) { this.socket.onclose = callback; }
  set onerror(callback) { this.socket.onerror = callback; }

  up()    { this.socket.send("UP");    }
  down()  { this.socket.send("DOWN");  }
  right() { this.socket.send("RIGHT"); }
  left()  { this.socket.send("LEFT");  }
  act()   { this.socket.send("ACT");   }
  blank() { this.socket.send("");      }
}
