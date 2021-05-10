import React, { useEffect, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Table from "react-bootstrap/Table";

const sortStandings = (left, right) => {
  if (left.totalSolved === right.totalSolved) {
    return left.totalPenalty < right.totalPenalty ? -1 : 1;
  }
  return left.totalSolved > right.totalSolved ? -1 : 1;
};

const Standings = ({ contest }) => {
  const [error, setError] = useState();
  const [status, setStatus] = useState();
  const [loading, setLoading] = useState(true);

  const standings = (status
    ? Object.keys(status).map((contestant) => {
        let totalPenalty = 0;
        let totalSolved = 0;
        const problems = Object.keys(status[contestant]).map((problem) => {
          const { tries, solved, solvedTimeInSeconds } = status[contestant][
            problem
          ];
          if (tries > 0) {
            totalPenalty += contest.penalty;
          }
          if (solved) {
            ++totalSolved;
            totalPenalty += Math.floor(
              (solvedTimeInSeconds - contest.startTimeInSeconds) / 60
            );
          }
          return {
            id: problem,
            tries,
            solved,
            solvedTimeInSeconds,
          };
        });
        return {
          contestant,
          totalPenalty,
          totalSolved,
          problems,
        };
      })
    : []
  ).sort(sortStandings);

  const fetchStatus = async (contest) => {
    setError(false);
    setLoading(true);
    const response = await fetch(
      `https://contest-advisor-service.herokuapp.com/api/contests/${contest.id}/status`
    );
    if (response.status === 200) {
      setStatus(await response.json());
    } else {
      setError(await response.json());
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStatus(contest);
  }, [contest]);

  const getRedirectUrl = (contest, id) => {
    // eslint-disable-next-line no-unused-vars
    const [_, contestAndProblemId] = id.split("_");
    const [contestId, problemIndex] = contestAndProblemId.split("-");
    return contest.redirectUrl
      .replace("{contestId}", contestId)
      .replace("{problemIndex}", problemIndex);
  };

  return (
    <div className="w-100">
      {loading ? (
        <div className="w-100 flex items-center justify-center mt3">
          <Spinner animation="border" />
        </div>
      ) : error || !status ? (
        <div className="w-100">
          <Alert variant="danger">
            {error.message ? error.message : "An error occurred"}
          </Alert>
        </div>
      ) : (
        <>
          <div className="w-100 mb3">
            <div className="flex flex-row items-center justify-between">
              <h5>Standings</h5>
              <div>
                <Button onClick={() => fetchStatus(contest)}>Refresh</Button>
              </div>
            </div>
          </div>
          <Table striped bordered responsive>
            <thead>
              <tr>
                <th style={{ width: "5%" }}>
                  <div className="w-100 flex justify-center">#</div>
                </th>
                <th style={{ width: "20%" }}>Contestant</th>
                <th style={{ width: "5%" }}>
                  <div className="w-100 flex justify-center">Solved</div>
                </th>
                <th style={{ width: "10%" }}>
                  <div className="w-100 flex justify-center">Penalty</div>
                </th>
                {contest.problems.map((id, index) => (
                  <th key={`header_${id}`}>
                    <div className="w-100 flex justify-center">
                      <a
                        target="_blank"
                        rel="noreferrer"
                        href={getRedirectUrl(contest, id)}
                      >
                        {String.fromCharCode("A".charCodeAt(0) + index)}
                      </a>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {standings.map((standing, index) => {
                return (
                  <tr key={standing.contestant}>
                    <td>
                      <div className="w-100 flex justify-center">
                        {index === 0
                          ? 1
                          : standings[index - 1].totalSolved ===
                              standings[index].totalSolved &&
                            standings[index - 1].totalPenalty ===
                              standings[index].totalPenalty
                          ? ""
                          : index + 1}
                      </div>
                    </td>
                    <td>{standing.contestant}</td>
                    <td>
                      <div className="w-100 flex justify-center">
                        {standing.totalSolved}
                      </div>
                    </td>
                    <td>
                      <div className="w-100 flex justify-center">
                        {standing.totalPenalty}
                      </div>
                    </td>
                    {standing.problems.map((problem) => {
                      const tries = problem.solved
                        ? problem.tries - 1
                        : problem.tries;
                      return (
                        <td
                          key={`${standing.contestant}-${problem.id}`}
                          className={`${problem.solved ? "green" : "red"}`}
                        >
                          <div className="w-100 flex justify-center">
                            {`${
                              tries > 0 || problem.solved
                                ? problem.solved
                                  ? "+"
                                  : "-"
                                : ""
                            }`}
                            {tries > 0 && tries}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </>
      )}
    </div>
  );
};

export default Standings;
