import { useLayoutEffect, useEffect, useRef, useState } from "react";
import ForceGraph3D from "react-force-graph-3d";
import { UnrealBloomPass } from "https://esm.sh/three/examples/jsm/postprocessing/UnrealBloomPass.js";


function genRandomTree(N = 10, reverse = false) {
  return {
    nodes: [...Array(N).keys()].map((i) => ({ id: i })),
    links: [...Array(N).keys()]
      .filter((id) => id)
      .map((id) => ({
        [reverse ? "target" : "source"]: id,
        [reverse ? "source" : "target"]: Math.floor(Math.random() * (id - 1)),
      })),
  };
}

// Would like to get this example working:
// https://github.com/vasturiano/react-force-graph/blob/master/example/text-nodes/index-3d.html
// Using code from here:
// https://codesandbox.io/p/sandbox/react-l6tnvc?file=%2Fsrc%2FApp.js%3A21%2C7-42%2C9
export default function GraphPlot() {
  // const graphContainerRef = useRef();
  // mapContainerRef.current
  const fgRef = useRef();
  const containerRef = useRef();
  const [size, setSize] = useState([600, 400]);

  useLayoutEffect(() => { // updates component on window resize
      const updateSize = () => {
        setSize([containerRef.current.offsetWidth, containerRef.current.offsetHeight]);
      };

      window.addEventListener("resize", updateSize);
      updateSize();

      return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    const bloomPass = new UnrealBloomPass();
    bloomPass.strength = 0.033;
    bloomPass.radius = 0.01;
    bloomPass.threshold = 0;
    fgRef.current.postProcessingComposer().addPass(bloomPass);
  }, []);

  return (
    <div className="GraphPlot">
      <p className="text-center" style={{ color: "white"}}>EchoFish Meta Graph</p>
      <div ref={containerRef}>
        <ForceGraph3D
          // ref={graphContainerRef}
          ref={fgRef}
          // style={{ minHeight: "100%", minWidth: "100%" }}
          graphData={genRandomTree(15)}
          nodeThreeObjectExtend={true}
          width={size[0]}
          height={size[1]}
          // backgroundColor='#000003'
          backgroundColor="black"
          nodeAutoColorBy="group"
          nodeLabel="id"
          //
          nodeRelSize={6}
          linkDirectionalArrowLength={5}
          linkDirectionalArrowRelPos={1}
          // nodeCanvasObjectMode={() => "after"}
          // nodeThreeObject
          nodeCanvasObject={(node, ctx, globalScale) => {
            const label = node.id;
            const fontSize = 24 / globalScale;
            ctx.font = `${fontSize}px Sans-Serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = "white"; //node.color;
            ctx.beginPath();
            ctx.arc(node.x, node.y, 20, 0, 2 * Math.PI, false);
            ctx.fill();
            ctx.fillText(label, node.x, node.y, 10);
          }}
          linkCurvature={0.025}
          // bloomPass={bloomPass}
        />
      </div>
    </div>
  );
}
