import * as d3 from "d3";
import { hookUpSimulation, createRoot } from "./d3util";
import { SimilarityData } from "../api/similarity";

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

const preprocessNodes = (data: SimilarityData) => {
  let counter = 2;
  const groupDict = new Map<string, number>();

  // Get groupId based on prefix (a:, c:, p:, ...)
  const grouper = (name: string): number => {
    const found = name.match(/(.+):/);
    if (!found) return 1;
    const m = found[0];
    if (!groupDict.has(m)) {
      groupDict.set(m, counter++);
    }
    return groupDict.get(m)!;
  };

  let nodes: NodeDatum[] = Object.keys(data.nodes).map((k) => ({
    id: k,
    hasAny: false,
    group: grouper(k),
    size: data.nodes[k].size,
  }));

  return nodes;
};

const preprocessLinks = (
  nodes: NodeDatum[],
  data: SimilarityData,
  opts: CreateSvgOptions2
): LinkDatum[] => {
  let links: LinkDatum[] = [];

  for (let [key, value] of Object.entries(data.links)) {
    const v: any = value;
    for (let [key2, value2] of Object.entries(v)) {
      const v3: any = value2;
      if (v3.similarity < opts.simThreshold) continue;
      if (links.findIndex((l) => l.source === key2 && l.target === key) !== -1)
        continue;

      // Tag nodes if they are involved in any edge (so we can hide them later if we want)
      let node = nodes.find((n) => n.id === key);
      if (node) {
        node.hasAny = true;
      }
      node = nodes.find((n) => n.id === key2);
      if (node) {
        node.hasAny = true;
      }

      links.push({
        source: key,
        target: key2,
        similarity: v3.similarity,
        relevance: v3.relevance,
      });
    }
  }

  return links;
};

const preprocess = (data: SimilarityData, opts: CreateSvgOptions2) => {
  let nodes = preprocessNodes(data);
  const links = preprocessLinks(nodes, data, opts);

  if (opts.hideSingletonNodes) {
    nodes = nodes.filter((n: NodeDatum) => {
      return n.hasAny;
    });
  }

  return { nodes, links };
};

const createSimulation = (
  nodes: NodeDatum[],
  links: LinkDatum[],
  opts: CreateSvgOptions2
) => {
  return d3
    .forceSimulation<NodeDatum, LinkDatum>(nodes)
    .force(
      "link",
      d3
        .forceLink<NodeDatum, LinkDatum>(links)
        .id((d) => d.id)
        .strength((l) => 2 * l.similarity)
    )
    .force(
      "charge",
      d3.forceManyBody().strength((_) => -3)
    )
    .force(
      "collision",
      d3.forceCollide().radius((_) => 16)
    )
    .force("center", d3.forceCenter(opts.width / 2, opts.height / 2));
};

const strokeWidth = (link: LinkDatum) => {
  const logarithmicWidth = Math.log(3 * link.relevance);
  if (logarithmicWidth < 3) return 3;
  if (logarithmicWidth > 60) return 60;
  return logarithmicWidth;
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

const createNode = (
  g: d3.Selection<SVGGElement, any, any, any>,
  nodes: NodeDatum[]
) => {
  const node = g
    .append("g")
    .attr("cursor", "auto")
    .attr("stroke", "#fff")
    .attr("stroke-width", 1.5)
    .selectAll("circle")
    .data(nodes)
    .join("circle")
    .attr("r", sizer)
    .attr("fill", color());

  node.append("title").text((d: NodeDatum) => d.id);
  return node;
};

export const createSimilaritySvg = (
  ref: SVGSVGElement,
  data: SimilarityData,
  options?: CreateSvgOptions
) => {
  const defaultOptions: CreateSvgOptions2 = {
    hideSingletonNodes: true,
    simThreshold: 0.4,
    width: 800,
    height: 800,
  };

  const opts: CreateSvgOptions2 = { ...defaultOptions, ...options };
  const { nodes, links } = preprocess(data, opts);
  const { g, svg } = createRoot(ref, opts);
  const link = createLink(g, links);
  const node = createNode(g, nodes);
  const simulation = createSimulation(nodes, links, opts);
  hookUpSimulation(simulation, node, link);
  return svg.node();
};
