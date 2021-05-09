import React, { useEffect, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";

import Info from "./Info";
import Standings from "./Standings";

const Contest = ({
  match: {
    params: { id },
  },
}) => {
  const [error, setError] = useState();
  const [contest, setContest] = useState();
  const [loading, setLoading] = useState(true);

  const fetchContest = async (id) => {
    setLoading(true);
    const response = await fetch(
      `https://contest-advisor-service.herokuapp.com/api/contests/${id}`
    );
    if (response.status === 200) {
      setContest(await response.json());
    } else {
      setError(await response.json());
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchContest(id);
  }, [id]);

  return (
    <div className="flex flex-column items-center ph3">
      {loading ? (
        <Spinner animation="border" />
      ) : error || !contest ? (
        <div className="w-100">
          <Alert variant="danger">
            {error.message ? error.message : "An error occurred"}
          </Alert>
        </div>
      ) : (
        <>
          <div className="w-100 mb3">
            <Info
              contest={{
                ...contest,
                startTimeInSeconds: parseInt(contest.startTimeInSeconds),
                durationInSeconds: parseInt(contest.durationInSeconds),
              }}
            />
          </div>
          <div className="w-100">
            <Standings contest={contest} />
          </div>
        </>
      )}
    </div>
  );
};

export default Contest;
