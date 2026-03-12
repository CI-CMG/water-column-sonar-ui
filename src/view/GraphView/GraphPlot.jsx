import {
  useLayoutEffect,
  // useEffect,
  useRef,
  useState,
} from "react";
import ForceGraph3D from "react-force-graph-3d";
import SpriteText from 'three-spritetext';
// import { UnrealBloomPass } from "https://esm.sh/three/examples/jsm/postprocessing/UnrealBloomPass.js";


function genRandomTree(N = 10, reverse = false) {
  const foo = {
    nodes: [...Array(N).keys()].map((i) => ({ id: i })),
    links: [...Array(N).keys()]
      .filter((id) => id)
      .map((id) => ({
        [reverse ? "target" : "source"]: id,
        [reverse ? "source" : "target"]: Math.floor(Math.random() * (id - 1)),
      })),
  };
  // debugger;
  return foo;
}

// Would like to get this example working:
// https://github.com/vasturiano/react-force-graph/blob/master/example/text-nodes/index-3d.html
// Using code from here:
// https://codesandbox.io/p/sandbox/react-l6tnvc?file=%2Fsrc%2FApp.js%3A21%2C7-42%2C9
export default function GraphPlot() {
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

  // useEffect(() => {
  //   const bloomPass = new UnrealBloomPass();
  //   bloomPass.strength = 0.033;
  //   bloomPass.radius = 0.01;
  //   bloomPass.threshold = 0;
  //   fgRef.current.postProcessingComposer().addPass(bloomPass);
  // }, []);

  const meta_graph = {
    "nodes": [
      {"id": "Ship", "group": 1},
      {"id": "Cruise", "group": 2},
      {"id": "Instrument", "group": 3},
      {"id": "Annotation", "group": 4},
      {"id": "Project", "group": 5},
      {"id": "Person", "group": 6},
      {"id": "Classification", "group": 7}
    ],
    "links": [
      {"source": "Cruise", "target": "Ship", "value": 1},
      {"source": "Instrument", "target": "Cruise", "value": 3},
      {"source": "Annotation", "target": "Cruise", "value": 3},
      {"source": "Annotation", "target": "Instrument", "value": 4},
      {"source": "Person", "target": "Project", "value": 2},
      {"source": "Person", "target": "Project", "value": 2},
      {"source": "Person", "target": "Annotation", "value": 4},
      {"source": "Classification", "target": "Annotation", "value": 4}
    ]
  };

  return (
    <div className="GraphPlot">
      <div ref={containerRef}>
        <ForceGraph3D
          ref={fgRef}
          // graphData={genRandomTree(15)}
          graphData={meta_graph}
          nodeThreeObjectExtend={true}
          width={size[0]}
          height={size[1]}
          // backgroundColor='rgb(16,16,16)'
          backgroundColor={"rgb(16,16,16)"}
          nodeColor={"pink"}
          // linkColor={"black"}
          nodeAutoColorBy="id"
          nodeLabel="id"
          //
          linkDirectionalParticles={"value"}
          linkDirectionalParticleSpeed={(d) => d.value * 0.001}
          //
          nodeRelSize={3}
          linkDirectionalArrowLength={4}
          linkDirectionalArrowRelPos={1}
          linkWidth={1.5}
          // nodeCanvasObjectMode={() => "after"}
          // nodeThreeObject
          // nodeCanvasObject={(node, ctx, globalScale) => {
          //   const label = node.id;
          //   const fontSize = 32 / globalScale;
          //   ctx.fillStyle = "white"; //node.color;
          //   ctx.font = `${fontSize}px Sans-Serif`;
          //   ctx.textAlign = "center";
          //   ctx.textBaseline = "middle";
          //   ctx.beginPath();
          //   ctx.arc(node.x, node.y, 20, 0, 2 * Math.PI, false);
          //   ctx.fill();
          //   ctx.fillText(label, node.x, node.y, 90);
          // }}
          linkCurvature={0.025}
          // bloomPass={bloomPass}
          //
          nodeThreeObject={
              (node) => {
              const sprite = new SpriteText(node.id);
              sprite.material.depthWrite = false; // make sprite background transparent
              sprite.color = "white";
              sprite.textHeight = 8;
              sprite.center.y = -0.6; // shift above node
              return sprite;
            }
          }
          threeObjectExtend={true}
          //
          linkThreeObjectExtend={true}
          linkThreeObject={(link) => {
            // extend link with text sprite
            const sprite = new SpriteText(`${link.source} > ${link.target}`);
            sprite.color = 'grey';
            sprite.textHeight = 4;
            // sprite.textHeight = 1.5;
            return sprite;
          }}
          linkPositionUpdate={(sprite, { start, end }) => {
            const middlePos = Object.assign(...['x', 'y', 'z'].map(c => ({
              [c]: start[c] + (end[c] - start[c]) / 2 // calc middle point
            })));

            // Position sprite
            Object.assign(sprite.position, middlePos);
          }}
        />
      </div>
    </div>
  );
}
