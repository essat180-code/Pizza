const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 3000 });

// 게임 상태 (모든 플레이어 공유)
let game = {
  money: 1000,
  egg: 0,
  fish: 0,
  honey: 0,
  multi: 1,
  select: [],
  book: [],
  customer: null,
  orderChecked: false
};

function broadcast() {
  const data = JSON.stringify({
    type: "update",
    game
  });

  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
}

wss.on("connection", (ws) => {

  console.log("👤 플레이어 접속");

  // 접속 시 바로 데이터 전송
  ws.send(JSON.stringify({
    type: "update",
    game
  }));

  ws.on("message", (msg) => {
    try {
      const data = JSON.parse(msg);

      // 전체 동기화
      if (data.type === "sync") {
        game = data.game;
        broadcast();
      }

      // 농장
      if (data.type === "farm") {
        game.egg += Math.ceil(Math.random() * 3);
        broadcast();
      }

      // 낚시
      if (data.type === "fish") {
        game.fish += Math.ceil(Math.random() * 2);
        broadcast();
      }

      // 양봉
      if (data.type === "honey") {
        game.honey += Math.ceil(Math.random() * 2);
        broadcast();
      }

      // 돈 증가 테스트
      if (data.type === "money") {
        game.money += 100;
        broadcast();
      }

    } catch (e) {
      console.log("에러:", e);
    }
  });

  ws.on("close", () => {
    console.log("❌ 플레이어 나감");
  });

});

console.log("🚀 서버 실행 중");
console.log("ws://0.0.0.0:3000");
EOF