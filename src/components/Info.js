import moment from "moment";
import React, { useState, useEffect } from "react";
import ProgressBar from "react-bootstrap/ProgressBar";

const Info = ({ contest }) => {
  const [now, setNow] = useState(Date.now());

  const start = new Date(contest.startTimeInSeconds * 1000);

  const end = new Date(
    (contest.startTimeInSeconds + contest.durationInSeconds) * 1000
  );

  const total = end - start;
  const current = now - start;
  const remaining = moment.duration(Math.max(0, end - now));

  const finished = remaining.asMilliseconds() === 0;

  useEffect(() => {
    const run = setInterval(() => setNow(Date.now()), 1000);
    return () => {
      clearInterval(run);
    };
  }, []);

  return (
    <>
      <div className="flex flex-row justify-between items-baseline mb2">
        <h4 className="">{contest.name}</h4>
        {finished
          ? "Finished"
          : moment.utc(remaining.asMilliseconds()).format("HH:mm:ss")}
      </div>
      <div className="w-100">
        <ProgressBar
          animated={!finished}
          variant={finished ? "success" : "info"}
          now={(current * 100) / total}
        />
      </div>
    </>
  );
};

export default Info;
