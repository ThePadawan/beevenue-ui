interface NodeData {
  size: number;
}

interface LinkData {
  similarity: number;
  relevance: number;
}

interface NodesData {
  [tag: string]: NodeData;
}

interface LinksData {
  [tag: string]: LinkData;
}

export interface SimilarityData {
  nodes: NodesData;
  links: LinksData;
}
