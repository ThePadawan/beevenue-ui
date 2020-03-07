import * as d3 from "d3";
import { hookUpSimulation, createRoot } from "./d3util";
import { ImplicationData } from "../../api/implications";

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

const preprocess = (data: ImplicationData) => {
  let nodes: NodeDatum[] = Object.keys(data.nodes).map(k => ({
    id: k
  }));

  let links: LinkDatum[] = [];

  let roots = Object.keys(data.nodes);

  for (let [key, value] of Object.entries(data.links)) {
    roots.splice(roots.indexOf(key), 1);

    value.forEach(right => {
      links.push({
        source: key,
        target: right
      });
    });
  }

  const radius = 250;

  const rootPositions = new Map<string, number[]>();
  roots.forEach((r: string, i: number) => {
    const increment = (Math.PI * 2) / roots.length;

    const val = i * increment;
    const x = radius * Math.cos(val);
    const y = radius * Math.sin(val);

    rootPositions.set(r, [x, y]);
  });

  return { nodes, links, rootPositions };
};

const linkForce = (links: LinkDatum[]) => {
  return (s: any) => {
    return s.force(
      "link",
      d3
        .forceLink<NodeDatum, LinkDatum>(links)
        .id(d => d.id)
        .strength(2)
    );
  };
};

const chargeForce = (s: any) => {
  return s.force(
    "charge",
    d3.forceManyBody<NodeDatum>().strength((n: NodeDatum) => {
      return 1;
    })
  );
};

const collisionForce = (isRoot: (d: NodeDatum) => boolean) => {
  return (s: any) => {
    return s.force(
      "collision",
      d3.forceCollide<NodeDatum>().radius((d: NodeDatum) => {
        if (isRoot(d)) {
          return 30;
        }
        return 10;
      })
    );
  };
};

const xForce = (
  isRoot: (d: NodeDatum) => boolean,
  rootPositions: Map<string, number[]>,
  opts: CreateSvgOptions2
) => {
  return (s: any) => {
    return s.force(
      "x",
      d3
        .forceX<NodeDatum>((d: NodeDatum, i: number, data: NodeDatum[]) => {
          if (isRoot(d)) {
            return opts.width / 2 + rootPositions.get(d.id)![0];
          }

          return 0;
        })
        .strength((d: NodeDatum, i: number, data: NodeDatum[]) => {
          if (isRoot(d)) {
            return 1;
          }
          return 0;
        })
    );
  };
};

const yForce = (
  isRoot: (d: NodeDatum) => boolean,
  rootPositions: Map<string, number[]>,
  opts: CreateSvgOptions2
) => {
  return (s: any) => {
    return s.force(
      "y",
      d3
        .forceY<NodeDatum>((d: NodeDatum, i: number, data: NodeDatum[]) => {
          if (isRoot(d)) {
            return opts.height / 2 + rootPositions.get(d.id)![1];
          }

          return 0;
        })
        .strength((d: NodeDatum, i: number, data: NodeDatum[]) => {
          if (isRoot(d)) {
            return 1;
          }
          return 0;
        })
    );
  };
};

const createSimulation = (
  nodes: NodeDatum[],
  links: LinkDatum[],
  rootPositions: Map<string, number[]>,
  opts: CreateSvgOptions2
) => {
  const isRoot = (d: NodeDatum): boolean => rootPositions.has(d.id);
  const simulation = d3.forceSimulation<NodeDatum, LinkDatum>(nodes);

  const forces: ((s: any) => any)[] = [
    linkForce(links),
    chargeForce,
    collisionForce(isRoot),
    xForce(isRoot, rootPositions, opts),
    yForce(isRoot, rootPositions, opts)
  ];

  return forces
    .reduce((s, f) => f(s), simulation)
    .force("center", d3.forceCenter(opts.width / 2, opts.height / 2));
};

const strokeWidth = (link: LinkDatum) => {
  return 2;
};

const createLink = (
  g: d3.Selection<SVGGElement, any, any, any>,
  links: LinkDatum[]
) => {
  return g
    .append("g")
    .attr("stroke", "#999")
    .attr("stroke-opacity", 0.6)
    .selectAll("line")
    .data(links)
    .join("line")
    .attr("stroke-width", strokeWidth);
};

const sizer = (isRoot: (d: NodeDatum) => boolean) => {
  return (n: NodeDatum) => {
    if (isRoot(n)) {
      return 12;
    }
    return 7;
  };
};

const color = (isRoot: (d: NodeDatum) => boolean) => {
  const scale = d3.scaleOrdinal(d3.schemeCategory10);
  return (d: NodeDatum) => {
    let index = 1;
    if (isRoot(d)) {
      index++;
    }
    return scale(`${index}`);
  };
};

const createNode = (
  g: d3.Selection<SVGGElement, any, any, any>,
  nodes: NodeDatum[],
  rootPositions: Map<string, number[]>
) => {
  const isRoot = (d: NodeDatum): boolean => rootPositions.has(d.id);

  const node = g
    .append("g")
    .attr("cursor", "auto")
    .attr("stroke", "#fff")
    .attr("stroke-width", 1.5)
    .selectAll("circle")
    .data(nodes)
    .join("circle")
    .attr("r", sizer(isRoot))
    .attr("cx", (n: any): number => {
      if (isRoot(n)) {
        return 200;
      }
      return n.x;
    })
    .attr("fill", color(isRoot));
  node.append("title").text((d: NodeDatum) => d.id);
  return node;
};

export const createImplicationsSvg = (
  ref: SVGSVGElement,
  data: ImplicationData,
  options?: CreateSvgOptions
) => {
  const defaultOptions: CreateSvgOptions2 = {
    width: 800,
    height: 800
  };
  const opts: CreateSvgOptions2 = { ...defaultOptions, ...options };
  const { nodes, links, rootPositions } = preprocess(data);
  const simulation = createSimulation(nodes, links, rootPositions, opts);
  const { svg, g } = createRoot(ref, opts);
  const link = createLink(g, links);
  const node = createNode(g, nodes, rootPositions);
  hookUpSimulation(simulation, node, link);
  return svg.node();
};
