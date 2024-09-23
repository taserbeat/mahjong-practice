import { useState } from "react";

type UseRender = {
  lastRenderdAt: Date;
  updateRender: () => void;
};

const useRender = (): UseRender => {
  const [now, setNow] = useState(new Date());

  const updateRender = () => {
    setNow(new Date());
  };

  return {
    lastRenderdAt: now,
    updateRender: updateRender,
  };
};

export default useRender;
