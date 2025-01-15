import './App.css';
import { useLayoutEffect, useState } from 'react';
import rough from 'roughjs';
const generator = rough.generator();

function App() {
  const [element, setElement] = useState([]);
  const [drawing, setDrawing] = useState([]);
  useLayoutEffect(  () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const roughCanvas = rough.canvas(canvas);
  const rect = generator.rectangle(10,10,100,100);
  const line = generator.line(10,10,110,110);
  roughCanvas.draw(rect);
  roughCanvas.draw(line);
  })
  const handleMouseDown = (event) => {
    setDrawing(true)
  };
  const handleMouseMove = () => {};
  const handleMouseUp = () => {};

  return (
    <canvas id="canvas" 
    width = {window.innerWidth}
    height ={window.innerHeight}
    onMouseDown={handleMouseDown}
    onMouseMove={handleMouseMove}
    onMouseUp={handleMouseUp}
    >
    Canvas
    </canvas>
  );
}

export default App;
