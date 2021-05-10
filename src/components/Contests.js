import React, { useEffect, useState } from "react";

import moment from "moment";

import { Link } from "react-router-dom";

import Alert from "react-bootstrap/Alert";
import Badge from "react-bootstrap/Badge";
// import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";

const Contests = ({ currentUser }) => {
  const [error, setError] = useState(false);
  const [contests, setContests] = useState();
  const [loading, setLoading] = useState(true);

  // console.log(loading, contests);

  const fetchContests = async () => {
    setError(false);
    if (currentUser) {
      setLoading(true);
      const token = await currentUser.getIdToken();
      console.log(token);
      const response = await fetch(
        "https://contest-advisor-service.herokuapp.com/api/contests",
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      if (response.status === 200) {
        setContests(await response.json());
      } else {
        setError(await response.json());
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  if (loading) {
    return (
      <div className="w-100 flex items-center justify-center ph3">
        <Spinner animation="border" />
      </div>
    );
  }

  return error ? (
    <div className="w-100 ph3">
      <Alert variant="danger">
        {error.message ? error.message : "An error occurred"}
      </Alert>
    </div>
  ) : currentUser ? (
    <div className="ph3 flex flex-column">
      <div className="flex flex-row justify-between items-baseline">
        <div>
          <h5>Contests</h5>
        </div>
        {/* <div className="">
          <Button>New Contest</Button>
        </div> */}
      </div>
      {contests.length ? (
        <div className="flex flex-row flex-wrap mt3">
          {contests.map((contest, index) => (
            <div
              key={contest.id}
              className={`w-third pb3 ${index % 3 !== 2 ? "pr3" : ""}`}
            >
              <Card>
                <div className="pa4">
                  <h5>{contest.name}</h5>
                  <div className="flex flex-column">
                    <div className="b">Starts at</div>{" "}
                    {moment(new Date(contest.startTimeInSeconds * 1000)).format(
                      "LLLL"
                    )}
                  </div>
                  <div className="flex flex-column mt2">
                    <div className="b">Duration</div>{" "}
                    {moment
                      .utc(
                        moment
                          .duration(contest.durationInSeconds * 1000)
                          .asMilliseconds()
                      )
                      .format("HH:mm:ss")}
                  </div>
                  <div className="flex flex-column mt2">
                    <div className="b">Contestants</div>
                    <div className="flex flex-row flex-wrap mt1 mb2">
                      {contest.contestants.map((contestant) => (
                        <div
                          key={`${contest.id}_${contestant}`}
                          className="mr2"
                        >
                          <Badge pill variant="secondary">
                            <div className="pa1">{contestant}</div>
                          </Badge>
                        </div>
                      ))}
                    </div>
                    <div className="b">Problems</div>
                    <div className="flex flex-row flex-wrap mt1">
                      {contest.problems.map((problem) => (
                        <div key={`${contest.id}_${problem}`} className="mr2">
                          <Badge pill variant="secondary">
                            <div className="pa1">{problem}</div>
                          </Badge>
                        </div>
                      ))}
                    </div>
                    <div className="mt2">
                      <Link to={`/contests/${contest.id}`}>Standings</Link>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center mt4">
          You have no contests yet
        </div>
      )}
    </div>
  ) : (
    <div className="ph3">Log in in order to see your contests</div>
  );
};

export default Contests;
