// import {startApp} from "../../src/application/start.app";
// import {Test, TestingModule} from "@nestjs/testing";
// import {INestApplication} from "@nestjs/common";
// import * as request from "supertest";
// import {AppModule} from "../../src/app.module";
// import {HTTP} from "../../src/types";
// import {URL} from "../dataForTests";
// import {GamePairViewModel, SAQuestionViewModel} from "../../src/quiz/quiz.types";
//
// const questionsInput = [
//   {
//     body: "What's the Italian word for pie?",
//     correctAnswers: ["Pizza", "pizza"]
//   },
//
//   {
//     body: "What's the Italian word for pie?",
//     correctAnswers: ["Pizza", "pizza"]
//   },
//
//   {
//     body: "What's the Italian word for pie?",
//     correctAnswers: ["Pizza", "pizza"]
//   },
//
//   {
//     body: "What's the Italian word for pie?",
//     correctAnswers: ["Pizza", "pizza"]
//   },
//
//   {
//     body: "What's the Italian word for pie?",
//     correctAnswers: ["Pizza", "pizza"]
//   }
// ];
//
// const userInput = [
//   {login: "user1", password: "user1pass", email: "user1@gmail.com"},
//   {login: "user2", password: "user2pass", email: "user2@gmail.com"},
//   {login: "user3", password: "user3pass", email: "user3@gmail.com"},
//   {login: "user4", password: "user4pass", email: "user4@gmail.com"},
//   {login: "user5", password: "user5pass", email: "user5@gmail.com"},
//   {login: "user6", password: "user6pass", email: "user6@gmail.com"}
// ];
//
// const loginInput = [
//   {loginOrEmail: "user1@gmail.com", password: "user1pass"},
//   {loginOrEmail: "user2@gmail.com", password: "user2pass"},
//   {loginOrEmail: "user3@gmail.com", password: "user3pass"},
//   {loginOrEmail: "user4@gmail.com", password: "user4pass"},
//   {loginOrEmail: "user5@gmail.com", password: "user5pass"},
//   {loginOrEmail: "user6@gmail.com", password: "user6pass"}
// ];
//
// const users = [];
// const tokens = [];
//
// let questionsRec: SAQuestionViewModel[] = [];
//
// let game_01: GamePairViewModel;
// let game_02: GamePairViewModel;
// let game_03: GamePairViewModel;
//
// jest.setTimeout(15000);
//
// describe("QuizController (e2e)", () => {
//   let app: INestApplication;
//
//   beforeAll(async () => {
//     const moduleFixture: TestingModule =
//       await Test.createTestingModule({imports: [AppModule]}).compile();
//
//     app = moduleFixture.createNestApplication();
//     app = startApp(app);
//     await app.init();
//   });
//
//   it("Delete all data", async () => {
//     await request(app.getHttpServer())
//       .delete(`${URL}/testing/all-data`)
//       .auth("admin", "qwerty", {type: "basic"})
//       .expect(HTTP.NO_CONTENT_204);
//   });
//
//   // TEST #1
//   it("Create 6 users by SuperAdmin. Status 201", async () => {
//     for (let u of userInput) {
//       const response = await request(app.getHttpServer())
//         .post(`${URL}/sa/users`)
//         .auth("admin", "qwerty", {type: "basic"})
//         .send(u);
//
//       const user = response.body;
//       users.push(user);
//     }
//
//     expect(true).toBe(true);
//   });
//
//   // TEST #1
//   it("Login 6 users. Status 200", async () => {
//     for (let l of loginInput) {
//       const response = await request(app.getHttpServer())
//         .post(`${URL}/auth/login`)
//         .send(l);
//
//       const accessToken = response.body;
//       tokens.push(accessToken);
//     }
//
//     expect(true).toBe(true);
//   });
//
//   // TEST #2
//   it("Create 5 questions. Status 201", async () => {
//     for (let q of questionsInput) {
//       const response = await request(app.getHttpServer())
//         .post(`${URL}/sa/quiz/questions`)
//         .auth("admin", "qwerty", {type: "basic"})
//         .send(q);
//
//       const question = response.body;
//
//       questionsRec.push(question);
//     }
//     expect(true).toBe(true);
//   });
//
//   // TEST #3
//   it("Create game_01 by user_01. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/connection`)
//       .set("Authorization", `Bearer ${tokens[0].accessToken}`);
//
//     const game = response.body;
//
//     expect(response).toBeDefined();
//     expect(response.status).toBe(HTTP.OK_200);
//     expect(game).toStrictEqual({
//       id: expect.any(String),
//       firstPlayerProgress: {
//         answers: [],
//         player: {
//           id: users[0].id,
//           login: users[0].login
//         },
//         score: 0
//       },
//       secondPlayerProgress: null,
//       questions: null,
//       status: "PendingSecondPlayer",
//       pairCreatedDate: expect.any(String),
//       startGameDate: null,
//       finishGameDate: null
//     });
//
//     game_01 = game;
//   });
//
//   // TEST #3
//   it("User_01 try to get game by id. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .get(`${URL}/pair-game-quiz/pairs/${game_01.id}`)
//       .set("Authorization", `Bearer ${tokens[0].accessToken}`);
//
//     const game = response.body;
//
//     expect(response).toBeDefined();
//     expect(response.status).toBe(HTTP.OK_200);
//     expect(game).toStrictEqual(game_01);
//   });
//
//   // TEST #3
//   it("User_01 try to get current game. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .get(`${URL}/pair-game-quiz/pairs/my-current`)
//       .set("Authorization", `Bearer ${tokens[0].accessToken}`);
//
//     const game = response.body;
//
//     expect(response).toBeDefined();
//     expect(response.status).toBe(HTTP.OK_200);
//     expect(game).toStrictEqual(game_01);
//   });
//
//   // TEST #4
//   it("User_02 connect to game_01. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/connection`)
//       .set("Authorization", `Bearer ${tokens[1].accessToken}`);
//
//     const game = response.body;
//
//     expect(response).toBeDefined();
//     expect(response.status).toBe(HTTP.OK_200);
//     expect(game).toStrictEqual({
//       id: expect.any(String),
//       firstPlayerProgress: {
//         answers: [],
//         player: {
//           id: users[0].id,
//           login: users[0].login
//         },
//         score: 0
//       },
//       secondPlayerProgress: {
//         answers: [],
//         player: {
//           id: users[1].id,
//           login: users[1].login
//         },
//         score: 0
//       },
//       questions: [
//         {id: expect.any(String), body: expect.any(String)},
//         {id: expect.any(String), body: expect.any(String)},
//         {id: expect.any(String), body: expect.any(String)},
//         {id: expect.any(String), body: expect.any(String)},
//         {id: expect.any(String), body: expect.any(String)}
//       ],
//       status: "Active",
//       pairCreatedDate: expect.any(String),
//       startGameDate: expect.any(String),
//       finishGameDate: null
//     });
//
//     game_01 = game;
//   });
//
//   // TEST #4
//   it("User_02 try to get game by id. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .get(`${URL}/pair-game-quiz/pairs/${game_01.id}`)
//       .set("Authorization", `Bearer ${tokens[1].accessToken}`);
//
//     const game = response.body;
//
//     expect(response).toBeDefined();
//     expect(response.status).toBe(HTTP.OK_200);
//     expect(game).toStrictEqual(game_01);
//   });
//
//   // TEST #4
//   it("User_01 try to get game by id. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .get(`${URL}/pair-game-quiz/pairs/${game_01.id}`)
//       .set("Authorization", `Bearer ${tokens[0].accessToken}`);
//
//     const game = response.body;
//
//     expect(response).toBeDefined();
//     expect(response.status).toBe(HTTP.OK_200);
//     expect(game).toStrictEqual(game_01);
//   });
//
//   // TEST #4
//   it("User_01 try to get current game. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .get(`${URL}/pair-game-quiz/pairs/my-current`)
//       .set("Authorization", `Bearer ${tokens[0].accessToken}`);
//
//     const game = response.body;
//
//     expect(response).toBeDefined();
//     expect(response.status).toBe(HTTP.OK_200);
//     expect(game).toStrictEqual(game_01);
//   });
//
//   // TEST #4
//   it("User_01 try to get current game. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .get(`${URL}/pair-game-quiz/pairs/my-current`)
//       .set("Authorization", `Bearer ${tokens[1].accessToken}`);
//
//     const game = response.body;
//
//     expect(response).toBeDefined();
//     expect(response.status).toBe(HTTP.OK_200);
//     expect(game).toStrictEqual(game_01);
//   });
//
//   // TEST #5
//   it("User_01 CORRECT answer question in game_01. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[0].accessToken}`)
//       .send({answer: "pizza"});
//
//     const answerStatus = response.body;
//
//     expect(response).toBeDefined();
//     expect(response.status).toBe(HTTP.OK_200);
//     expect(answerStatus).toStrictEqual({
//       questionId: expect.any(String),
//       answerStatus: "Correct",
//       addedAt: expect.any(String)
//     });
//   });
//
//   // TEST #5
//   it("User_02 INCORRECT answer question in game_01. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[1].accessToken}`)
//       .send({answer: "zizza"});
//
//     const answerStatus = response.body;
//
//     expect(response).toBeDefined();
//     expect(response.status).toBe(HTTP.OK_200);
//     expect(answerStatus).toStrictEqual({
//       questionId: expect.any(String),
//       answerStatus: "Incorrect",
//       addedAt: expect.any(String)
//     });
//   });
//
//   // TEST #5
//   it("User_02 CORRECT answer question in game_01. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[1].accessToken}`)
//       .send({answer: "pizza"});
//
//     const answerStatus = response.body;
//
//     expect(response).toBeDefined();
//     expect(response.status).toBe(HTTP.OK_200);
//     expect(answerStatus).toStrictEqual({
//       questionId: expect.any(String),
//       answerStatus: "Correct",
//       addedAt: expect.any(String)
//     });
//   });
//
//   // TEST #5
//   it("User_01 try to get current game. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .get(`${URL}/pair-game-quiz/pairs/my-current`)
//       .set("Authorization", `Bearer ${tokens[0].accessToken}`);
//
//     const game = response.body;
//
//     expect(response).toBeDefined();
//     expect(response.status).toBe(HTTP.OK_200);
//     expect(game).toStrictEqual({
//       id: expect.any(String),
//       firstPlayerProgress: {
//         answers: [
//           {
//             questionId: expect.any(String),
//             answerStatus: expect.any(String),
//             addedAt: expect.any(String)
//           }
//         ],
//         player: {
//           id: users[0].id,
//           login: users[0].login
//         },
//         score: 1
//       },
//       secondPlayerProgress: {
//         answers: [
//           {
//             questionId: expect.any(String),
//             answerStatus: expect.any(String),
//             addedAt: expect.any(String)
//           },
//           {
//             questionId: expect.any(String),
//             answerStatus: expect.any(String),
//             addedAt: expect.any(String)
//           }
//         ],
//         player: {
//           id: users[1].id,
//           login: users[1].login
//         },
//         score: 1
//       },
//       questions: [
//         {id: expect.any(String), body: expect.any(String)},
//         {id: expect.any(String), body: expect.any(String)},
//         {id: expect.any(String), body: expect.any(String)},
//         {id: expect.any(String), body: expect.any(String)},
//         {id: expect.any(String), body: expect.any(String)}
//       ],
//       status: "Active",
//       pairCreatedDate: expect.any(String),
//       startGameDate: expect.any(String),
//       finishGameDate: null
//     });
//
//     game_01 = game;
//   });
//
//   // TEST #5
//   it("User_02 try to get current game. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .get(`${URL}/pair-game-quiz/pairs/my-current`)
//       .set("Authorization", `Bearer ${tokens[1].accessToken}`);
//
//     const game = response.body;
//
//     expect(response).toBeDefined();
//     expect(response.status).toBe(HTTP.OK_200);
//     expect(game).toStrictEqual(game_01);
//   });
//
//   // TEST #5
//   it("User_01 try to get game by id. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .get(`${URL}/pair-game-quiz/pairs/${game_01.id}`)
//       .set("Authorization", `Bearer ${tokens[0].accessToken}`);
//
//     const game = response.body;
//
//     expect(response).toBeDefined();
//     expect(response.status).toBe(HTTP.OK_200);
//     expect(game).toStrictEqual(game_01);
//   });
//
//   // TEST #5
//   it("User_02 try to get game by id. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .get(`${URL}/pair-game-quiz/pairs/${game_01.id}`)
//       .set("Authorization", `Bearer ${tokens[1].accessToken}`);
//
//     const game = response.body;
//
//     expect(response).toBeDefined();
//     expect(response.status).toBe(HTTP.OK_200);
//     expect(game).toStrictEqual(game_01);
//   });
//
//   // TEST #6
//   it("Create game_02 by user_03. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/connection`)
//       .set("Authorization", `Bearer ${tokens[2].accessToken}`);
//
//     const game = response.body;
//
//     expect(response).toBeDefined();
//     expect(response.status).toBe(HTTP.OK_200);
//     expect(game).toStrictEqual({
//       id: expect.any(String),
//       firstPlayerProgress: {
//         answers: [],
//         player: {
//           id: users[2].id,
//           login: users[2].login
//         },
//         score: 0
//       },
//       secondPlayerProgress: null,
//       questions: null,
//       status: "PendingSecondPlayer",
//       pairCreatedDate: expect.any(String),
//       startGameDate: null,
//       finishGameDate: null
//     });
//
//     game_02 = game;
//   });
//
//   // TEST #6
//   it("User_04 connect to game_02. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/connection`)
//       .set("Authorization", `Bearer ${tokens[3].accessToken}`);
//
//     const game = response.body;
//
//     expect(response).toBeDefined();
//     expect(response.status).toBe(HTTP.OK_200);
//     expect(game).toStrictEqual({
//       id: expect.any(String),
//       firstPlayerProgress: {
//         answers: [],
//         player: {
//           id: users[2].id,
//           login: users[2].login
//         },
//         score: 0
//       },
//       secondPlayerProgress: {
//         answers: [],
//         player: {
//           id: users[3].id,
//           login: users[3].login
//         },
//         score: 0
//       },
//       questions: [
//         {id: expect.any(String), body: expect.any(String)},
//         {id: expect.any(String), body: expect.any(String)},
//         {id: expect.any(String), body: expect.any(String)},
//         {id: expect.any(String), body: expect.any(String)},
//         {id: expect.any(String), body: expect.any(String)}
//       ],
//       status: "Active",
//       pairCreatedDate: expect.any(String),
//       startGameDate: expect.any(String),
//       finishGameDate: null
//     });
//
//     game_02 = game;
//   });
//
//   // TEST #6
//   it("User_03 CORRECT answer question in game_02. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[2].accessToken}`)
//       .send({answer: "pizza"});
//
//     const answerStatus = response.body;
//
//     expect(response).toBeDefined();
//     expect(response.status).toBe(HTTP.OK_200);
//     expect(answerStatus).toStrictEqual({
//       questionId: expect.any(String),
//       answerStatus: "Correct",
//       addedAt: expect.any(String)
//     });
//   });
//
//   // TEST #6
//   it("User_04 INCORRECT answer question in game_02. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[3].accessToken}`)
//       .send({answer: "zizza"});
//
//     const answerStatus = response.body;
//
//     expect(response).toBeDefined();
//     expect(response.status).toBe(HTTP.OK_200);
//     expect(answerStatus).toStrictEqual({
//       questionId: expect.any(String),
//       answerStatus: "Incorrect",
//       addedAt: expect.any(String)
//     });
//   });
//
//   // TEST #6
//   it("User_04 CORRECT answer question in game_02. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[3].accessToken}`)
//       .send({answer: "pizza"});
//
//     const answerStatus = response.body;
//
//     expect(response).toBeDefined();
//     expect(response.status).toBe(HTTP.OK_200);
//     expect(answerStatus).toStrictEqual({
//       questionId: expect.any(String),
//       answerStatus: "Correct",
//       addedAt: expect.any(String)
//     });
//   });
//
//   // TEST #6
//   it("User_03 try to get current game. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .get(`${URL}/pair-game-quiz/pairs/my-current`)
//       .set("Authorization", `Bearer ${tokens[2].accessToken}`);
//
//     const game = response.body;
//
//     expect(response).toBeDefined();
//     expect(response.status).toBe(HTTP.OK_200);
//     expect(game).toStrictEqual({
//       id: expect.any(String),
//       firstPlayerProgress: {
//         answers: [
//           {
//             questionId: expect.any(String),
//             answerStatus: expect.any(String),
//             addedAt: expect.any(String)
//           }
//         ],
//         player: {
//           id: users[2].id,
//           login: users[2].login
//         },
//         score: 1
//       },
//       secondPlayerProgress: {
//         answers: [
//           {
//             questionId: expect.any(String),
//             answerStatus: expect.any(String),
//             addedAt: expect.any(String)
//           },
//           {
//             questionId: expect.any(String),
//             answerStatus: expect.any(String),
//             addedAt: expect.any(String)
//           }
//         ],
//         player: {
//           id: users[3].id,
//           login: users[3].login
//         },
//         score: 1
//       },
//       questions: [
//         {id: expect.any(String), body: expect.any(String)},
//         {id: expect.any(String), body: expect.any(String)},
//         {id: expect.any(String), body: expect.any(String)},
//         {id: expect.any(String), body: expect.any(String)},
//         {id: expect.any(String), body: expect.any(String)}
//       ],
//       status: "Active",
//       pairCreatedDate: expect.any(String),
//       startGameDate: expect.any(String),
//       finishGameDate: null
//     });
//
//     game_02 = game;
//   });
//
//   // TEST #6
//   it("User_04 try to get current game. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .get(`${URL}/pair-game-quiz/pairs/my-current`)
//       .set("Authorization", `Bearer ${tokens[3].accessToken}`);
//
//     const game = response.body;
//
//     expect(response).toBeDefined();
//     expect(response.status).toBe(HTTP.OK_200);
//     expect(game).toStrictEqual(game_02);
//   });
//
//   // TEST #6
//   it("User_03 try to get game by id. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .get(`${URL}/pair-game-quiz/pairs/${game_02.id}`)
//       .set("Authorization", `Bearer ${tokens[2].accessToken}`);
//
//     const game = response.body;
//
//     expect(response).toBeDefined();
//     expect(response.status).toBe(HTTP.OK_200);
//     expect(game).toStrictEqual(game_02);
//   });
//
//   // TEST #6
//   it("User_04 try to get game by id. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .get(`${URL}/pair-game-quiz/pairs/${game_02.id}`)
//       .set("Authorization", `Bearer ${tokens[3].accessToken}`);
//
//     const game = response.body;
//
//     expect(response).toBeDefined();
//     expect(response.status).toBe(HTTP.OK_200);
//     expect(game).toStrictEqual(game_02);
//   });
//
//   // TEST #7
//   it("User_01 CORRECT answer question in game_01. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[0].accessToken}`)
//       .send({answer: "pizza"});
//
//     const answerStatus = response.body;
//
//     expect(response).toBeDefined();
//     expect(response.status).toBe(HTTP.OK_200);
//     expect(answerStatus).toStrictEqual({
//       questionId: expect.any(String),
//       answerStatus: "Correct",
//       addedAt: expect.any(String)
//     });
//   });
//
//   // TEST #7
//   it("User_01 CORRECT answer question in game_01. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[0].accessToken}`)
//       .send({answer: "pizza"});
//
//     const answerStatus = response.body;
//
//     expect(response).toBeDefined();
//     expect(response.status).toBe(HTTP.OK_200);
//     expect(answerStatus).toStrictEqual({
//       questionId: expect.any(String),
//       answerStatus: "Correct",
//       addedAt: expect.any(String)
//     });
//   });
//
//   // TEST #7
//   it("User_02 CORRECT answer question in game_01. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[1].accessToken}`)
//       .send({answer: "pizza"});
//
//     const answerStatus = response.body;
//
//     expect(response).toBeDefined();
//     expect(response.status).toBe(HTTP.OK_200);
//     expect(answerStatus).toStrictEqual({
//       questionId: expect.any(String),
//       answerStatus: "Correct",
//       addedAt: expect.any(String)
//     });
//   });
//
//   // TEST #7
//   it("User_02 CORRECT answer question in game_01. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[1].accessToken}`)
//       .send({answer: "pizza"});
//
//     const answerStatus = response.body;
//
//     expect(response).toBeDefined();
//     expect(response.status).toBe(HTTP.OK_200);
//     expect(answerStatus).toStrictEqual({
//       questionId: expect.any(String),
//       answerStatus: "Correct",
//       addedAt: expect.any(String)
//     });
//   });
//
//   // TEST #7
//   it("User_01 INCORRECT answer question in game_01. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[0].accessToken}`)
//       .send({answer: "zizza"});
//
//     const answerStatus = response.body;
//
//     expect(response).toBeDefined();
//     expect(response.status).toBe(HTTP.OK_200);
//     expect(answerStatus).toStrictEqual({
//       questionId: expect.any(String),
//       answerStatus: "Incorrect",
//       addedAt: expect.any(String)
//     });
//   });
//
//   // TEST #7
//   it("User_01 CORRECT answer question in game_01. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[0].accessToken}`)
//       .send({answer: "pizza"});
//
//     const answerStatus = response.body;
//
//     expect(response).toBeDefined();
//     expect(response.status).toBe(HTTP.OK_200);
//     expect(answerStatus).toStrictEqual({
//       questionId: expect.any(String),
//       answerStatus: "Correct",
//       addedAt: expect.any(String)
//     });
//   });
//
//   // TEST #7
//   it("User_02 CORRECT answer question in game_01. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[1].accessToken}`)
//       .send({answer: "pizza"});
//
//     const answerStatus = response.body;
//
//     expect(response).toBeDefined();
//     expect(response.status).toBe(HTTP.OK_200);
//     expect(answerStatus).toStrictEqual({
//       questionId: expect.any(String),
//       answerStatus: "Correct",
//       addedAt: expect.any(String)
//     });
//   });
//
//   // TEST #7
//   it("User_01 try to get current game. Status 404", async () => {
//     const response = await request(app.getHttpServer())
//       .get(`${URL}/pair-game-quiz/pairs/my-current`)
//       .set("Authorization", `Bearer ${tokens[0].accessToken}`)
//       .expect(HTTP.NOT_FOUND_404);
//   });
//
//   // TEST #7
//   it("User_02 try to get current game. Status 404", async () => {
//     const response = await request(app.getHttpServer())
//       .get(`${URL}/pair-game-quiz/pairs/my-current`)
//       .set("Authorization", `Bearer ${tokens[1].accessToken}`)
//       .expect(HTTP.NOT_FOUND_404);
//   });
//
//   // TEST #7
//   it("User_01 try to get game_01 by id. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .get(`${URL}/pair-game-quiz/pairs/${game_01.id}`)
//       .set("Authorization", `Bearer ${tokens[0].accessToken}`);
//
//     const game = response.body;
//
//     expect(response).toBeDefined();
//     expect(response.status).toBe(HTTP.OK_200);
//     expect(game).toStrictEqual({
//       id: expect.any(String),
//       firstPlayerProgress: {
//         answers: [
//           {
//             questionId: expect.any(String),
//             answerStatus: expect.any(String),
//             addedAt: expect.any(String)
//           },
//           {
//             questionId: expect.any(String),
//             answerStatus: expect.any(String),
//             addedAt: expect.any(String)
//           },
//           {
//             questionId: expect.any(String),
//             answerStatus: expect.any(String),
//             addedAt: expect.any(String)
//           },
//           {
//             questionId: expect.any(String),
//             answerStatus: expect.any(String),
//             addedAt: expect.any(String)
//           },
//           {
//             questionId: expect.any(String),
//             answerStatus: expect.any(String),
//             addedAt: expect.any(String)
//           }
//         ],
//         player: {
//           id: users[0].id,
//           login: users[0].login
//         },
//         score: 5
//       },
//       secondPlayerProgress: {
//         answers: [
//           {
//             questionId: expect.any(String),
//             answerStatus: expect.any(String),
//             addedAt: expect.any(String)
//           },
//           {
//             questionId: expect.any(String),
//             answerStatus: expect.any(String),
//             addedAt: expect.any(String)
//           },
//           {
//             questionId: expect.any(String),
//             answerStatus: expect.any(String),
//             addedAt: expect.any(String)
//           },
//           {
//             questionId: expect.any(String),
//             answerStatus: expect.any(String),
//             addedAt: expect.any(String)
//           },
//           {
//             questionId: expect.any(String),
//             answerStatus: expect.any(String),
//             addedAt: expect.any(String)
//           }
//         ],
//         player: {
//           id: users[1].id,
//           login: users[1].login
//         },
//         score: 4
//       },
//       questions: [
//         {id: expect.any(String), body: expect.any(String)},
//         {id: expect.any(String), body: expect.any(String)},
//         {id: expect.any(String), body: expect.any(String)},
//         {id: expect.any(String), body: expect.any(String)},
//         {id: expect.any(String), body: expect.any(String)}
//       ],
//       status: "Finished",
//       pairCreatedDate: expect.any(String),
//       startGameDate: expect.any(String),
//       finishGameDate: expect.any(String)
//     });
//
//     game_01 = game;
//   });
//
//   // TEST #7
//   it("User_02 try to get game_01 by id. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .get(`${URL}/pair-game-quiz/pairs/${game_01.id}`)
//       .set("Authorization", `Bearer ${tokens[1].accessToken}`);
//
//     const game = response.body;
//
//     expect(response).toBeDefined();
//     expect(response.status).toBe(HTTP.OK_200);
//     expect(game).toStrictEqual(game_01);
//   });
//
//   // TEST #8
//   it("Create game_03 by user_02. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/connection`)
//       .set("Authorization", `Bearer ${tokens[1].accessToken}`);
//
//     const game = response.body;
//
//     expect(response).toBeDefined();
//     expect(response.status).toBe(HTTP.OK_200);
//     expect(game).toStrictEqual({
//       id: expect.any(String),
//       firstPlayerProgress: {
//         answers: [],
//         player: {
//           id: users[1].id,
//           login: users[1].login
//         },
//         score: 0
//       },
//       secondPlayerProgress: null,
//       questions: null,
//       status: "PendingSecondPlayer",
//       pairCreatedDate: expect.any(String),
//       startGameDate: null,
//       finishGameDate: null
//     });
//
//     game_03 = game;
//   });
//
//   // TEST #8
//   it("User_01 connect to game_03. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/connection`)
//       .set("Authorization", `Bearer ${tokens[0].accessToken}`);
//
//     const game = response.body;
//
//     expect(response).toBeDefined();
//     expect(response.status).toBe(HTTP.OK_200);
//     expect(game).toStrictEqual({
//       id: expect.any(String),
//       firstPlayerProgress: {
//         answers: [],
//         player: {
//           id: users[1].id,
//           login: users[1].login
//         },
//         score: 0
//       },
//       secondPlayerProgress: {
//         answers: [],
//         player: {
//           id: users[0].id,
//           login: users[0].login
//         },
//         score: 0
//       },
//       questions: [
//         {id: expect.any(String), body: expect.any(String)},
//         {id: expect.any(String), body: expect.any(String)},
//         {id: expect.any(String), body: expect.any(String)},
//         {id: expect.any(String), body: expect.any(String)},
//         {id: expect.any(String), body: expect.any(String)}
//       ],
//       status: "Active",
//       pairCreatedDate: expect.any(String),
//       startGameDate: expect.any(String),
//       finishGameDate: null
//     });
//
//     game_03 = game;
//   });
//
//   // TEST #8
//   it("User_02 CORRECT answer question in game_03. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[1].accessToken}`)
//       .send({answer: "pizza"});
//
//     const answerStatus = response.body;
//
//     expect(response).toBeDefined();
//     expect(response.status).toBe(HTTP.OK_200);
//     expect(answerStatus).toStrictEqual({
//       questionId: expect.any(String),
//       answerStatus: "Correct",
//       addedAt: expect.any(String)
//     });
//   });
//
//   // TEST #8
//   it("User_01 CORRECT answer question in game_03. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[0].accessToken}`)
//       .send({answer: "zizza"});
//
//     const answerStatus = response.body;
//
//     expect(response).toBeDefined();
//     expect(response.status).toBe(HTTP.OK_200);
//     expect(answerStatus).toStrictEqual({
//       questionId: expect.any(String),
//       answerStatus: "Incorrect",
//       addedAt: expect.any(String)
//     });
//   });
//
//   // TEST #8
//   it("User_01 CORRECT answer question in game_03. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[0].accessToken}`)
//       .send({answer: "pizza"});
//
//     const answerStatus = response.body;
//
//     expect(response).toBeDefined();
//     expect(response.status).toBe(HTTP.OK_200);
//     expect(answerStatus).toStrictEqual({
//       questionId: expect.any(String),
//       answerStatus: "Correct",
//       addedAt: expect.any(String)
//     });
//   });
//
//   // TEST #8
//   it("User_01 try to get game_03 by id. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .get(`${URL}/pair-game-quiz/pairs/${game_03.id}`)
//       .set("Authorization", `Bearer ${tokens[0].accessToken}`);
//
//     const game = response.body;
//
//     expect(response).toBeDefined();
//     expect(response.status).toBe(HTTP.OK_200);
//     expect(game).toStrictEqual({
//       id: expect.any(String),
//       firstPlayerProgress: {
//         answers: [
//           {
//             questionId: expect.any(String),
//             answerStatus: expect.any(String),
//             addedAt: expect.any(String)
//           }
//         ],
//         player: {
//           id: users[1].id,
//           login: users[1].login
//         },
//         score: 1
//       },
//       secondPlayerProgress: {
//         answers: [
//           {
//             questionId: expect.any(String),
//             answerStatus: expect.any(String),
//             addedAt: expect.any(String)
//           },
//           {
//             questionId: expect.any(String),
//             answerStatus: expect.any(String),
//             addedAt: expect.any(String)
//           }
//         ],
//         player: {
//           id: users[0].id,
//           login: users[0].login
//         },
//         score: 1
//       },
//       questions: [
//         {id: expect.any(String), body: expect.any(String)},
//         {id: expect.any(String), body: expect.any(String)},
//         {id: expect.any(String), body: expect.any(String)},
//         {id: expect.any(String), body: expect.any(String)},
//         {id: expect.any(String), body: expect.any(String)}
//       ],
//       status: "Active",
//       pairCreatedDate: expect.any(String),
//       startGameDate: expect.any(String),
//       finishGameDate: null
//     });
//
//     game_03 = game;
//   });
//
//   // TEST #8
//   it("User_02 try to get game_03 by id. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .get(`${URL}/pair-game-quiz/pairs/${game_03.id}`)
//       .set("Authorization", `Bearer ${tokens[1].accessToken}`);
//
//     const game = response.body;
//
//     expect(response).toBeDefined();
//     expect(response.status).toBe(HTTP.OK_200);
//     expect(game).toStrictEqual(game_03);
//   });
//
//   // TEST #8
//   it("User_01 try to get current game. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .get(`${URL}/pair-game-quiz/pairs/my-current`)
//       .set("Authorization", `Bearer ${tokens[0].accessToken}`);
//
//     const game = response.body;
//
//     expect(response).toBeDefined();
//     expect(response.status).toBe(HTTP.OK_200);
//     expect(game).toStrictEqual(game_03);
//   });
//
//   // TEST #8
//   it("User_02 try to get current game. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .get(`${URL}/pair-game-quiz/pairs/my-current`)
//       .set("Authorization", `Bearer ${tokens[1].accessToken}`);
//
//     const game = response.body;
//
//     expect(response).toBeDefined();
//     expect(response.status).toBe(HTTP.OK_200);
//     expect(game).toStrictEqual(game_03);
//   });
//
//   // TEST #9
//   it("User_02 try to get own games. Status 401", async () => {
//     const response = await request(app.getHttpServer())
//       .get(`${URL}/pair-game-quiz/pairs/my`)
//       .set("Authorization", `Bearer {tokens[1].accessToken}`);
//
//     const game = response.body;
//
//     expect(response).toBeDefined();
//     expect(response.status).toBe(HTTP.UNAUTHORIZED_401);
//   });
//
//   // TEST #9
//   it("User_02 try to get own games. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .get(`${URL}/pair-game-quiz/pairs/my`)
//       .set("Authorization", `Bearer ${tokens[1].accessToken}`);
//
//     const game = response.body;
//
//     expect(response).toBeDefined();
//     expect(response.status).toBe(HTTP.OK_200);
//     expect(game).toStrictEqual({
//       page: 1,
//       pageSize: 10,
//       pagesCount: 1,
//       totalCount: 2,
//       items: [game_03, game_01]
//     });
//   });
//
//   // TEST #10
//   it("User_02 try to get statistic. Status 401", async () => {
//     const response = await request(app.getHttpServer())
//       .get(`${URL}/pair-game-quiz/users/my-statistic`)
//       .set("Authorization", `Bearer {tokens[1].accessToken}`)
//       .expect(HTTP.UNAUTHORIZED_401);
//   });
//
//   // TEST #10
//   it("User_02 try to get statistic. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .get(`${URL}/pair-game-quiz/users/my-statistic`)
//       .set("Authorization", `Bearer ${tokens[1].accessToken}`);
//
//     const statistic = response.body;
//
//     expect(response).toBeDefined();
//     expect(response.status).toBe(HTTP.OK_200);
//     expect(statistic).toStrictEqual({
//       sumScore: 5,
//       avgScores: 2.5,
//       gamesCount: 2,
//       winsCount: 0,
//       lossesCount: 1,
//       drawsCount: 1
//     });
//   });
//
//   // TEST #10
//   it("User_01 try to get statistic. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .get(`${URL}/pair-game-quiz/users/my-statistic`)
//       .set("Authorization", `Bearer ${tokens[0].accessToken}`);
//
//     const statistic = response.body;
//
//     expect(response).toBeDefined();
//     expect(response.status).toBe(HTTP.OK_200);
//     expect(statistic).toStrictEqual({
//       sumScore: 6,
//       avgScores: 3,
//       gamesCount: 2,
//       winsCount: 1,
//       lossesCount: 0,
//       drawsCount: 1
//     });
//   });
//
//   // TEST #10
//   it("User_06 try to get statistic. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .get(`${URL}/pair-game-quiz/users/my-statistic`)
//       .set("Authorization", `Bearer ${tokens[5].accessToken}`);
//
//     const statistic = response.body;
//
//     expect(response).toBeDefined();
//     expect(response.status).toBe(HTTP.OK_200);
//     expect(statistic).toStrictEqual({
//       sumScore: 0,
//       avgScores: 0,
//       gamesCount: 0,
//       winsCount: 0,
//       lossesCount: 0,
//       drawsCount: 0
//     });
//   });
// });