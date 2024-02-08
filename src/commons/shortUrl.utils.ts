import { v4 } from "uuid";

export const createUrl = (uniqueId: string) =>
  `${process.env.HOST}/${uniqueId}`;

export const createUniqueId = () => {
  const uuidArray = v4().split("-");
  return uuidArray[uuidArray.length - 1];
};
