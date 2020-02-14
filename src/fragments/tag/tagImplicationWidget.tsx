import React, { Component } from "react";
import { Api } from "../../api/api";
import * as d3 from "d3";

interface NodeDatum extends d3.SimulationNodeDatum {
  id: string;
}

interface LinkDatum extends d3.SimulationLinkDatum<NodeDatum> {}

interface CreateSvgOptions {
  width?: number;
  height?: number;
}

interface CreateSvgOptions2 {
  width: number;
  height: number;
}

const createSvg = (ref: any, data: any, options?: CreateSvgOptions) => {
  const defaultOptions: CreateSvgOptions2 = {
    width: 800,
    height: 800
  };

  const opts: CreateSvgOptions2 = { ...defaultOptions, ...options };

  let nodes: NodeDatum[] = Object.keys(data.nodes).map(k => ({
    id: k
  }));

  let links: LinkDatum[] = [];

  let roots = Object.keys(data.nodes);

  for (let [key, value] of Object.entries(data.links)) {
    const v: any = value;

    roots.splice(roots.indexOf(key), 1);

    v.forEach((right: any) => {
      links.push({
        source: key,
        target: right
      });
    });
  }

  const isRoot = (d: NodeDatum): boolean => roots.indexOf(d.id) !== -1;

  const radius = 250;

  const rootPositions = new Map<string, any[]>();
  roots.forEach((r: string, i: number) => {
    const increment = (Math.PI * 2) / roots.length;

    const val = i * increment;
    const x = radius * Math.cos(val);
    const y = radius * Math.sin(val);

    rootPositions.set(r, [x, y]);
  });

  const simulation = d3
    .forceSimulation<NodeDatum, LinkDatum>(nodes)
    .force(
      "link",
      d3.forceLink<NodeDatum, LinkDatum>(links).id(d => d.id)
    )
    .force(
      "charge",
      d3.forceManyBody<NodeDatum>().strength((n: NodeDatum) => {
        return 1;
      })
    )
    .force(
      "collision",
      d3.forceCollide<NodeDatum>().radius((d: NodeDatum) => {
        if (isRoot(d)) {
          return 30;
        }

        return 15;
      })
    )
    .force("center", d3.forceCenter(opts.width / 2, opts.height / 2))
    .force(
      "x",
      d3
        .forceX<NodeDatum>((d: NodeDatum, i: number, data: NodeDatum[]) => {
          if (isRoot(d)) {
            return opts.width / 2 + rootPositions.get(d.id)![0];
          }

          return d.x || opts.width / 2;
        })
        .strength((d: NodeDatum, i: number, data: NodeDatum[]) => {
          if (isRoot(d)) {
            return 1;
          }
          return 0;
        })
    )
    .force(
      "y",
      d3
        .forceY<NodeDatum>((d: NodeDatum, i: number, data: NodeDatum[]) => {
          if (isRoot(d)) {
            return opts.height / 2 + rootPositions.get(d.id)![1];
          }
          return d.y || opts.height / 2;
        })
        .strength((d: NodeDatum, i: number, data: NodeDatum[]) => {
          if (isRoot(d)) {
            return 1;
          }
          return 0;
        })
    );

  const svg = d3
    .select(ref)
    .attr("viewBox", `0 0 ${opts.width} ${opts.height}`);

  const strokeWidth = (link: LinkDatum) => {
    return 1;
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
    if (isRoot(n)) {
      return 12;
    }
    return 8;
  };

  const color = () => {
    const scale = d3.scaleOrdinal(d3.schemeCategory10);
    return (d: NodeDatum) => {
      let index = 1;
      if (isRoot(d)) {
        index++;
      }
      return scale(`${index}`);
    };
  };

  const node = svg
    .append("g")
    .attr("stroke", "#fff")
    .attr("stroke-width", 1.5)
    .selectAll("circle")
    .data(nodes)
    .join("circle")
    .attr("r", sizer)
    .attr("cx", (n: any): number => {
      if (isRoot(n)) {
        return 200;
      }
      return n.x;
    })
    .attr("fill", color());

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

class TagImplicationWidget extends Component<any, any, any> {
  public constructor(props: any) {
    super(props);
    this.state = {};
  }

  public componentDidMount = () => {
    this.loadImplications();
  };

  private loadImplications = () => {
    Api.Tags.getImplications().then(res => {
      this.setState({ ...this.state, implications: res.data });
      this.refreshSvg();
    });
  };

  private refreshSvg = () => {
    createSvg(this.refs.foobar, this.state.implications, this.state);
  };

  render() {
    return (
      <div className="card beevenue-sidebar-card">
        <header className="card-header">
          <p className="card-header-title">Implications</p>
        </header>
        <div className="card-content">
          <div className="content" ref="bar">
            <svg ref="foobar"></svg>
          </div>
        </div>
      </div>
    );
  }
}

export { TagImplicationWidget };
