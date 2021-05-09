import React from "react";

import Info from "./Info";
import Standings from "./Standings";

const contest = {
  name: "Dynamic Programming - Easy",
  startTimeInSeconds: 1620525600,
  durationInSeconds: 12200,
  penalty: 50,
  problems: ["A", "B", "C", "D", "F", "G", "H"],
};

const Contest = () => {
  return (
    <div className="flex flex-column ph3">
      <div className="mb3">
        <Info contest={contest} />
      </div>
      <div className="w-100">
        <Standings contest={contest} />
      </div>
    </div>
  );
};

export default Contest;
