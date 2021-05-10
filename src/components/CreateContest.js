import React, { useState } from "react";

import { useAuth } from "../contexts/AuthContext";

import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";

import { getProblemName, getRedirectUrl } from "../utils";

const DEFAULT_CONTEST = {
  name: "",
  penalty: 0,
  redirectUrl:
    "https://codeforces.com/problemset/problem/{contestId}/{problemIndex}",
  connector: "codeforces",
  durationInSeconds: 0,
  startTimeInSeconds: 0,
  problems: [],
  contestants: [],
};

const CreateContest = ({ onContestCreated, ...props }) => {
  const { currentUser } = useAuth();
  const [count, setCount] = useState(0);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [contest, setContest] = useState(DEFAULT_CONTEST);

  const setFieldValue = (field, value) => {
    setContest({
      ...contest,
      [field]: value,
    });
  };

  const createContest = async () => {
    setLoading(true);
    try {
      const token = await currentUser.getIdToken();
      const response = await fetch(
        "https://contest-advisor-service.herokuapp.com/api/contests",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(contest),
        }
      );
      if (response.status === 201) {
        setContest(DEFAULT_CONTEST);
        onContestCreated();
      }
    } catch (err) {}
    setLoading(false);
  };

  const fetchRecommendedProblems = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://contest-advisor-service.herokuapp.com/api/connectors/${contest.connector}/recommendedProblems`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            count,
            contestants: contest.contestants,
            topics,
          }),
        }
      );
      if (response.status === 200) {
        const recommendation = await response.json();
        setFieldValue("problems", recommendation.problems);
      }
    } catch (err) {}
    setLoading(false);
  };

  const handleOperation = () => {
    if (contest.problems.length > 0) {
      createContest();
    } else {
      fetchRecommendedProblems();
    }
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <div className="f3">Create Contest</div>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <div className="mb2">
            <Form.Label>Name</Form.Label>
            <Form.Control
              required
              type="text"
              onChange={(e) => setFieldValue("name", e.target.value)}
            />
          </div>
          <div className="flex flex-row mb2">
            <div className="flex flex-column w-25 mr3">
              <div className="mb2">Penalty</div>
              <Form.Control
                required
                type="number"
                onChange={(e) =>
                  setFieldValue("penalty", parseInt(e.target.value || 0))
                }
              />
            </div>
            <div className="flex flex-column w-25 mr3">
              <div className="mb2">Start</div>
              <Form.Control
                required
                type="number"
                onChange={(e) =>
                  setFieldValue(
                    "startTimeInSeconds",
                    parseInt(e.target.value || 0)
                  )
                }
              />
            </div>
            <div className="flex flex-column w-25 mr3">
              <div className="mb2">Duration</div>
              <Form.Control
                required
                type="number"
                onChange={(e) =>
                  setFieldValue(
                    "durationInSeconds",
                    parseInt(e.target.value || 0)
                  )
                }
              />
            </div>
            <div className="flex flex-column w-25">
              <div className="mb2">Number of Problems</div>
              <Form.Control
                required
                type="number"
                onChange={(e) => setCount(parseInt(e.target.value || 0))}
              />
            </div>
          </div>
          <div className="flex flex-column w-100 mb2">
            <div className="mb2">Contestants</div>
            {contest.contestants.length > 0 && (
              <div className="flex flex-row flex-wrap mb3">
                {contest.contestants.map((contestant) => (
                  <div
                    key={`*contestant_${contestant}*`}
                    className="mr2"
                    onClick={() => {
                      setFieldValue(
                        "contestants",
                        contest.contestants.filter((_) => _ !== contestant)
                      );
                    }}
                  >
                    <Badge pill variant="secondary">
                      <div className="pa1">{contestant}</div>
                    </Badge>
                  </div>
                ))}
              </div>
            )}
            <div className="w-100">
              <Form.Control
                required
                type="text"
                onKeyDown={(e) => {
                  if (e.key !== "Enter") {
                    return;
                  }
                  const contestant = e.target.value;
                  if (
                    contestant &&
                    contestant.length &&
                    contest.contestants.indexOf(contestant) === -1
                  ) {
                    e.target.value = "";
                    setFieldValue("contestants", [
                      ...contest.contestants,
                      contestant,
                    ]);
                  }
                }}
              />
            </div>
          </div>
          <div className="flex flex-column w-100 mb2">
            <div className="mb2">Topics</div>
            {topics.length > 0 && (
              <div className="flex flex-row flex-wrap mb3">
                {topics.map((topic) => (
                  <div
                    key={`*topic_${topic}*`}
                    className="mr2"
                    onClick={() => {
                      setTopics(topics.filter((_) => _ !== topic));
                    }}
                  >
                    <Badge pill variant="secondary">
                      <div className="pa1">{topic}</div>
                    </Badge>
                  </div>
                ))}
              </div>
            )}
            <div className="w-100">
              <Form.Control
                required
                type="text"
                onKeyDown={(e) => {
                  if (e.key !== "Enter") {
                    return;
                  }
                  const topic = e.target.value;
                  if (topic && topic.length && topics.indexOf(topic) === -1) {
                    e.target.value = "";
                    setTopics([...topics, topic]);
                  }
                }}
              />
            </div>
          </div>
          {contest.problems.length > 0 && (
            <div className="flex flex-column w-100 mt2">
              <div className="mb2">Problems</div>
              <div className="flex flex-row flex-wrap mb2">
                {contest.problems.map((problem) => (
                  <div key={`*problem_${problem}*`} className="mr2 mb2">
                    <Badge pill variant="secondary">
                      <div className="pa1">
                        <a
                          target="_blank"
                          className="white"
                          href={getRedirectUrl(contest.redirectUrl, problem)}
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
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.onHide}>
          Close
        </Button>
        {loading ? (
          <Button variant="primary">
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
            <span className="ml2">Loading...</span>
          </Button>
        ) : (
          <Button onClick={handleOperation}>
            {contest.problems.length > 0
              ? "Create"
              : "Get Recommended Problems"}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default CreateContest;
