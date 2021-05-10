export const getRedirectUrl = (redirectUrl, problemId) => {
  // eslint-disable-next-line no-unused-vars
  const [_, contestAndProblemIndex] = problemId.split("_");
  const [contestId, problemIndex] = contestAndProblemIndex.split("-");
  return redirectUrl
    .replace("{contestId}", contestId)
    .replace("{problemIndex}", problemIndex);
};

export const getProblemName = (problemId) => {
  const [connector, contestAndProblemIndex] = problemId.split("_");
  const [contestId, problemIndex] = contestAndProblemIndex.split("-");
  return `${connector.charAt(0).toUpperCase()}${connector.slice(
    1
  )} ${contestId}${problemIndex}`;
};

export const contestStarted = (contest) => {
  const now = Date.now();

  const start = new Date(0);
  start.setSeconds(contest.startTimeInSeconds);

  const end = new Date(0);
  end.setSeconds(contest.startTimeInSeconds + contest.durationInSeconds);

  return now - start >= 0;
};
