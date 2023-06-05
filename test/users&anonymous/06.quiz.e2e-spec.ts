// import {startApp} from "../../src/application/start.app";
// import {Test, TestingModule} from "@nestjs/testing";
// import {INestApplication} from "@nestjs/common";
// import * as request from "supertest";
// import {AppModule} from "../../src/app.module";
// import {HTTP} from "../../src/types";
// import {
//   loginInput1, loginInput2, loginInput3, token, URL, user, userInput1,
//   userInput2, userInput3
// } from "../dataForTests";
// import {GamePairViewModel, SAQuestionViewModel}
//   from "../../src/quiz/quiz.types";
// import {v4 as uuidv4} from "uuid";
//
// const questionInput1 = {
//   body: "What element does 'O' represent on the periodic table?",
//   correctAnswers: ["Oxygen", "oxygen"]
// };
//
// const questionInput2 = {
//   body: "What's the Italian word for pie?",
//   correctAnswers: ["Pizza", "pizza"]
// };
//
// const questionInput3 = {
//   body: "How many colors are there in a rainbow?",
//   correctAnswers: ["7", "seven", "Seven"]
// };
//
// const questionInput4 = {
//   body: "How many sides are there in a triangle?",
//   correctAnswers: ["3", "three", "Three"]
// };
//
// const questionInput5 = {
//   body: "In which direction does the sunrise?",
//   correctAnswers: ["east", "East"]
// };
//
// const questionInput6 = {
//   body: "How many zeros are there in one hundred thousand?",
//   correctAnswers: ["5", "five", "Five"]
// };
//
// const questionInput7 = {
//   body: "How many millimeters are there in 1cm?",
//   correctAnswers: ["10", "ten", "Ten"]
// };
//
// const questionInput8 = {
//   body: "How many planets are there in our solar system?",
//   correctAnswers: ["8", "eight", "Eight"]
// };
//
// const questionInput9 = {
//   body: "What color symbolizes peace?",
//   correctAnswers: ["white", "White"]
// };
//
// const questionInput10 = {
//   body: "What covers approximately 71% of the Earth’s surface: Land or water?",
//   correctAnswers: ["water", "Water"]
// };
//
// const questionsInput = [
//   questionInput2, questionInput3, questionInput4, questionInput5, questionInput6,
//   questionInput7, questionInput8, questionInput9, questionInput10
// ];
//
// let user_01 = {...user};
// let user_02 = {...user};
// let user_03 = {...user};
// let token_01 = {...token};
// let token_02 = {...token};
// let token_03 = {...token};
//
// let questionsRec: SAQuestionViewModel[] = [];
//
// let quiz: GamePairViewModel;
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
//   it("Get questions. Status 200", async () => {
//     await request(app.getHttpServer())
//       .get(`${URL}/sa/quiz/questions`)
//       .auth("admin", "qwerty", {type: "basic"})
//       .expect(HTTP.OK_200, {
//         pagesCount: 0,
//         page: 1,
//         pageSize: 10,
//         totalCount: 0,
//         items: []
//       });
//   });
//
//   // TEST #2
//   it("Create question. Status 201", async () => {
//     const response = await request(app.getHttpServer())
//       .post(`${URL}/sa/quiz/questions`)
//       .auth("admin", "qwerty", {type: "basic"})
//       .send(questionInput1);
//
//     const question = response.body;
//
//     expect(response).toBeDefined();
//     expect(response.status).toBe(HTTP.CREATED_201);
//     expect(question).toStrictEqual({
//       id: expect.any(String),
//       body: questionInput1.body,
//       correctAnswers: questionInput1.correctAnswers,
//       published: false,
//       createdAt: expect.any(String),
//       updatedAt: null
//     });
//
//     questionsRec.push(question);
//   });
//
//   // TEST #3
//   it("Create questions. Status 201", async () => {
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
//
//   // TEST #4
//   it("Get questions. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .get(`${URL}/sa/quiz/questions`)
//       .auth("admin", "qwerty", {type: "basic"});
//
//     const questions = response.body;
//
//     expect(response).toBeDefined();
//     expect(response.status).toBe(HTTP.OK_200);
//     expect(questions.totalCount).toBe(questionsRec.length);
//   });
//
//   // TEST #5
//   it("Create user_01 by SuperAdmin. Status 201", async () => {
//     const response = await request(app.getHttpServer())
//       .post(`${URL}/sa/users`)
//       .auth("admin", "qwerty", {type: "basic"})
//       .send(userInput1);
//
//     const user = response.body;
//
//     expect(response).toBeDefined();
//     expect(response.status).toBe(HTTP.CREATED_201);
//     expect(user).toStrictEqual({
//       id: expect.any(String),
//       login: userInput1.login,
//       email: userInput1.email,
//       createdAt: expect.any(String),
//       banInfo: {
//         banDate: null,
//         banReason: null,
//         isBanned: false
//       }
//     });
//
//     user_01 = {...user};
//   });
//
//   // TEST #6
//   it("Create user_02 by SuperAdmin. Status 201", async () => {
//     const response = await request(app.getHttpServer())
//       .post(`${URL}/sa/users`)
//       .auth("admin", "qwerty", {type: "basic"})
//       .send(userInput2);
//
//     const user = response.body;
//
//     expect(response).toBeDefined();
//     expect(response.status).toBe(HTTP.CREATED_201);
//     expect(user).toStrictEqual({
//       id: expect.any(String),
//       login: userInput2.login,
//       email: userInput2.email,
//       createdAt: expect.any(String),
//       banInfo: {
//         banDate: null,
//         banReason: null,
//         isBanned: false
//       }
//     });
//
//     user_02 = {...user};
//   });
//
//   // TEST #7
//   it("Create user_02 by SuperAdmin. Status 201", async () => {
//     const response = await request(app.getHttpServer())
//       .post(`${URL}/sa/users`)
//       .auth("admin", "qwerty", {type: "basic"})
//       .send(userInput3);
//
//     const user = response.body;
//
//     expect(response).toBeDefined();
//     expect(response.status).toBe(HTTP.CREATED_201);
//     expect(user).toStrictEqual({
//       id: expect.any(String),
//       login: userInput3.login,
//       email: userInput3.email,
//       createdAt: expect.any(String),
//       banInfo: {
//         banDate: null,
//         banReason: null,
//         isBanned: false
//       }
//     });
//
//     user_03 = {...user};
//   });
//
//   // TEST #8
//   it("LOGIN user_01. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .post(`${URL}/auth/login`)
//       .send(loginInput1);
//
//     const accessToken = response.body;
//
//     expect(response).toBeDefined();
//     expect(response.status).toBe(HTTP.OK_200);
//     expect(accessToken).toStrictEqual({
//       accessToken: expect.any(String)
//     });
//
//     token_01 = {...accessToken};
//   });
//
//   // TEST #9
//   it("LOGIN user_02. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .post(`${URL}/auth/login`)
//       .send(loginInput2);
//
//     const accessToken = response.body;
//
//     expect(response).toBeDefined();
//     expect(response.status).toBe(HTTP.OK_200);
//     expect(accessToken).toStrictEqual({
//       accessToken: expect.any(String)
//     });
//
//     token_02 = {...accessToken};
//   });
//
//   // TEST #10
//   it("LOGIN user_03. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .post(`${URL}/auth/login`)
//       .send(loginInput3);
//
//     const accessToken = response.body;
//
//     expect(response).toBeDefined();
//     expect(response.status).toBe(HTTP.OK_200);
//     expect(accessToken).toStrictEqual({
//       accessToken: expect.any(String)
//     });
//
//     token_03 = {...accessToken};
//   });
//
//   // TEST #11
//   it("Create game_01 by user_01. Status 401", async () => {
//     const response = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/connection`)
//       .set("Authorization", `Bearer {token_01.accessToken}`)
//       .expect(HTTP.UNAUTHORIZED_401);
//   });
//
//   // TEST #12
//   it("Create game_01 by user_01. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/connection`)
//       .set("Authorization", `Bearer ${token_01.accessToken}`);
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
//           id: user_01.id,
//           login: user_01.login
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
//     quiz = game;
//   });
//
//   // TEST #13
//   it("Create game_01 by user_01. Status 403", async () => {
//     const response = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/connection`)
//       .set("Authorization", `Bearer ${token_01.accessToken}`)
//       .expect(HTTP.FORBIDDEN_403);
//   });
//
//   // TEST #13
//   it("User_03 try to get game_01. Status 403", async () => {
//     const response = await request(app.getHttpServer())
//       .get(`${URL}/pair-game-quiz/pairs/${quiz.id}`)
//       .set("Authorization", `Bearer ${token_03.accessToken}`)
//       .expect(HTTP.FORBIDDEN_403);
//   });
//
//   // TEST #14
//   it("User_02 connect to game_01. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/connection`)
//       .set("Authorization", `Bearer ${token_02.accessToken}`);
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
//           id: user_01.id,
//           login: user_01.login
//         },
//         score: 0
//       },
//       secondPlayerProgress: {
//         answers: [],
//         player: {
//           id: user_02.id,
//           login: user_02.login
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
//     quiz = game;
//   });
//
//   // TEST #15
//   it("User_03 try to answer question. Status 403", async () => {
//     const response = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${token_03.accessToken}`)
//       .send({answer: "answer"})
//       .expect(HTTP.FORBIDDEN_403);
//   });
//
//   // TEST #16
//   it("User_02 try to answer question. Status 401", async () => {
//     const response = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer {token_01.accessToken}`)
//       .send({answer: "answer"})
//       .expect(HTTP.UNAUTHORIZED_401);
//   });
//
//   // TEST #17
//   it("User_01 try to answer question. Status 200", async () => {
//     // console.log(quiz);
//     const questionResponse = await request(app.getHttpServer())
//       .get(`${URL}/sa/quiz/questions/${quiz.questions[0].id}`)
//       .auth("admin", "qwerty", {type: "basic"});
//
//     const response = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${token_01.accessToken}`)
//       .send({answer: questionResponse.body.correctAnswers[0]})
//       .expect(HTTP.OK_200);
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
//   // TEST #17
//   it("User_01 try to get current game. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .get(`${URL}/pair-game-quiz/pairs/my-current`)
//       .set("Authorization", `Bearer ${token_01.accessToken}`)
//       .expect(HTTP.OK_200);
//   });
//
//   // TEST #17
//   it("User_01 try to get current game. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .get(`${URL}/pair-game-quiz/pairs/${quiz.id}`)
//       .set("Authorization", `Bearer ${token_01.accessToken}`)
//       .expect(HTTP.OK_200);
//   });
//
//   // TEST #18
//   it("User_01 try to answer question. Status 200", async () => {
//     const questionResponse = await request(app.getHttpServer())
//       .get(`${URL}/sa/quiz/questions/${quiz.questions[1].id}`)
//       .auth("admin", "qwerty", {type: "basic"});
//
//     const response = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${token_01.accessToken}`)
//       .send({answer: questionResponse.body.correctAnswers[0]})
//       .expect(HTTP.OK_200);
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
//   // TEST #18
//   it("User_01 try to get current game. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .get(`${URL}/pair-game-quiz/pairs/my-current`)
//       .set("Authorization", `Bearer ${token_01.accessToken}`)
//       .expect(HTTP.OK_200);
//   });
//
//   // TEST #18
//   it("User_01 try to get current game. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .get(`${URL}/pair-game-quiz/pairs/${quiz.id}`)
//       .set("Authorization", `Bearer ${token_01.accessToken}`)
//       .expect(HTTP.OK_200);
//   });
//
//   // TEST #19
//   it("User_01 try to answer question. Status 200", async () => {
//     const questionResponse = await request(app.getHttpServer())
//       .get(`${URL}/sa/quiz/questions/${quiz.questions[2].id}`)
//       .auth("admin", "qwerty", {type: "basic"});
//
//     const response = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${token_01.accessToken}`)
//       .send({answer: questionResponse.body.correctAnswers[0]})
//       .expect(HTTP.OK_200);
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
//   // TEST #19
//   it("User_01 try to get current game. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .get(`${URL}/pair-game-quiz/pairs/my-current`)
//       .set("Authorization", `Bearer ${token_01.accessToken}`)
//       .expect(HTTP.OK_200);
//   });
//
//   // TEST #19
//   it("User_01 try to get current game. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .get(`${URL}/pair-game-quiz/pairs/${quiz.id}`)
//       .set("Authorization", `Bearer ${token_01.accessToken}`)
//       .expect(HTTP.OK_200);
//   });
//
//   // TEST #20
//   it("User_01 try to answer question. Status 200", async () => {
//     const questionResponse = await request(app.getHttpServer())
//       .get(`${URL}/sa/quiz/questions/${quiz.questions[3].id}`)
//       .auth("admin", "qwerty", {type: "basic"});
//
//     const response = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${token_01.accessToken}`)
//       .send({answer: questionResponse.body.correctAnswers[0]})
//       .expect(HTTP.OK_200);
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
//   // TEST #21
//   it("User_01 try to answer question. Status 200", async () => {
//     const questionResponse = await request(app.getHttpServer())
//       .get(`${URL}/sa/quiz/questions/${quiz.questions[4].id}`)
//       .auth("admin", "qwerty", {type: "basic"});
//
//     const response = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${token_01.accessToken}`)
//       .send({answer: questionResponse.body.correctAnswers[0]})
//       .expect(HTTP.OK_200);
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
//   // TEST #22
//   it("User_01 try to answer question. Status 403", async () => {
//     const response = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${token_01.accessToken}`)
//       .send({answer: "answer"})
//       .expect(HTTP.FORBIDDEN_403);
//   });
//
//   // TEST #23
//   it("User_02 try to answer question. Status 200", async () => {
//     const questionResponse = await request(app.getHttpServer())
//       .get(`${URL}/sa/quiz/questions/${quiz.questions[0].id}`)
//       .auth("admin", "qwerty", {type: "basic"});
//
//     const response = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${token_02.accessToken}`)
//       .send({answer: questionResponse.body.correctAnswers[0]})
//       .expect(HTTP.OK_200);
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
//   // TEST #23
//   it("User_02 try to get current game. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .get(`${URL}/pair-game-quiz/pairs/my-current`)
//       .set("Authorization", `Bearer ${token_02.accessToken}`)
//       .expect(HTTP.OK_200);
//   });
//
//   // TEST #23
//   it("User_02 try to get current game. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .get(`${URL}/pair-game-quiz/pairs/${quiz.id}`)
//       .set("Authorization", `Bearer ${token_02.accessToken}`)
//       .expect(HTTP.OK_200);
//   });
//
//   // TEST #24
//   it("User_02 try to answer question. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${token_02.accessToken}`)
//       .send({answer: "answer"})
//       .expect(HTTP.OK_200);
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
//   // TEST #24
//   it("User_02 try to get current game. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .get(`${URL}/pair-game-quiz/pairs/my-current`)
//       .set("Authorization", `Bearer ${token_02.accessToken}`)
//       .expect(HTTP.OK_200);
//   });
//
//   // TEST #24
//   it("User_02 try to get current game. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .get(`${URL}/pair-game-quiz/pairs/${quiz.id}`)
//       .set("Authorization", `Bearer ${token_02.accessToken}`)
//       .expect(HTTP.OK_200);
//   });
//
//   // TEST #25
//   it("User_02 try to answer question. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${token_02.accessToken}`)
//       .send({answer: "answer"})
//       .expect(HTTP.OK_200);
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
//   // TEST #25
//   it("User_02 try to answer question. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${token_02.accessToken}`)
//       .send({answer: "answer"})
//       .expect(HTTP.OK_200);
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
//   // TEST #26
//   it("User_02 try to get current game. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .get(`${URL}/pair-game-quiz/pairs/my-current`)
//       .set("Authorization", `Bearer ${token_02.accessToken}`);
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
//           id: user_01.id,
//           login: user_01.login
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
//           }
//         ],
//         player: {
//           id: user_02.id,
//           login: user_02.login
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
//   });
//
//   // TEST #27
//   it("User_02 try to answer question. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${token_02.accessToken}`)
//       .send({answer: "answer"})
//       .expect(HTTP.OK_200);
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
//   // TEST #28
//   it("User_02 try to answer question. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/my-current/answers`)
//       .set("Authorization", `Bearer ${token_02.accessToken}`)
//       .send({answer: "answer"})
//       .expect(HTTP.FORBIDDEN_403);
//   });
//
//   // TEST #29
//   it("User_02 try to get current game. Status 404", async () => {
//     const response = await request(app.getHttpServer())
//       .get(`${URL}/pair-game-quiz/pairs/my-current`)
//       .set("Authorization", `Bearer ${token_02.accessToken}`)
//       .expect(HTTP.NOT_FOUND_404);
//   });
//
//   // TEST #30
//   it("Anonymous try to get current game. Status 401", async () => {
//     const response = await request(app.getHttpServer())
//       .get(`${URL}/pair-game-quiz/pairs/my-current`)
//       .set("Authorization", `Bearer {token_02.accessToken}`)
//       .expect(HTTP.UNAUTHORIZED_401);
//   });
//
//   // TEST #31
//   it("User_01 try to get game_100. Status 404", async () => {
//     const response = await request(app.getHttpServer())
//       .get(`${URL}/pair-game-quiz/pairs/${uuidv4()}`)
//       .set("Authorization", `Bearer ${token_01.accessToken}`)
//       .expect(HTTP.NOT_FOUND_404);
//   });
//
//   // TEST #32
//   it("User_03 try to get game_01. Status 403", async () => {
//     const response = await request(app.getHttpServer())
//       .get(`${URL}/pair-game-quiz/pairs/${quiz.id}`)
//       .set("Authorization", `Bearer ${token_03.accessToken}`)
//       .expect(HTTP.FORBIDDEN_403);
//   });
//
//   // TEST #33
//   it("Anonymous try to get game_01. Status 401", async () => {
//     const response = await request(app.getHttpServer())
//       .get(`${URL}/pair-game-quiz/pairs/${quiz.id}`)
//       .set("Authorization", `Bearer {token_03.accessToken}`)
//       .expect(HTTP.UNAUTHORIZED_401);
//   });
//
//   // TEST #34
//   it("User_01 try to get game_01. Status 400", async () => {
//     const response = await request(app.getHttpServer())
//       .get(`${URL}/pair-game-quiz/pairs/11`)
//       .set("Authorization", `Bearer ${token_01.accessToken}`)
//       .expect(HTTP.BAD_REQUEST_400); // add obj
//   });
//
//   // TEST #35
//   it("User_01 try to get game_01. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .get(`${URL}/pair-game-quiz/pairs/${quiz.id}`)
//       .set("Authorization", `Bearer ${token_01.accessToken}`);
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
//           id: user_01.id,
//           login: user_01.login
//         },
//         score: 6
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
//           id: user_02.id,
//           login: user_02.login
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
//       status: "Finished",
//       pairCreatedDate: expect.any(String),
//       startGameDate: expect.any(String),
//       finishGameDate: expect.any(String)
//     });
//   });
//
//   // TEST #36
//   it("Create game_01 by user_01. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/connection`)
//       .set("Authorization", `Bearer ${token_01.accessToken}`);
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
//           id: user_01.id,
//           login: user_01.login
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
//     quiz = game;
//   });
//
//   // TEST #37
//   it("User_02 connect to game_01. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .post(`${URL}/pair-game-quiz/pairs/connection`)
//       .set("Authorization", `Bearer ${token_02.accessToken}`);
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
//           id: user_01.id,
//           login: user_01.login
//         },
//         score: 0
//       },
//       secondPlayerProgress: {
//         answers: [],
//         player: {
//           id: user_02.id,
//           login: user_02.login
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
//     quiz = game;
//   });
//
//   // TEST #38
//   it("User_01 try to get current game. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .get(`${URL}/pair-game-quiz/pairs/my-current`)
//       .set("Authorization", `Bearer ${token_01.accessToken}`)
//       .expect(HTTP.OK_200);
//   });
//
//   // TEST #39
//   it("User_01 try to get current game. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .get(`${URL}/pair-game-quiz/pairs/${quiz.id}`)
//       .set("Authorization", `Bearer ${token_01.accessToken}`)
//       .expect(HTTP.OK_200);
//   });
//
//   // TEST #40
//   it("User_02 try to get current game. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .get(`${URL}/pair-game-quiz/pairs/my-current`)
//       .set("Authorization", `Bearer ${token_02.accessToken}`)
//       .expect(HTTP.OK_200);
//   });
//
//   // TEST #41
//   it("User_02 try to get current game. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .get(`${URL}/pair-game-quiz/pairs/${quiz.id}`)
//       .set("Authorization", `Bearer ${token_02.accessToken}`)
//       .expect(HTTP.OK_200);
//   });
// });