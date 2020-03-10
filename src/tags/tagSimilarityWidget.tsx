import React, { useEffect, useState, useRef } from "react";
import { Api } from "api";
import { SimilarityData } from "../api/similarity";
import { useIsSessionSfw } from "../redux/selectors";
import { createSimilaritySvg } from "./tagSimilarity";

const useSimThreshold = () => {
  const [simThreshold, setSimThreshold] = useState(0.4);

  const changeSimThreshold = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const valueAsNumber = Number.parseFloat(e.currentTarget.value);
    setSimThreshold(valueAsNumber);
  };

  const simThresholdField = (
    <div className="field">
      <input
        className="slider is-fullwidth"
        name="sim-threshold-slider"
        step="0.1"
        min="0"
        max="1"
        defaultValue={simThreshold}
        onChange={e => changeSimThreshold(e)}
        type="range"
      />
      <label htmlFor="sim-threshold-slider">Threshold: {simThreshold}</label>
    </div>
  );

  return { simThreshold, simThresholdField };
};

const useHideSingletonNodes = () => {
  const [hideSingletonNodes, setHideSingletonNodes] = useState(true);

  const hideSingletonNodesField = (
    <div className="field">
      <input
        type="checkbox"
        id="hide-singletons-switch"
        name="hide-singletons-switch"
        className="switch"
        defaultChecked={true}
        onChange={_ => setHideSingletonNodes(x => !x)}
      />
      <label htmlFor="hide-singletons-switch">Hide singletons</label>
    </div>
  );

  return { hideSingletonNodes, hideSingletonNodesField };
};

const useAutoUpdate = (simThreshold: number, hideSingletonNodes: boolean) => {
  const [similarity, setSimilarity] = useState<SimilarityData | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const isSessionSfw = useIsSessionSfw();
  useEffect(() => {
    Api.Tags.getSimilarity().then(res => {
      setSimilarity(res.data as SimilarityData);
    });
  }, [isSessionSfw]);

  useEffect(() => {
    if (similarity === null) return;
    createSimilaritySvg(svgRef.current!, similarity!, {
      hideSingletonNodes,
      simThreshold
    });
  }, [similarity, hideSingletonNodes, simThreshold]);

  return svgRef;
};

const TagSimilarityWidget = () => {
  const { simThreshold, simThresholdField } = useSimThreshold();
  const {
    hideSingletonNodes,
    hideSingletonNodesField
  } = useHideSingletonNodes();

  const svgRef = useAutoUpdate(simThreshold, hideSingletonNodes);

  return (
    <div className="card beevenue-sidebar-card">
      <header className="card-header">
        <p className="card-header-title">Similarity</p>
      </header>
      <div className="card-content">
        <div className="content">
          {hideSingletonNodesField}
          {simThresholdField}
          <svg ref={svgRef}></svg>
        </div>
      </div>
    </div>
  );
};

export { TagSimilarityWidget };
