interface NodesData {
  [tag: string]: object;
}

interface LinksData {
  [tag: string]: string[];
}

export interface ImplicationData {
  nodes: NodesData;
  links: LinksData;
}
