import moment from "moment";
import React, { useState, useEffect } from "react";
import ProgressBar from "react-bootstrap/ProgressBar";

const Info = ({ contest }) => {
  const [now, setNow] = useState(Date.now());

  const start = new Date(0);
  start.setSeconds(contest.startTimeInSeconds);

  const end = new Date(0);
  end.setSeconds(contest.startTimeInSeconds + contest.durationInSeconds);

  const total = end - start;
  const current = now - start;
  const started = current >= 0;
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
        <>
          {started ? (
            finished ? (
              "Finished"
            ) : (
              moment.utc(remaining.asMilliseconds()).format("HH:mm:ss")
            )
          ) : (
            <></>
          )}
        </>
      </div>
      {started ? (
        finished ? (
          <></>
        ) : (
          <div className="w-100">
            <ProgressBar
              animated={!finished}
              variant={finished ? "danger" : "info"}
              now={(current * 100) / total}
            />
          </div>
        )
      ) : (
        <div className="flex items-center justify-center mt4">
          Contest did not started yet
        </div>
      )}
    </>
  );
};

export default Info;
