import './App.css';
import { useLayoutEffect, useState } from 'react';
import rough from 'roughjs';

const generator = rough.generator();

function createElement(x1, y1, x2, y2,Type) {
  const roughElement = Type === "line" ? generator.line(x1, y1, x2, y2) : generator.rectangle(x1, y1, x2-x1, y2-y1)  ;
  return { x1, y1, x2, y2, roughElement };
}

function App() {
  const [elements, setElements] = useState([]);
  const [drawing, setDrawing] = useState(false);
  const [elementType, setElementType] = useState("line")
  useLayoutEffect(() => {
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);

    const roughCanvas = rough.canvas(canvas);
    elements.forEach(({ roughElement }) => roughCanvas.draw(roughElement));
  }, [elements]);

  const handleMouseDown = (event) => {
    const canvas = document.getElementById('canvas');
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const newElement = createElement(x, y, x, y, elementType);
    setElements((prevElements) => [...prevElements, newElement]);
    setDrawing(true);
  };

  const handleMouseMove = (event) => {
    if (!drawing) return;

    const canvas = document.getElementById('canvas');
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const index = elements.length - 1;
    const { x1, y1 } = elements[index];
    const updatedElement = createElement(x1, y1, x, y,elementType);

    // Update the last element in the array
    setElements((prevElements) =>
      prevElements.map((el, i) => (i === index ? updatedElement : el))
    );
  };

  const handleMouseUp = () => {
    setDrawing(false);
  };
  

  return (
    <div>
      <div style={{ position:"fixed", padding: '10px', background: '#fff' }}>
        <input
        type = "radio"
        id = "line"
        checked =  {elementType === "line"}
        onChange = {() => setElementType("line")}
        />
        <lable htmlFor="line">Line</lable>
        <input
        type = "radio"
        id = "rectangle"
        checked =  {elementType === "rectangle"}
        onChange = {() => setElementType("rectangle")}
        />
         <lable htmlFor="rectangle">Rectangle</lable>
      </div>
      <canvas
        id="canvas"
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        Canvas
      </canvas>
    </div>
  );
}

export default App;
