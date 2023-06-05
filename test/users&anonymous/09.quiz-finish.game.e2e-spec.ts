import {startApp} from "../../src/application/start.app";
import {Test, TestingModule} from "@nestjs/testing";
import {INestApplication} from "@nestjs/common";
import * as request from "supertest";
import {AppModule} from "../../src/app.module";
import {HTTP} from "../../src/types";
import {URL} from "../dataForTests";
import {GamePairViewModel, SAQuestionViewModel} from "../../src/quiz/quiz.types";

const questionsInput: any = [];

for (let i = 0; i < 5; i++) {
  questionsInput.push({
    body: "What's the Italian word for pie?",
    correctAnswers: ["Pizza", "pizza"]
  })
}

const userInput = [
  {login: "user1", password: "user1pass", email: "user1@gmail.com"},
  {login: "user2", password: "user2pass", email: "user2@gmail.com"},
  {login: "user3", password: "user3pass", email: "user3@gmail.com"},
  {login: "user4", password: "user4pass", email: "user4@gmail.com"}
];

const loginInput = [
  {loginOrEmail: "user1@gmail.com", password: "user1pass"},
  {loginOrEmail: "user2@gmail.com", password: "user2pass"},
  {loginOrEmail: "user3@gmail.com", password: "user3pass"},
  {loginOrEmail: "user4@gmail.com", password: "user4pass"}
];

const users = [];
const tokens = [];

let questionsRec: SAQuestionViewModel[] = [];

let game_01: GamePairViewModel;
let game_02: GamePairViewModel;
let game_03: GamePairViewModel;
let game_04: GamePairViewModel;
let game_05: GamePairViewModel;

jest.setTimeout(100000);

