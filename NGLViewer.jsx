import React, { useEffect, useRef } from "react";
import * as NGL from "ngl";

export default function NGLViewer({ pdbString }) {
  const stageRef = useRef();

  useEffect(() => {
    if (!pdbString) return;
    const stage = new NGL.Stage(stageRef.current);
    const blob = new Blob([pdbString], { type: "text/plain" });
    stage.loadFile(blob, { ext: "pdb" }).then((comp) => {
      comp.addRepresentation("cartoon", { colorScheme: "residueindex" });
      comp.autoView();
    });
    return () => stage.dispose();
  }, [pdbString]);

  return <div ref={stageRef} style={{ width: "100%", height: "100%" }} />;
}
