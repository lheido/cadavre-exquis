import { Step, StepDescription } from "./types";

export const getPeerId = (id: string): string => `cadavre-exquis-${id}`;

export const removePeerIdPrefix = (id: string): string =>
  id.replace("cadavre-exquis-", "");

export const buildFinalResult = (
  data: Record<string, Step[]>,
  steps: StepDescription[]
): Record<string, Step[]> => {
  const _data = Object.values(data);
  const set: Record<string, Step[]> = steps.reduce((acc, step) => {
    return {
      ...acc,
      [step.id]: _data.map((playerValues) =>
        playerValues.find((s) => s.id === step.id)
      ),
    };
  }, {});
  const result: Record<string, Step[]> = {};
  // TODO: Improve algo to work with the "players.length < steps.length" case
  Object.keys(data).forEach((user) => {
    result[user] = [];
    let shouldFilterByPlayerId = false;
    steps.forEach((step) => {
      const stepValues = shouldFilterByPlayerId
        ? set[step.id].filter((s) => s.player !== user)
        : set[step.id];
      const randomIndex = Math.floor(Math.random() * stepValues.length);
      const stepValue = stepValues.splice(randomIndex, 1)[0];
      result[user].push(stepValue);
      if (stepValue.player === user) {
        shouldFilterByPlayerId = true;
      }
    });
  });
  return result;
};
