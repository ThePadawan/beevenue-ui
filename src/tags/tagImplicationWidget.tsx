import React, { useEffect, useRef } from "react";
import { Api } from "api";
import { ImplicationData } from "../api/implications";
import { useIsSessionSfw } from "../redux/selectors";
import { createImplicationsSvg } from "./tagImplications";

const TagImplicationWidget = () => {
  const isSessionSfw = useIsSessionSfw();
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    Api.Tags.getImplications().then(res => {
      const implicationData = res.data as ImplicationData;
      createImplicationsSvg(svgRef.current!, implicationData);
    });
  }, [isSessionSfw, svgRef]);

  return (
    <div className="card beevenue-sidebar-card">
      <header className="card-header">
        <p className="card-header-title">Implications</p>
      </header>
      <div className="card-content">
        <div className="content">
          <svg id="beevenue-implication-svg" ref={svgRef}></svg>
        </div>
      </div>
    </div>
  );
};

export { TagImplicationWidget };
