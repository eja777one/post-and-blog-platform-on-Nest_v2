// import { startApp } from "../../src/application/start.app";
// import { Test, TestingModule } from "@nestjs/testing";
// import { INestApplication } from "@nestjs/common";
// import * as request from "supertest";
// import { AppModule } from "../../src/app.module";
// import { HTTP } from "../../src/types";
// import { URL } from "../dataForTests";
// import { SAQuestionViewModel } from "../../src/quiz/quiz.types";
//
// const questionInput1 = {
//   body: "How many legs does a cat have?",
//   correctAnswers: ["4", "four", "Four"]
// };
//
// const questionUpdate1 = {
//   body: "How many legs does a dog have?",
//   correctAnswers: ["4", "four", "Four"]
// };
//
// const badQuestionInput = {
//   correctAnswers: ["4", "four", "Four"]
// };
//
// const badRequestError = {
//   errorsMessages: [
//     {
//       message: `Incorrect body`,
//       field: "body"
//     }
//   ]
// };
//
// let question1: SAQuestionViewModel;
//
// describe("QuizSAController (e2e)", () => {
//   let app: INestApplication;
//
//   beforeAll(async () => {
//     const moduleFixture: TestingModule =
//       await Test.createTestingModule({ imports: [AppModule] }).compile();
//
//     app = moduleFixture.createNestApplication();
//     app = startApp(app);
//     await app.init();
//   });
//
//   it("Delete all data", async () => {
//     await request(app.getHttpServer())
//       .delete(`${URL}/testing/all-data`)
//       .auth("admin", "qwerty", { type: "basic" })
//       .expect(HTTP.NO_CONTENT_204);
//   });
//
//   // TEST #1
//   it("GET questions. Status 401", async () => {
//     await request(app.getHttpServer())
//       .get(`${URL}/sa/users`)
//       .auth("admin", "admin", { type: "basic" })
//       .expect(HTTP.UNAUTHORIZED_401);
//   });
//
//   // TEST #2
//   it("Get questions. Status 200", async () => {
//     await request(app.getHttpServer())
//       .get(`${URL}/sa/quiz/questions`)
//       .auth("admin", "qwerty", { type: "basic" })
//       .expect(HTTP.OK_200, {
//         pagesCount: 0,
//         page: 1,
//         pageSize: 10,
//         totalCount: 0,
//         items: []
//       });
//   });
//
//   // TEST #3
//   it("Create question. Status 401", async () => {
//     const response = await request(app.getHttpServer())
//       .post(`${URL}/sa/quiz/questions`)
//       .auth("admin", "admin", { type: "basic" })
//       .send(questionInput1)
//       .expect(HTTP.UNAUTHORIZED_401);
//   });
//
//   // TEST #4
//   it("Create question. Status 400", async () => {
//     const response = await request(app.getHttpServer())
//       .post(`${URL}/sa/quiz/questions`)
//       .auth("admin", "qwerty", { type: "basic" })
//       .send(badQuestionInput)
//       .expect(HTTP.BAD_REQUEST_400, badRequestError);
//   });
//
//   // TEST #3
//   it("Create question. Status 201", async () => {
//     const response = await request(app.getHttpServer())
//       .post(`${URL}/sa/quiz/questions`)
//       .auth("admin", "qwerty", { type: "basic" })
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
//     question1 = { ...question };
//   });
//
//   // TEST #4
//   it("Publish question. Status 404", async () => {
//     const response = await request(app.getHttpServer())
//       .put(`${URL}/sa/quiz/questions/${100}/publish`)
//       .auth("admin", "qwerty", { type: "basic" })
//       .send({ published: true })
//       .expect(HTTP.NOT_FOUND_404);
//   });
//
//   // TEST #5
//   it("Publish question. Status 401", async () => {
//     const response = await request(app.getHttpServer())
//       .put(`${URL}/sa/quiz/questions/${question1.id}/publish`)
//       .auth("admin", "admin", { type: "basic" })
//       .send({ published: true })
//       .expect(HTTP.UNAUTHORIZED_401);
//   });
//
//   // TEST #6
//   it("Publish question. Status 204", async () => {
//     const response = await request(app.getHttpServer())
//       .put(`${URL}/sa/quiz/questions/${question1.id}/publish`)
//       .auth("admin", "qwerty", { type: "basic" })
//       .send({ published: true });
//
//     expect(response).toBeDefined();
//     expect(response.status).toBe(HTTP.NO_CONTENT_204);
//
//     question1.published = true;
//   });
//
//   // TEST #7
//   it("Update question. Status 404", async () => {
//     const response = await request(app.getHttpServer())
//       .put(`${URL}/sa/quiz/questions/${100}`)
//       .auth("admin", "qwerty", { type: "basic" })
//       .send(questionUpdate1)
//       .expect(HTTP.NOT_FOUND_404);
//   });
//
//   // TEST #8
//   it("Update question. Status 401", async () => {
//     const response = await request(app.getHttpServer())
//       .put(`${URL}/sa/quiz/questions/${question1.id}`)
//       .auth("admin", "admin", { type: "basic" })
//       .send(questionUpdate1)
//       .expect(HTTP.UNAUTHORIZED_401);
//   });
//
//   // TEST #9
//   it("Update question. Status 400", async () => {
//     const response = await request(app.getHttpServer())
//       .put(`${URL}/sa/quiz/questions/${question1.id}`)
//       .auth("admin", "qwerty", { type: "basic" })
//       .send(badQuestionInput)
//       .expect(HTTP.BAD_REQUEST_400, badRequestError);
//   });
//
//   // TEST #10
//   it("Update question. Status 204", async () => {
//     const response = await request(app.getHttpServer())
//       .put(`${URL}/sa/quiz/questions/${question1.id}`)
//       .auth("admin", "qwerty", { type: "basic" })
//       .send(questionUpdate1);
//
//     expect(response).toBeDefined();
//     expect(response.status).toBe(HTTP.NO_CONTENT_204);
//
//     question1.body = questionUpdate1.body;
//     question1.correctAnswers = questionUpdate1.correctAnswers;
//   });
//
//   // TEST #11
//   it("Get questions. Status 200", async () => {
//     const response = await request(app.getHttpServer())
//       .get(`${URL}/sa/quiz/questions`)
//       .auth("admin", "qwerty", { type: "basic" });
//
//     const questions = response.body;
//
//     expect(response).toBeDefined();
//     expect(response.status).toBe(HTTP.OK_200);
//     expect(questions).toStrictEqual({
//       pagesCount: 1,
//       page: 1,
//       pageSize: 10,
//       totalCount: 1,
//       items: [{
//         ...question1,
//         updatedAt: expect.any(String)
//       }]
//     });
//   });
//
//   // TEST #12
//   it("Delete question. Status 404", async () => {
//     const response = await request(app.getHttpServer())
//       .delete(`${URL}/sa/quiz/questions/${100}`)
//       .auth("admin", "qwerty", { type: "basic" })
//       .expect(HTTP.NOT_FOUND_404);
//   });
//
//   // TEST #13
//   it("Delete question. Status 401", async () => {
//     const response = await request(app.getHttpServer())
//       .delete(`${URL}/sa/quiz/questions/${question1.id}`)
//       .auth("admin", "admin", { type: "basic" })
//       .expect(HTTP.UNAUTHORIZED_401);
//   });
//
//   // TEST #14
//   it("Delete question. Status 204", async () => {
//     const response = await request(app.getHttpServer())
//       .delete(`${URL}/sa/quiz/questions/${question1.id}`)
//       .auth("admin", "qwerty", { type: "basic" })
//       .expect(HTTP.NO_CONTENT_204);
//   });
//
//   // TEST #15
//   it("Get questions. Status 200", async () => {
//     await request(app.getHttpServer())
//       .get(`${URL}/sa/quiz/questions`)
//       .auth("admin", "qwerty", { type: "basic" })
//       .expect(HTTP.OK_200, {
//         pagesCount: 0,
//         page: 1,
//         pageSize: 10,
//         totalCount: 0,
//         items: []
//       });
//   });
// });