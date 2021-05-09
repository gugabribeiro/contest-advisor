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
          problem,
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
            <th style={{ width: "5%" }}>#</th>
            <th style={{ width: "20%" }}>Contestant</th>
            <th style={{ width: "5%" }}>Solved</th>
            <th style={{ width: "10%" }}>Penalty</th>
            {contest.problems.map((_, index) => (
              <th>
                <a href="/">{String.fromCharCode("A".charCodeAt(0) + index)}</a>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {standings.map((standing, index) => {
            return (
              <tr>
                <td>{index + 1}</td>
                <td>{standing.contestant}</td>
                <td>{standing.totalSolved}</td>
                <td>{standing.totalPenalty}</td>
                {standing.problems.map((problem) => {
                  const tries = problem.solved
                    ? problem.tries - 1
                    : problem.tries;
                  return (
                    <>
                      <td className={`${problem.solved ? "green" : "red"}`}>
                        {`${
                          tries > 0 || problem.solved
                            ? problem.solved
                              ? "+"
                              : "-"
                            : ""
                        }`}
                        {tries > 0 && tries}
                      </td>
                    </>
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
