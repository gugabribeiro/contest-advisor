import React, { useState, useEffect } from "react";

import moment from "moment";

import { Link } from "react-router-dom";

import Alert from "react-bootstrap/Alert";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";

import CreateContest from "./CreateContest";

import { useAuth } from "../contexts/AuthContext";
import { getProblemName, getRedirectUrl } from "../utils";

const Contests = () => {
  const { currentUser } = useAuth();
  const [showToast, setShowToast] = useState(false);
  const [error, setError] = useState(false);
  const [contests, setContests] = useState();
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchContests = async () => {
    setError(false);
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
    if (response.status === 200) {
      setContests(await response.json());
    } else {
      setError(await response.json());
    }
    setLoading(false);
  };

  const handleHideModal = () => {
    setShowModal(false);
  };

  const onContestCreated = () => {
    setShowToast(true);
    handleHideModal();
    fetchContests();
  };

  useEffect(() => {
    fetchContests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  return (
    <>
      <div className="w-100 pt3 ph4 flex flex-column">
        <div className="flex flex-row justify-between items-center mb3">
          <div className="f3">Contests</div>
          <Button onClick={() => setShowModal(true)}>New Contest</Button>
        </div>
        {showToast && (
          <Alert
            variant="success"
            onClose={() => setShowToast(false)}
            dismissible
          >
            Contest creatted successfully
          </Alert>
        )}
        <div className="w-100 mt1">
          {loading ? (
            <div className="w-100 flex items-center justify-center">
              <Spinner animation="border" />
            </div>
          ) : error ? (
            <Alert variant="danger">
              {error.message ? error.message : "An error occurred"}
            </Alert>
          ) : (
            <div className="w-100 flex flex-row flex-wrap">
              {contests.length > 0 ? (
                contests.map((contest, index) => (
                  <div
                    key={contest.id}
                    className={`w-third ${
                      index % 3 === 0
                        ? "pr2"
                        : index % 3 === 1
                        ? "pl1 pr1"
                        : index % 3 === 2
                        ? "pl2"
                        : ""
                    } pb3`}
                  >
                    <Card>
                      <div className="pa4 flex flex-column">
                        <div className="flex flex-row justify-between">
                          <div className="f4 hl-copy">{contest.name}</div>
                          <Link to={`/contests/${contest.id}`}>Standings</Link>
                        </div>
                        <div className="flex flex-column mt2">
                          <div className="b">Starts at</div>{" "}
                          {new Date(
                            contest.startTimeInSeconds * 1000
                          ).toUTCString()}
                        </div>
                        <div className="flex flex-column mt1">
                          <div className="b">Duration</div>{" "}
                          {moment
                            .utc(
                              moment
                                .duration(contest.durationInSeconds * 1000)
                                .asMilliseconds()
                            )
                            .format("hh[h] mm[m]")}
                        </div>
                        <div className="b mt1">Contestants</div>
                        <div className="flex flex-row flex-wrap mt1 mb2">
                          {contest.contestants.map((contestant) => (
                            <div
                              key={`${contest.id}_${contestant}`}
                              className="mr2 mb2"
                            >
                              <Badge pill variant="secondary">
                                <div className="pa1">{contestant}</div>
                              </Badge>
                            </div>
                          ))}
                        </div>
                        <div className="b mt1">Problems</div>
                        <div className="flex flex-row flex-wrap mt1">
                          {contest.problems.map((problem) => (
                            <div
                              key={`${contest.id}_${problem}`}
                              className="mr2 mb2"
                            >
                              <Badge pill variant="secondary">
                                <div className="pa1">
                                  <a
                                    target="_blank"
                                    className="white"
                                    href={getRedirectUrl(
                                      contest.redirectUrl,
                                      problem
                                    )}
                                    rel="noreferrer"
                                  >
                                    {getProblemName(problem)}
                                  </a>
                                </div>
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Card>
                  </div>
                ))
              ) : (
                <>You have no contests yet</>
              )}
            </div>
          )}
        </div>
      </div>
      <CreateContest
        show={showModal}
        onHide={handleHideModal}
        onContestCreated={onContestCreated}
      />
    </>
  );
};

export default Contests;
