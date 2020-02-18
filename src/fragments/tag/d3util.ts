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
