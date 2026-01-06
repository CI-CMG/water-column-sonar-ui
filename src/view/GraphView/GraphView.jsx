import {
  useEffect,
  useRef,
} from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ForceGraph3D from 'react-force-graph-3d';
import { createRoot } from 'react-dom';
import SpriteText from "https://esm.sh/three-spritetext";
    import { UnrealBloomPass } from 'https://esm.sh/three/examples/jsm/postprocessing/UnrealBloomPass.js';



// Would like to get this example working:
// https://github.com/vasturiano/react-force-graph/blob/master/example/text-nodes/index-3d.html
// Using code from here:
// https://codesandbox.io/p/sandbox/react-l6tnvc?file=%2Fsrc%2FApp.js%3A21%2C7-42%2C9
export default function GraphView() {

  useEffect(() => {
    document.title = `Graph`;
  }, []);

  function genRandomTree(N = 100, reverse = false) {
    return {
      nodes: [...Array(N).keys()].map((i) => ({ id: i })),
      links: [...Array(N).keys()]
        .filter((id) => id)
        .map((id) => ({
          [reverse ? "target" : "source"]: id,
          [reverse ? "source" : "target"]: Math.floor(Math.random() * (id - 1))
        }))
    };
  }
  const fgRef = useRef();

  // useEffect(() => {
  //   const bloomPass = new UnrealBloomPass();
  //   bloomPass.strength = 10;
  //   bloomPass.radius = 10;
  //   bloomPass.threshold = 10;
  //   fgRef.current.postProcessingComposer().addPass(bloomPass);
  // }, []);

  return (
    <div className="GraphView">
            <ForceGraph3D
              ref={fgRef}
              graphData={genRandomTree(70)}
              nodeThreeObjectExtend={true}
              nodeAutoColorBy="group"
              nodeLabel="id"
              backgroundColor="purple"
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
                // ctx.arc(x, y, Math.max(fontSize / 1.4 + id), 0, 2 * Math.PI, false);
                ctx.arc(node.x, node.y, 20, 0, 2 * Math.PI, false);
                ctx.fill();
                ctx.fillText(label, node.x, node.y, 10);
              }}
              linkCurvature={0.025}
            />
    </div>
  );
}
