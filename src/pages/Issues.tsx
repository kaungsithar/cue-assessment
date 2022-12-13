import React from "react";
import { useParams } from "react-router-dom";

const Issues = () => {
  const { owner, repo } = useParams();
  return (
    <div>
      Issues {owner} {repo}
    </div>
  );
};

export default Issues;
