import { IGamestate } from "./interfaces";

type FlattenObject<T> = {
  [K in keyof T]: T[K] extends object
    ? `${string & K}:${Extract<keyof FlattenObject<T[K]>, string>}`
    : K;
}[keyof T];

export type GamestateEvents = FlattenObject<IGamestate>;

type EventsGame = `${GamestateEvents}`;

export type EventPayload = {
  key: EventsGame;
  value: string | number;
};