describe("QuizController (e2e)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule =
      await Test.createTestingModule({imports: [AppModule]}).compile();

    app = moduleFixture.createNestApplication();
    app = startApp(app);
    await app.init();
  });

  it("Delete all data", async () => {
    await request(app.getHttpServer())
      .delete(`${URL}/testing/all-data`)
      .auth("admin", "qwerty", {type: "basic"})
      .expect(HTTP.NO_CONTENT_204);
  });

  // TEST #1
  it("Create 5 questions. Status 201", async () => {
    for (let q of questionsInput) {
      const response = await request(app.getHttpServer())
        .post(`${URL}/sa/quiz/questions`)
        .auth("admin", "qwerty", {type: "basic"})
        .send(q);

      const question = response.body;

      questionsRec.push(question);
    }
    expect(true).toBe(true);
  });

  // TEST #2
  it("Create 4 users by SuperAdmin. Status 201", async () => {
    for (let u of userInput) {
      const response = await request(app.getHttpServer())
        .post(`${URL}/sa/users`)
        .auth("admin", "qwerty", {type: "basic"})
        .send(u);

      const user = response.body;
      users.push(user);
    }

    expect(true).toBe(true);
  });

  // TEST #2
  it("Login 4 users. Status 200", async () => {
    for (let l of loginInput) {
      const response = await request(app.getHttpServer())
        .post(`${URL}/auth/login`)
        .send(l);

      const accessToken = response.body;
      tokens.push(accessToken);
    }

    expect(true).toBe(true);
  });

  // TEST #3
  it("Create game_01 by user_01. Status 200", async () => {
    const response1 = await request(app.getHttpServer())
      .post(`${URL}/pair-game-quiz/pairs/connection`)
      .set("Authorization", `Bearer ${tokens[0].accessToken}`);

    const response2 = await request(app.getHttpServer())
      .post(`${URL}/pair-game-quiz/pairs/connection`)
      .set("Authorization", `Bearer ${tokens[1].accessToken}`);

    let game = response2.body;

    for (let i = 0; i < 5; i++) {
      const pl1_ans = await request(app.getHttpServer())
        .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
        .set("Authorization", `Bearer ${tokens[0].accessToken}`)
        .send({answer: "pizza"});
    }

    console.log(new Date().toISOString());

    await new Promise((resolve, reject) => {
      setTimeout(() => resolve(1), 10000)
    });

    console.log(new Date().toISOString())

    const response = await request(app.getHttpServer())
      .get(`${URL}/pair-game-quiz/pairs/${game.id}`)
      .set("Authorization", `Bearer ${tokens[0].accessToken}`);

    game = response.body;

    expect(response).toBeDefined();
    expect(response.status).toBe(HTTP.OK_200);
    expect(game).toStrictEqual({
      id: expect.any(String),
      firstPlayerProgress: {
        answers: [
          {
            questionId: expect.any(String),
            answerStatus: expect.any(String),
            addedAt: expect.any(String)
          },
          {
            questionId: expect.any(String),
            answerStatus: expect.any(String),
            addedAt: expect.any(String)
          },
          {
            questionId: expect.any(String),
            answerStatus: expect.any(String),
            addedAt: expect.any(String)
          },
          {
            questionId: expect.any(String),
            answerStatus: expect.any(String),
            addedAt: expect.any(String)
          },
          {
            questionId: expect.any(String),
            answerStatus: expect.any(String),
            addedAt: expect.any(String)
          }
        ],
        player: {
          id: users[0].id,
          login: users[0].login
        },
        score: 6
      },
      secondPlayerProgress: {
        answers: [
          {
            questionId: expect.any(String),
            answerStatus: expect.any(String),
            addedAt: expect.any(String)
          },
          {
            questionId: expect.any(String),
            answerStatus: expect.any(String),
            addedAt: expect.any(String)
          },
          {
            questionId: expect.any(String),
            answerStatus: expect.any(String),
            addedAt: expect.any(String)
          },
          {
            questionId: expect.any(String),
            answerStatus: expect.any(String),
            addedAt: expect.any(String)
          },
          {
            questionId: expect.any(String),
            answerStatus: expect.any(String),
            addedAt: expect.any(String)
          }
        ],
        player: {
          id: users[1].id,
          login: users[1].login
        },
        score: 0
      },
      questions: [
        {id: expect.any(String), body: expect.any(String)},
        {id: expect.any(String), body: expect.any(String)},
        {id: expect.any(String), body: expect.any(String)},
        {id: expect.any(String), body: expect.any(String)},
        {id: expect.any(String), body: expect.any(String)},
      ],
      status: "Finished",
      pairCreatedDate: expect.any(String),
      startGameDate: expect.any(String),
      finishGameDate: expect.any(String),
    });

    game_01 = game;
  });

  // TEST #4
  it("Create game_02 by user_01. Status 200", async () => {
    const response1 = await request(app.getHttpServer())
      .post(`${URL}/pair-game-quiz/pairs/connection`)
      .set("Authorization", `Bearer ${tokens[0].accessToken}`);

    const response2 = await request(app.getHttpServer())
      .post(`${URL}/pair-game-quiz/pairs/connection`)
      .set("Authorization", `Bearer ${tokens[1].accessToken}`);

    let game = response2.body;

    for (let i = 0; i < 3; i++) {
      const pl2_ans = await request(app.getHttpServer())
        .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
        .set("Authorization", `Bearer ${tokens[1].accessToken}`)
        .send({answer: "pizza"});
    }

    for (let i = 0; i < 5; i++) {
      const pl1_ans = await request(app.getHttpServer())
        .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
        .set("Authorization", `Bearer ${tokens[0].accessToken}`)
        .send({answer: "pizza"});
    }

    console.log(new Date().toISOString());

    await new Promise((resolve, reject) => {
      setTimeout(() => resolve(1), 10000)
    });

    console.log(new Date().toISOString())

    await request(app.getHttpServer())
      .get(`${URL}/pair-game-quiz/pairs/my-current`)
      .set("Authorization", `Bearer ${tokens[1].accessToken}`)
      .expect(HTTP.NOT_FOUND_404);

    const response = await request(app.getHttpServer())
      .get(`${URL}/pair-game-quiz/pairs/${game.id}`)
      .set("Authorization", `Bearer ${tokens[0].accessToken}`);

    game = response.body;

    expect(response).toBeDefined();
    expect(response.status).toBe(HTTP.OK_200);
    expect(game).toStrictEqual({
      id: expect.any(String),
      firstPlayerProgress: {
        answers: [
          {
            questionId: expect.any(String),
            answerStatus: expect.any(String),
            addedAt: expect.any(String)
          },
          {
            questionId: expect.any(String),
            answerStatus: expect.any(String),
            addedAt: expect.any(String)
          },
          {
            questionId: expect.any(String),
            answerStatus: expect.any(String),
            addedAt: expect.any(String)
          },
          {
            questionId: expect.any(String),
            answerStatus: expect.any(String),
            addedAt: expect.any(String)
          },
          {
            questionId: expect.any(String),
            answerStatus: expect.any(String),
            addedAt: expect.any(String)
          }
        ],
        player: {
          id: users[0].id,
          login: users[0].login
        },
        score: 6
      },
      secondPlayerProgress: {
        answers: [
          {
            questionId: expect.any(String),
            answerStatus: expect.any(String),
            addedAt: expect.any(String)
          },
          {
            questionId: expect.any(String),
            answerStatus: expect.any(String),
            addedAt: expect.any(String)
          },
          {
            questionId: expect.any(String),
            answerStatus: expect.any(String),
            addedAt: expect.any(String)
          },
          {
            questionId: expect.any(String),
            answerStatus: expect.any(String),
            addedAt: expect.any(String)
          },
          {
            questionId: expect.any(String),
            answerStatus: expect.any(String),
            addedAt: expect.any(String)
          }
        ],
        player: {
          id: users[1].id,
          login: users[1].login
        },
        score: 3
      },
      questions: [
        {id: expect.any(String), body: expect.any(String)},
        {id: expect.any(String), body: expect.any(String)},
        {id: expect.any(String), body: expect.any(String)},
        {id: expect.any(String), body: expect.any(String)},
        {id: expect.any(String), body: expect.any(String)},
      ],
      status: "Finished",
      pairCreatedDate: expect.any(String),
      startGameDate: expect.any(String),
      finishGameDate: expect.any(String),
    });

    game_02 = game;
  });

  // TEST #5
  it("Create game_03 by user_01. Status 200", async () => {
    const response1 = await request(app.getHttpServer())
      .post(`${URL}/pair-game-quiz/pairs/connection`)
      .set("Authorization", `Bearer ${tokens[0].accessToken}`);

    const response2 = await request(app.getHttpServer())
      .post(`${URL}/pair-game-quiz/pairs/connection`)
      .set("Authorization", `Bearer ${tokens[1].accessToken}`);

    let game = response2.body;

    for (let i = 0; i < 3; i++) {
      const pl2_ans = await request(app.getHttpServer())
        .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
        .set("Authorization", `Bearer ${tokens[1].accessToken}`)
        .send({answer: "zizza"});
    }

    for (let i = 0; i < 3; i++) {
      const pl1_ans = await request(app.getHttpServer())
        .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
        .set("Authorization", `Bearer ${tokens[0].accessToken}`)
        .send({answer: "pizza"});
    }

    for (let i = 0; i < 2; i++) {
      const pl2_ans = await request(app.getHttpServer())
        .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
        .set("Authorization", `Bearer ${tokens[1].accessToken}`)
        .send({answer: "pizza"});
    }

    await request(app.getHttpServer())
      .get(`${URL}/pair-game-quiz/pairs/my-current`)
      .set("Authorization", `Bearer ${tokens[1].accessToken}`)
      .expect(HTTP.OK_200);

    console.log(new Date().toISOString());

    await new Promise((resolve, reject) => {
      setTimeout(() => resolve(1), 10000)
    });

    console.log(new Date().toISOString())

    await request(app.getHttpServer())
      .get(`${URL}/pair-game-quiz/pairs/my-current`)
      .set("Authorization", `Bearer ${tokens[1].accessToken}`)
      .expect(HTTP.NOT_FOUND_404);

    const response = await request(app.getHttpServer())
      .get(`${URL}/pair-game-quiz/pairs/${game.id}`)
      .set("Authorization", `Bearer ${tokens[1].accessToken}`);

    game = response.body;

    expect(response).toBeDefined();
    expect(response.status).toBe(HTTP.OK_200);
    expect(game).toStrictEqual({
      id: expect.any(String),
      firstPlayerProgress: {
        answers: [
          {
            questionId: expect.any(String),
            answerStatus: expect.any(String),
            addedAt: expect.any(String)
          },
          {
            questionId: expect.any(String),
            answerStatus: expect.any(String),
            addedAt: expect.any(String)
          },
          {
            questionId: expect.any(String),
            answerStatus: expect.any(String),
            addedAt: expect.any(String)
          },
          {
            questionId: expect.any(String),
            answerStatus: expect.any(String),
            addedAt: expect.any(String)
          },
          {
            questionId: expect.any(String),
            answerStatus: expect.any(String),
            addedAt: expect.any(String)
          }
        ],
        player: {
          id: users[0].id,
          login: users[0].login
        },
        score: 3
      },
      secondPlayerProgress: {
        answers: [
          {
            questionId: expect.any(String),
            answerStatus: expect.any(String),
            addedAt: expect.any(String)
          },
          {
            questionId: expect.any(String),
            answerStatus: expect.any(String),
            addedAt: expect.any(String)
          },
          {
            questionId: expect.any(String),
            answerStatus: expect.any(String),
            addedAt: expect.any(String)
          },
          {
            questionId: expect.any(String),
            answerStatus: expect.any(String),
            addedAt: expect.any(String)
          },
          {
            questionId: expect.any(String),
            answerStatus: expect.any(String),
            addedAt: expect.any(String)
          }
        ],
        player: {
          id: users[1].id,
          login: users[1].login
        },
        score: 3
      },
      questions: [
        {id: expect.any(String), body: expect.any(String)},
        {id: expect.any(String), body: expect.any(String)},
        {id: expect.any(String), body: expect.any(String)},
        {id: expect.any(String), body: expect.any(String)},
        {id: expect.any(String), body: expect.any(String)},
      ],
      status: "Finished",
      pairCreatedDate: expect.any(String),
      startGameDate: expect.any(String),
      finishGameDate: expect.any(String),
    });

    game_03 = game;
  });

  // TEST #6
  it("Create game_03 by user_01. Status 200", async () => {
    const response1 = await request(app.getHttpServer())
      .post(`${URL}/pair-game-quiz/pairs/connection`)
      .set("Authorization", `Bearer ${tokens[0].accessToken}`);

    const response2 = await request(app.getHttpServer())
      .post(`${URL}/pair-game-quiz/pairs/connection`)
      .set("Authorization", `Bearer ${tokens[1].accessToken}`);

    let game = response2.body;

    for (let i = 0; i < 3; i++) {
      const pl2_ans = await request(app.getHttpServer())
        .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
        .set("Authorization", `Bearer ${tokens[1].accessToken}`)
        .send({answer: "zizza"});
    }

    for (let i = 0; i < 4; i++) {
      const pl1_ans = await request(app.getHttpServer())
        .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
        .set("Authorization", `Bearer ${tokens[0].accessToken}`)
        .send({answer: "pizza"});
    }

    const response3 = await request(app.getHttpServer())
      .post(`${URL}/pair-game-quiz/pairs/connection`)
      .set("Authorization", `Bearer ${tokens[2].accessToken}`);

    const response4 = await request(app.getHttpServer())
      .post(`${URL}/pair-game-quiz/pairs/connection`)
      .set("Authorization", `Bearer ${tokens[3].accessToken}`);

    let game2 = response4.body;

    for (let i = 0; i < 5; i++) {
      const pl3_ans = await request(app.getHttpServer())
        .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
        .set("Authorization", `Bearer ${tokens[2].accessToken}`)
        .send({answer: "pizza"});
    }

    for (let i = 0; i < 2; i++) {
      const pl4_ans = await request(app.getHttpServer())
        .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
        .set("Authorization", `Bearer ${tokens[3].accessToken}`)
        .send({answer: "pizza"});
    }

    for (let i = 0; i < 2; i++) {
      const pl2_ans = await request(app.getHttpServer())
        .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
        .set("Authorization", `Bearer ${tokens[1].accessToken}`)
        .send({answer: "pizza"});
    }

    console.log(new Date().toISOString());

    await new Promise((resolve, reject) => {
      setTimeout(() => resolve(1), 10000)
    });

    console.log(new Date().toISOString())

    const response5 = await request(app.getHttpServer())
      .get(`${URL}/pair-game-quiz/pairs/${game.id}`)
      .set("Authorization", `Bearer ${tokens[1].accessToken}`);

    game = response5.body;

    expect(response5).toBeDefined();
    expect(response5.status).toBe(HTTP.OK_200);
    expect(game).toStrictEqual({
      id: expect.any(String),
      firstPlayerProgress: {
        answers: [
          {
            questionId: expect.any(String),
            answerStatus: expect.any(String),
            addedAt: expect.any(String)
          },
          {
            questionId: expect.any(String),
            answerStatus: expect.any(String),
            addedAt: expect.any(String)
          },
          {
            questionId: expect.any(String),
            answerStatus: expect.any(String),
            addedAt: expect.any(String)
          },
          {
            questionId: expect.any(String),
            answerStatus: expect.any(String),
            addedAt: expect.any(String)
          },
          {
            questionId: expect.any(String),
            answerStatus: expect.any(String),
            addedAt: expect.any(String)
          }
        ],
        player: {
          id: users[0].id,
          login: users[0].login
        },
        score: 4
      },
      secondPlayerProgress: {
        answers: [
          {
            questionId: expect.any(String),
            answerStatus: expect.any(String),
            addedAt: expect.any(String)
          },
          {
            questionId: expect.any(String),
            answerStatus: expect.any(String),
            addedAt: expect.any(String)
          },
          {
            questionId: expect.any(String),
            answerStatus: expect.any(String),
            addedAt: expect.any(String)
          },
          {
            questionId: expect.any(String),
            answerStatus: expect.any(String),
            addedAt: expect.any(String)
          },
          {
            questionId: expect.any(String),
            answerStatus: expect.any(String),
            addedAt: expect.any(String)
          }
        ],
        player: {
          id: users[1].id,
          login: users[1].login
        },
        score: 3
      },
      questions: [
        {id: expect.any(String), body: expect.any(String)},
        {id: expect.any(String), body: expect.any(String)},
        {id: expect.any(String), body: expect.any(String)},
        {id: expect.any(String), body: expect.any(String)},
        {id: expect.any(String), body: expect.any(String)},
      ],
      status: "Finished",
      pairCreatedDate: expect.any(String),
      startGameDate: expect.any(String),
      finishGameDate: expect.any(String),
    });

    game_04 = game;

    const response6 = await request(app.getHttpServer())
      .get(`${URL}/pair-game-quiz/pairs/${game2.id}`)
      .set("Authorization", `Bearer ${tokens[2].accessToken}`);

    game = response6.body;

    expect(response6).toBeDefined();
    expect(response6.status).toBe(HTTP.OK_200);
    expect(game).toStrictEqual({
      id: expect.any(String),
      firstPlayerProgress: {
        answers: [
          {
            questionId: expect.any(String),
            answerStatus: expect.any(String),
            addedAt: expect.any(String)
          },
          {
            questionId: expect.any(String),
            answerStatus: expect.any(String),
            addedAt: expect.any(String)
          },
          {
            questionId: expect.any(String),
            answerStatus: expect.any(String),
            addedAt: expect.any(String)
          },
          {
            questionId: expect.any(String),
            answerStatus: expect.any(String),
            addedAt: expect.any(String)
          },
          {
            questionId: expect.any(String),
            answerStatus: expect.any(String),
            addedAt: expect.any(String)
          }
        ],
        player: {
          id: users[2].id,
          login: users[2].login
        },
        score: 6
      },
      secondPlayerProgress: {
        answers: [
          {
            questionId: expect.any(String),
            answerStatus: expect.any(String),
            addedAt: expect.any(String)
          },
          {
            questionId: expect.any(String),
            answerStatus: expect.any(String),
            addedAt: expect.any(String)
          },
          {
            questionId: expect.any(String),
            answerStatus: expect.any(String),
            addedAt: expect.any(String)
          },
          {
            questionId: expect.any(String),
            answerStatus: expect.any(String),
            addedAt: expect.any(String)
          },
          {
            questionId: expect.any(String),
            answerStatus: expect.any(String),
            addedAt: expect.any(String)
          }
        ],
        player: {
          id: users[3].id,
          login: users[3].login
        },
        score: 2
      },
      questions: [
        {id: expect.any(String), body: expect.any(String)},
        {id: expect.any(String), body: expect.any(String)},
        {id: expect.any(String), body: expect.any(String)},
        {id: expect.any(String), body: expect.any(String)},
        {id: expect.any(String), body: expect.any(String)},
      ],
      status: "Finished",
      pairCreatedDate: expect.any(String),
      startGameDate: expect.any(String),
      finishGameDate: expect.any(String),
    });

    game_05 = game;
  });
});