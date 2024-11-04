// import { useEffect, useRef } from "react";
// import * as THREE from "three";
import {
  Color,
  FrontSide,
  MeshPhysicalMaterial,
  Mesh,
  Group,
  AmbientLight,
} from "three";
import { Canvas } from "@react-three/fiber";
import {
  useGLTF,
  Float,
  MeshTransmissionMaterial,
  AccumulativeShadows,
  RandomizedLight,
  Environment,
  OrbitControls,
  Center,
  Bounds,
} from "@react-three/drei";
import { useControls } from "leva";
// import { Perf } from "r3f-perf";
// import queryString from "query-string";
// import { useLocation } from "react-router-dom";

export function GelatinousCube() {
  const config = useControls({
    meshPhysicalMaterial: false,
    samples: { value: 10, min: 1, max: 32, step: 1 },
    resolution: { value: 2048, min: 32, max: 2048, step: 32 },
    refraction: { value: 1.15, min: 0, max: 2 },
    roughness: { value: 0, min: 0, max: 1 },
    rgbShift: { value: 0.25, min: 0, max: 1 },
    noise: { value: 0.04, min: 0, max: 1, step: 0.01 },
    contrast: { value: 1, min: 0.0, max: 5.0 },
    saturation: { value: 1.0, min: 0, max: 1, step: 0.01 },
    clearcoat: { value: 1, min: 0, max: 1 },
    clearcoatRoughness: { value: 0, min: 0, max: 1 },
    color: "#c9ffa1",
    bg: "#334e3b",
  });
  const { nodes, materials } = useGLTF("/gelatinous_cube-transformed.glb");
  return (
    <Group dispose={null}>
      <Mesh geometry={nodes.cube1.geometry} position={[-0.56, 0.38, -0.11]}>
        {config.meshPhysicalMaterial ? (
          <MeshPhysicalMaterial
            transmission={1}
            {...config}
            thickness={config.refraction * 2 + config.rgbShift}
            roughness={config.roughness * 2}
          />
        ) : (
          <MeshTransmissionMaterial
            resolution={2048}
            background={new Color(config.bg)}
            {...config}
          />
        )}
      </Mesh>
      <Mesh
        castShadow
        renderOrder={-100}
        geometry={nodes.cube2.geometry}
        material={materials.cube_mat}
        material-side={FrontSide}
        position={[-0.56, 0.38, -0.11]}
      />
      <Mesh
        geometry={nodes.bubbles.geometry}
        material={materials.cube_bubbles_mat}
        position={[-0.56, 0.38, -0.11]}
      />
      <Group position={[-0.56, 0.38, -0.41]}>
        <Mesh
          geometry={nodes.arrows.geometry}
          material={materials.weapons_mat}
        />
        <Float floatIntensity={0.2} rotationIntensity={0.2} speed={2}>
          <Mesh
            geometry={nodes.skeleton_1.geometry}
            material={materials.skele_mat}
          />
          <Mesh
            geometry={nodes.skeleton_2.geometry}
            material={materials.weapons_mat}
            material-side={FrontSide}
          />
        </Float>
      </Group>
    </Group>
  );
}

// https://codesandbox.io/p/sandbox/meshepoxymaterial-forked-ycyux0?file=%2Fsrc%2FApp.js%3A10%2C1-11%2C1
export default function WaterColumnView2() {
  return (
    <div className="WaterColumnView2">
      <div className="water-column-view2">
        <Canvas shadows camera={{ position: [15, 10, 15], fov: 35 }}>
          <AmbientLight intensity={0.75} />
          <Bounds fit observe margin={1.25}>
            <Center top>
              <GelatinousCube />
            </Center>
          </Bounds>
          <AccumulativeShadows
            temporal
            frames={100}
            alphaTest={0.9}
            color="#3ead5d"
            colorBlend={1}
            opacity={0.95}
            scale={12}
          >
            <RandomizedLight
              radius={8}
              ambient={0.5}
              intensity={1}
              position={[2.5, 5, -2.5]}
              bias={0.001}
            />
          </AccumulativeShadows>
          <OrbitControls
            minPolarAngle={0}
            maxPolarAngle={Math.PI / 2}
            autoRotate
            autoRotateSpeed={0.1}
            makeDefault
          />
          <Environment
            files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/dancing_hall_1k.hdr"
            background
            blur={1}
          />
          {/* <Perf position="bottom-right" style={{ transform: "scale(0.8)" }} /> */}
        </Canvas>
      </div>
    </div>
  );
}
