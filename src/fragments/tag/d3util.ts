import * as d3 from "d3";

interface Dims {
  [0]: number;
  [1]: number;
}

export const zoomAndDrag = (svg: any, g: any, dims: Dims) => {
  const zoomed = () => {
    g.attr("transform", d3.event.transform);
  };

  svg.call(
    d3
      .zoom()
      .extent([
        [0, 0],
        [dims[0], dims[1]]
      ])
      .scaleExtent([1, 8])
      .on("zoom", zoomed)
  );
};

interface CreateRootOptions {
  width: number;
  height: number;
}

export const createRoot = (ref: SVGSVGElement, opts: CreateRootOptions) => {
  const svg = d3
    .select(ref)
    .attr("cursor", "grab")
    .attr("viewBox", `0 0 ${opts.width} ${opts.height}`);

  // If SVG was previously added, remove it again so we can replace it
  d3.select(ref)
    .selectAll("g")
    .remove();

  const g = svg.append("g");
  zoomAndDrag(svg, g, [opts.width, opts.height]);
  return { svg, g };
};

export const hookUpSimulation = (
  simulation: d3.Simulation<any, any>,
  node: any,
  link: any
) => {
  simulation.on("tick", () => {
    link
      .attr("x1", (d: any) => d.source.x)
      .attr("y1", (d: any) => d.source.y)
      .attr("x2", (d: any) => d.target.x)
      .attr("y2", (d: any) => d.target.y);

    node.attr("cx", (d: any) => d.x).attr("cy", (d: any) => d.y);
  });
};
