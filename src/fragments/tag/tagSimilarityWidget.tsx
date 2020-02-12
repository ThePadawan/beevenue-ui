import React, { Component } from "react";
import { Api } from "../../api/api";
import * as d3 from "d3";

interface NodeDatum extends d3.SimulationNodeDatum {
  id: string;
  size: number;
  group: number;

  hasAny: boolean;
}

interface LinkDatum extends d3.SimulationLinkDatum<NodeDatum> {
  similarity: number;
  relevance: number;
}

interface CreateSvgOptions {
  hideSingletonNodes?: boolean;
  simThreshold?: number;
  width?: number;
  height?: number;
}

interface CreateSvgOptions2 {
  hideSingletonNodes: boolean;
  simThreshold: number;
  width: number;
  height: number;
}

const createSvg = (ref: any, data: any, options?: CreateSvgOptions) => {
  const defaultOptions: CreateSvgOptions2 = {
    hideSingletonNodes: true,
    simThreshold: 0.4,
    width: 800,
    height: 800
  };

  const opts: CreateSvgOptions2 = { ...defaultOptions, ...options };

  let counter = 2;
  const groupDict = new Map<string, number>();

  // Get groupId based on prefix (a:, c:, p:, ...)
  function grouper(name: string): number {
    const found = name.match(/(.+)\:/);
    if (!found) return 1;

    const m = found[0];

    if (!groupDict.has(m)) {
      groupDict.set(m, counter++);
    }

    return groupDict.get(m)!;
  }

  let nodes: NodeDatum[] = Object.keys(data.nodes).map(k => ({
    id: k,
    hasAny: false,
    group: grouper(k),
    size: data.nodes[k].size
  }));

  let links: LinkDatum[] = [];

  for (let [key, value] of Object.entries(data.links)) {
    const v: any = value;
    for (let [key2, value2] of Object.entries(v)) {
      const v3: any = value2;
      if (v3.similarity < opts.simThreshold) continue;
      if (links.findIndex(l => l.source == key2 && l.target == key) !== -1)
        continue;

      // Tag nodes if they are involved in any edge (so we can hide them later if we want)
      let node = nodes.find(n => n.id == key);
      if (node) {
        node.hasAny = true;
      }
      node = nodes.find(n => n.id == key2);
      if (node) {
        node.hasAny = true;
      }

      links.push({
        source: key,
        target: key2,
        similarity: v3.similarity,
        relevance: v3.relevance
      });
    }
  }

  if (opts.hideSingletonNodes) {
    const lamb = (n: NodeDatum) => {
      return n.hasAny;
    };

    nodes = nodes.filter(lamb);
  }

  const simulation = d3
    .forceSimulation<NodeDatum, LinkDatum>(nodes)
    .force(
      "link",
      d3
        .forceLink<NodeDatum, LinkDatum>(links)
        .id(d => d.id)
        .strength(l => l.similarity)
    )
    .force(
      "charge",
      d3.forceManyBody().strength(_ => -0.5)
    )
    .force(
      "collision",
      d3.forceCollide().radius(_ => 16)
    )
    .force("center", d3.forceCenter(opts.width / 2, opts.height / 2));

  const svg = d3
    .select(ref)
    .attr("viewBox", `0 0 ${opts.width} ${opts.height}`);

  const strokeWidth = (link: LinkDatum) => {
    const logarithmicWidth = Math.log(3 * link.relevance);
    if (logarithmicWidth < 3) return 3;
    if (logarithmicWidth > 60) return 60;
    return logarithmicWidth;
  };

  // If SVG was previously added, remove it again so we can replace it
  d3.select(ref)
    .selectAll("g")
    .remove();

  const link = svg
    .append("g")
    .attr("stroke", "#999")
    .attr("stroke-opacity", 0.6)
    .selectAll("line")
    .data(links)
    .join("line")
    .attr("stroke-width", strokeWidth);

  const sizer = (n: NodeDatum) => {
    const logarithmicSize = Math.log(60 * n.size);
    if (logarithmicSize < 5) return 5;
    if (logarithmicSize > 80) return 80;
    return logarithmicSize;
  };

  const color = () => {
    const scale = d3.scaleOrdinal(d3.schemeCategory10);
    return (d: NodeDatum) => scale(`${d.group}`);
  };

  const drag = (simulation: any) => {
    function dragstarted(d: any) {
      if (!d3.event.active) simulation.alphaTarget(0.15).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(d: any) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragended(d: any) {
      if (!d3.event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return d3
      .drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
  };

  const f: any = drag(simulation);

  const node = svg
    .append("g")
    .attr("stroke", "#fff")
    .attr("stroke-width", 1.5)
    .selectAll("circle")
    .data(nodes)
    .join("circle")
    .attr("r", sizer)
    .attr("fill", color())
    .call(f);

  node.append("title").text((d: NodeDatum) => d.id);

  simulation.on("tick", () => {
    link
      .attr("x1", (d: any) => d.source.x)
      .attr("y1", (d: any) => d.source.y)
      .attr("x2", (d: any) => d.target.x)
      .attr("y2", (d: any) => d.target.y);

    node.attr("cx", (d: any) => d.x).attr("cy", (d: any) => d.y);
  });

  return svg.node();
};

class TagSimilarityWidget extends Component<any, any, any> {
  public constructor(props: any) {
    super(props);
    this.state = { hideSingletonNodes: true, simThreshold: 0.4 };
  }

  public componentDidMount = () => {
    this.loadSimilarity();
  };

  private loadSimilarity = () => {
    Api.Tags.getSimilarity().then(res => {
      this.setState({ ...this.state, similarity: res.data });
      this.refreshSvg();
    });
  };

  private refreshSvg = () => {
    createSvg(this.refs.foobar, this.state.similarity, this.state);
  };

  private toggleSingletons(): void {
    this.setState(
      {
        ...this.state,
        hideSingletonNodes: !this.state.hideSingletonNodes
      },
      () => this.refreshSvg()
    );
  }

  private changeSimThreshold(e: React.ChangeEvent<HTMLInputElement>): void {
    const valueAsNumber = Number.parseFloat(e.currentTarget.value);
    this.setState(
      {
        ...this.state,
        simThreshold: valueAsNumber
      },
      () => this.refreshSvg()
    );
  }

  render() {
    return (
      <div className="card beevenue-sidebar-card">
        <header className="card-header">
          <p className="card-header-title">Similarity</p>
        </header>
        <div className="card-content">
          <div className="content" ref="bar">
            <div className="field">
              <input
                type="checkbox"
                id="hide-singletons-switch"
                name="hide-singletons-switch"
                className="switch"
                defaultChecked={true}
                onChange={_ => this.toggleSingletons()}
              />
              <label htmlFor="hide-singletons-switch">Hide singletons</label>
            </div>
            <div className="field">
              <input
                className="slider is-fullwidth"
                name="sim-threshold-slider"
                step="0.1"
                min="0"
                max="1"
                defaultValue={this.state.simThreshold}
                onChange={e => this.changeSimThreshold(e)}
                type="range"
              />
              <label htmlFor="sim-threshold-slider">
                Threshold: {this.state.simThreshold}
              </label>
            </div>
            <svg ref="foobar"></svg>
          </div>
        </div>
      </div>
    );
  }
}

export { TagSimilarityWidget };
