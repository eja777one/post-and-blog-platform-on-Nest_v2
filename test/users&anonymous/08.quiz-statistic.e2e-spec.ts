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
//   {login: "user4", password: "user4pass", email: "user4@gmail.com"}
// ];
//
// const loginInput = [
//   {loginOrEmail: "user1@gmail.com", password: "user1pass"},
//   {loginOrEmail: "user2@gmail.com", password: "user2pass"},
//   {loginOrEmail: "user3@gmail.com", password: "user3pass"},
//   {loginOrEmail: "user4@gmail.com", password: "user4pass"}
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
//   it("Create 4 users by SuperAdmin. Status 201", async () => {
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
//   it("Login 4 users. Status 200", async () => {
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
//     const response1 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/connection`)
//       .set("Authorization", `Bearer ${tokens[0].accessToken}`);
//
//     let game = response1.body;
//
//     const response2 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/connection`)
//       .set("Authorization", `Bearer ${tokens[1].accessToken}`);
//
//     game = response2.body;
//
//     const pl1_ans1 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[0].accessToken}`)
//       .send({answer: "pizza"});
//
//     const pl1_ans2 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[0].accessToken}`)
//       .send({answer: "zizza"});
//
//     const pl2_ans1 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[1].accessToken}`)
//       .send({answer: "pizza"});
//
//     const pl2_ans2 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[1].accessToken}`)
//       .send({answer: "zizza"});
//
//     const pl2_ans3 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[1].accessToken}`)
//       .send({answer: "zizza"});
//
//     const pl2_ans4 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[1].accessToken}`)
//       .send({answer: "zizza"});
//
//     const pl2_ans5 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[1].accessToken}`)
//       .send({answer: "zizza"});
//
//     const pl1_ans3 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[0].accessToken}`)
//       .send({answer: "pizza"});
//
//     const pl1_ans4 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[0].accessToken}`)
//       .send({answer: "pizza"});
//
//     const pl1_ans5 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[0].accessToken}`)
//       .send({answer: "zizza"});
//     game_01 = game;
//   });
//
//   // TEST #4
//   it("Create game_02 by user_01. Status 200", async () => {
//     const response1 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/connection`)
//       .set("Authorization", `Bearer ${tokens[0].accessToken}`);
//
//     let game = response1.body;
//
//     const response2 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/connection`)
//       .set("Authorization", `Bearer ${tokens[1].accessToken}`);
//
//     game = response2.body;
//
//     const pl1_ans1 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[0].accessToken}`)
//       .send({answer: "pizza"});
//
//     const pl1_ans2 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[0].accessToken}`)
//       .send({answer: "zizza"});
//
//     const pl2_ans1 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[1].accessToken}`)
//       .send({answer: "pizza"});
//
//     const pl2_ans2 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[1].accessToken}`)
//       .send({answer: "zizza"});
//
//     const pl2_ans3 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[1].accessToken}`)
//       .send({answer: "zizza"});
//
//     const pl2_ans4 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[1].accessToken}`)
//       .send({answer: "zizza"});
//
//     const pl2_ans5 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[1].accessToken}`)
//       .send({answer: "zizza"});
//
//     const pl1_ans3 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[0].accessToken}`)
//       .send({answer: "pizza"});
//
//     const pl1_ans4 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[0].accessToken}`)
//       .send({answer: "pizza"});
//
//     const pl1_ans5 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[0].accessToken}`)
//       .send({answer: "zizza"});
//     game_01 = game;
//   });
//
//   // TEST #5
//   it("Create game_03 by user_02. Status 200", async () => {
//     const response1 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/connection`)
//       .set("Authorization", `Bearer ${tokens[1].accessToken}`);
//
//     let game = response1.body;
//
//     const response2 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/connection`)
//       .set("Authorization", `Bearer ${tokens[0].accessToken}`);
//
//     game = response2.body;
//
//     const pl1_ans1 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[1].accessToken}`)
//       .send({answer: "pizza"});
//
//     const pl1_ans2 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[1].accessToken}`)
//       .send({answer: "zizza"});
//
//     const pl2_ans1 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[0].accessToken}`)
//       .send({answer: "pizza"});
//
//     const pl2_ans2 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[0].accessToken}`)
//       .send({answer: "zizza"});
//
//     const pl2_ans3 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[0].accessToken}`)
//       .send({answer: "zizza"});
//
//     const pl2_ans4 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[0].accessToken}`)
//       .send({answer: "zizza"});
//
//     const pl2_ans5 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[0].accessToken}`)
//       .send({answer: "zizza"});
//
//     const pl1_ans3 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[1].accessToken}`)
//       .send({answer: "pizza"});
//
//     const pl1_ans4 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[1].accessToken}`)
//       .send({answer: "pizza"});
//
//     const pl1_ans5 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[1].accessToken}`)
//       .send({answer: "zizza"});
//     game_01 = game;
//   });
//
//   // TEST #6
//   it("Create game_04 by user_02. Status 200", async () => {
//     const response1 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/connection`)
//       .set("Authorization", `Bearer ${tokens[1].accessToken}`);
//
//     let game = response1.body;
//
//     const response2 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/connection`)
//       .set("Authorization", `Bearer ${tokens[0].accessToken}`);
//
//     game = response2.body;
//
//     const pl1_ans1 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[1].accessToken}`)
//       .send({answer: "pizza"});
//
//     const pl1_ans2 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[1].accessToken}`)
//       .send({answer: "zizza"});
//
//     const pl2_ans1 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[0].accessToken}`)
//       .send({answer: "pizza"});
//
//     const pl2_ans2 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[0].accessToken}`)
//       .send({answer: "zizza"});
//
//     const pl2_ans3 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[0].accessToken}`)
//       .send({answer: "zizza"});
//
//     const pl2_ans4 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[0].accessToken}`)
//       .send({answer: "zizza"});
//
//     const pl2_ans5 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[0].accessToken}`)
//       .send({answer: "zizza"});
//
//     const pl1_ans3 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[1].accessToken}`)
//       .send({answer: "pizza"});
//
//     const pl1_ans4 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[1].accessToken}`)
//       .send({answer: "pizza"});
//
//     const pl1_ans5 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[1].accessToken}`)
//       .send({answer: "zizza"});
//     game_01 = game;
//   });
//
//   // TEST #7
//   it("Create game_05 by user_01. Status 200", async () => {
//     const response1 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/connection`)
//       .set("Authorization", `Bearer ${tokens[0].accessToken}`);
//
//     let game = response1.body;
//
//     const response2 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/connection`)
//       .set("Authorization", `Bearer ${tokens[2].accessToken}`);
//
//     game = response2.body;
//
//     const pl1_ans1 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[0].accessToken}`)
//       .send({answer: "pizza"});
//
//     const pl1_ans2 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[0].accessToken}`)
//       .send({answer: "zizza"});
//
//     const pl2_ans1 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[2].accessToken}`)
//       .send({answer: "pizza"});
//
//     const pl2_ans2 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[2].accessToken}`)
//       .send({answer: "zizza"});
//
//     const pl2_ans3 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[2].accessToken}`)
//       .send({answer: "zizza"});
//
//     const pl2_ans4 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[2].accessToken}`)
//       .send({answer: "zizza"});
//
//     const pl2_ans5 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[2].accessToken}`)
//       .send({answer: "zizza"});
//
//     const pl1_ans3 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[0].accessToken}`)
//       .send({answer: "pizza"});
//
//     const pl1_ans4 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[0].accessToken}`)
//       .send({answer: "zizza"});
//
//     const pl1_ans5 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[0].accessToken}`)
//       .send({answer: "zizza"});
//     game_01 = game;
//   });
//
//   // TEST #8
//   it("Create game_06 by user_01. Status 200", async () => {
//     const response1 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/connection`)
//       .set("Authorization", `Bearer ${tokens[0].accessToken}`);
//
//     let game = response1.body;
//
//     const response2 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/connection`)
//       .set("Authorization", `Bearer ${tokens[3].accessToken}`);
//
//     game = response2.body;
//
//     const pl2_ans1 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[3].accessToken}`)
//       .send({answer: "pizza"});
//
//     const pl2_ans2 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[3].accessToken}`)
//       .send({answer: "pizza"});
//
//     const pl1_ans1 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[0].accessToken}`)
//       .send({answer: "zizza"});
//
//     const pl2_ans3 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[3].accessToken}`)
//       .send({answer: "pizza"});
//
//     const pl2_ans4 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[3].accessToken}`)
//       .send({answer: "pizza"});
//
//     const pl1_ans2 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[0].accessToken}`)
//       .send({answer: "zizza"});
//
//     const pl1_ans3 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[0].accessToken}`)
//       .send({answer: "zizza"});
//
//     const pl1_ans4 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[0].accessToken}`)
//       .send({answer: "zizza"});
//
//     const pl1_ans5 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[0].accessToken}`)
//       .send({answer: "zizza"});
//
//     const pl2_ans5 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[3].accessToken}`)
//       .send({answer: "pizza"});
//     game_01 = game;
//   });
//
//   // TEST #9
//   it("Create game_07 by user_01. Status 200", async () => {
//     const response1 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/connection`)
//       .set("Authorization", `Bearer ${tokens[3].accessToken}`);
//
//     let game = response1.body;
//
//     const response2 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/connection`)
//       .set("Authorization", `Bearer ${tokens[0].accessToken}`);
//
//     game = response2.body;
//
//     const pl2_ans1 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[0].accessToken}`)
//       .send({answer: "pizza"});
//
//     const pl2_ans2 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[0].accessToken}`)
//       .send({answer: "pizza"});
//
//     const pl1_ans1 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[3].accessToken}`)
//       .send({answer: "zizza"});
//
//     const pl2_ans3 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[0].accessToken}`)
//       .send({answer: "pizza"});
//
//     const pl2_ans4 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[0].accessToken}`)
//       .send({answer: "pizza"});
//
//     const pl1_ans2 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[3].accessToken}`)
//       .send({answer: "zizza"});
//
//     const pl1_ans3 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[3].accessToken}`)
//       .send({answer: "zizza"});
//
//     const pl1_ans4 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[3].accessToken}`)
//       .send({answer: "zizza"});
//
//     const pl1_ans5 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[3].accessToken}`)
//       .send({answer: "zizza"});
//
//     const pl2_ans5 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[0].accessToken}`)
//       .send({answer: "pizza"});
//     game_01 = game;
//   });
//
//   // TEST #10
//   it("Create game_08 by user_02. Status 200", async () => {
//     const response1 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/connection`)
//       .set("Authorization", `Bearer ${tokens[1].accessToken}`);
//
//     let game = response1.body;
//
//     const response2 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/connection`)
//       .set("Authorization", `Bearer ${tokens[3].accessToken}`);
//
//     game = response2.body;
//
//     const pl1_ans1 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[1].accessToken}`)
//       .send({answer: "pizza"});
//
//     const pl1_ans2 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[1].accessToken}`)
//       .send({answer: "zizza"});
//
//     const pl2_ans1 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[3].accessToken}`)
//       .send({answer: "pizza"});
//
//     const pl2_ans2 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[3].accessToken}`)
//       .send({answer: "zizza"});
//
//     const pl2_ans3 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[3].accessToken}`)
//       .send({answer: "zizza"});
//
//     const pl2_ans4 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[3].accessToken}`)
//       .send({answer: "zizza"});
//
//     const pl2_ans5 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[3].accessToken}`)
//       .send({answer: "zizza"});
//
//     const pl1_ans3 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[1].accessToken}`)
//       .send({answer: "pizza"});
//
//     const pl1_ans4 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[1].accessToken}`)
//       .send({answer: "pizza"});
//
//     const pl1_ans5 = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${tokens[1].accessToken}`)
//       .send({answer: "zizza"});
//     game_01 = game;
//   });
//
//   // TEST #11
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
//       sumScore: 17,
//       avgScores: 2.43,
//       gamesCount: 7,
//       winsCount: 3,
//       lossesCount: 3,
//       drawsCount: 1
//     });
//   });
//
//   // TEST #12
//   it("Anonymous try to get top users. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .get(`${URL}/pair-game-quiz/users/top`);
//
//     const statistic = response.body;
//
//     expect(response).toBeDefined();
//     expect(response.status).toBe(HTTP.OK_200);
//     expect(statistic).toStrictEqual({
//       pagesCount: 1,
//       page: 1,
//       pageSize: 10,
//       totalCount: 4,
//       items: [
//         {
//           sumScore: 13,
//           avgScores: 2.6,
//           gamesCount: 5,
//           winsCount: 3,
//           lossesCount: 2,
//           drawsCount: 0,
//           player: {
//             id: expect.any(String),
//             login: "user2",
//           }
//         },
//         {
//           sumScore: 17,
//           avgScores: 2.43,
//           gamesCount: 7,
//           winsCount: 3,
//           lossesCount: 3,
//           drawsCount: 1,
//           player: {
//             id: expect.any(String),
//             login: "user1",
//           }
//         },
//         {
//           sumScore: 7,
//           avgScores: 2.33,
//           gamesCount: 3,
//           winsCount: 1,
//           lossesCount: 2,
//           drawsCount: 0,
//           player: {
//             id: expect.any(String),
//             login: "user4",
//           }
//         },
//         {
//           sumScore: 2,
//           avgScores: 2,
//           gamesCount: 1,
//           winsCount: 0,
//           lossesCount: 0,
//           drawsCount: 1,
//           player: {
//             id: expect.any(String),
//             login: "user3",
//           }
//         },
//       ]
//     });
//   });
// });