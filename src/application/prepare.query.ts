import { QueryType, sortDirection } from "../types";

const prepareQuery = (query: QueryType): QueryType => {
  //@ts-ignore
  const sort = query.sortDirection === "asc" ? sortDirection.ASC
    : sortDirection.DESC;

  return {
    pageNumber: +query.pageNumber ? +query.pageNumber : 1,
    pageSize: +query.pageSize ? +query.pageSize : 10,
    sortBy: query.sortBy || "createdAt",
    sortDirection: sort
  };
};

export const prepareQuizQuery = (query: QueryType): QueryType => {
  //@ts-ignore
  const sort = query.sortDirection === "asc" ? sortDirection.ASC
    : sortDirection.DESC;

  return {
    pageNumber: +query.pageNumber ? +query.pageNumber : 1,
    pageSize: +query.pageSize ? +query.pageSize : 10,
    sortBy: query.sortBy || "pairCreatedDate",
    sortDirection: sort
  };
};

export const prepareQuizTopQuery = (query: QueryType): QueryType => {
  let sort: string[] = [];

  if (Array.isArray(query.sort)){
    sort = sort.concat(query.sort);
    // console.log(1);
  } else if (typeof query.sort === "string") {
    sort.push(query.sort);
    // console.log(2);
  } else {
    sort = sort.concat(["avgScores desc", "sumScore desc"]);
    // console.log(3);
  }
  // console.log(sort);
  let temp = JSON.stringify(sort);

  //@ts-ignore
  temp = temp.replaceAll("asc", sortDirection.ASC);

  //@ts-ignore
  temp = temp.replaceAll("desc", sortDirection.DESC);

  sort = JSON.parse(temp);

  return {
    pageNumber: +query.pageNumber ? +query.pageNumber : 1,
    pageSize: +query.pageSize ? +query.pageSize : 10,
    sort: sort
  };
};

export const prepareQueries = (query: QueryType) => {
  const queryObj: QueryType = prepareQuery(query);

  if (query.searchNameTerm) queryObj.searchNameTerm = query.searchNameTerm;
  if (query.searchLoginTerm) queryObj.searchLoginTerm = query.searchLoginTerm;
  if (query.searchEmailTerm) queryObj.searchEmailTerm = query.searchEmailTerm;

  return queryObj;
};

export const prepareSAQueries = (query: QueryType) => {
  const queryObj: QueryType = prepareQuery(query);

  queryObj.banStatus = query.banStatus || "all";

  if (query.searchLoginTerm) queryObj.searchLoginTerm = query.searchLoginTerm;
  if (query.searchEmailTerm) queryObj.searchEmailTerm = query.searchEmailTerm;

  return queryObj;
};

export const prepareQuestionsQueries = (query: QueryType) => {
  const queryObj: QueryType = prepareQuery(query);

  queryObj.publishedStatus = query.publishedStatus || "all";

  if (query.bodySearchTerm) queryObj.bodySearchTerm = query.searchLoginTerm;

  return queryObj;
};