import { useState } from "react";

type UseRender = {
  updateRender: () => void;
};

const useRender = (): UseRender => {
  const [_, setNow] = useState(new Date());

  const updateRender = () => {
    setNow(new Date());
  };

  return {
    updateRender: updateRender,
  };
};

export default useRender;
