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

class GameClient
{
  constructor(server, userEmail, userPassword = "")
  {
    this.path = "ws://" + server + "/codenjoy-contest/ws?user=" + userEmail + (userPassword == "" ? "" : "&pwd=" + userPassword)
    this.isBombSetted = false;
    this.bombTimer = 0;
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
}
