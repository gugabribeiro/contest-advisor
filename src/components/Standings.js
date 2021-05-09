import React from "react";
import Table from "react-bootstrap/Table";

const status = {
  guga: {
    A: {
      tries: 2,
      solved: false,
      solvedTimeInSeconds: 0,
    },
    B: {
      tries: 2,
      solved: true,
      solvedTimeInSeconds: 1620533108,
    },
    C: {
      tries: 0,
      solved: false,
      solvedTimeInSeconds: 0,
    },
    D: {
      tries: 2,
      solved: true,
      solvedTimeInSeconds: 1620533108,
    },
    E: {
      tries: 0,
      solved: false,
      solvedTimeInSeconds: 0,
    },
    F: {
      tries: 2,
      solved: true,
      solvedTimeInSeconds: 1620533108,
    },
    G: {
      tries: 2,
      solved: false,
      solvedTimeInSeconds: 0,
    },
  },
  Emiso: {
    A: {
      tries: 2,
      solved: true,
      solvedTimeInSeconds: 1620533167,
    },
    B: {
      tries: 1,
      solved: true,
      solvedTimeInSeconds: 1620533008,
    },
    C: {
      tries: 2,
      solved: false,
      solvedTimeInSeconds: 0,
    },
    D: {
      tries: 1,
      solved: false,
      solvedTimeInSeconds: 0,
    },
    E: {
      tries: 1,
      solved: false,
      solvedTimeInSeconds: 0,
    },
    F: {
      tries: 0,
      solved: false,
      solvedTimeInSeconds: 0,
    },
    G: {
      tries: 0,
      solved: false,
      solvedTimeInSeconds: 0,
    },
  },
  arthurcf: {
    A: {
      tries: 1,
      solved: true,
      solvedTimeInSeconds: 1620533005,
    },
    B: {
      tries: 5,
      solved: false,
      solvedTimeInSeconds: 0,
    },
    C: {
      tries: 1,
      solved: true,
      solvedTimeInSeconds: 1620533003,
    },
    D: {
      tries: 0,
      solved: false,
      solvedTimeInSeconds: 0,
    },
    E: {
      tries: 0,
      solved: false,
      solvedTimeInSeconds: 0,
    },
    F: {
      tries: 1,
      solved: false,
      solvedTimeInSeconds: 0,
    },
    G: {
      tries: 1,
      solved: true,
      solvedTimeInSeconds: 1620533003,
    },
  },
};

const sortStandings = (left, right) => {
  if (left.totalSolved === right.totalSolved) {
    return left.totalPenalty < right.totalPenalty ? -1 : 1;
  }
  return left.totalSolved > right.totalSolved ? -1 : 1;
};

const Standings = ({ contest }) => {
  const standings = Object.keys(status)
    .map((contestant) => {
      let totalPenalty = 0;
      let totalSolved = 0;
      const problems = Object.keys(status[contestant]).map((problem) => {
        const { tries, solved, solvedTimeInSeconds } = status[contestant][
          problem
        ];
        totalPenalty += contest.penalty;
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
    .sort(sortStandings);

  return (
    <div className="w-100">
      <div className="mb3">
        <h5>Standings</h5>
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
                  <a href="/">
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
                  <div className="w-100 flex justify-center">{index + 1}</div>
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
    </div>
  );
};

export default Standings;
