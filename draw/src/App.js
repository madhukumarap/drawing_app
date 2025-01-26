import './App.css';
import { useLayoutEffect, useState } from 'react';
import rough from 'roughjs';

const generator = rough.generator();

function createElement(x1, y1, x2, y2, type) {
  const roughElement =
    type === 'line'
      ? generator.line(x1, y1, x2, y2)
      : generator.rectangle(x1, y1, x2 - x1, y2 - y1);
  return { x1, y1, x2, y2, type, roughElement };
}

const isWithinElement = (x, y, element) => {
  const { type, x1, x2, y1, y2 } = element;
  if (type === 'rectangle') {
    const minX = Math.min(x1, x2);
    const minY = Math.min(y1, y2);
    const maxX = Math.max(x1, x2);
    const maxY = Math.max(y1, y2);
    return x >= minX && x <= maxX && y >= minY && y <= maxY;
  } else if (type === 'line') {
    const a = { x: x1, y: y1 };
    const b = { x: x2, y: y2 };
    const c = { x, y };
    const distanceAB = distance(a, b);
    const distanceAC = distance(a, c);
    const distanceBC = distance(b, c);
    const offset = Math.abs(distanceAB - (distanceAC + distanceBC));
    return offset < 1; // Tolerance for selection
  }
};

const distance = (a, b) =>
  Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));

const getElementAtPosition = (x, y, elements) => {
  return elements.find((element) => isWithinElement(x, y, element));
};

function App() {
  const [elements, setElements] = useState([]);
  const [action, setAction] = useState('none');
  const [tool, setTool] = useState('line');
  const [selectedElement, setSelectedElement] = useState(null);

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

    if (tool === 'selection') {
      const element = getElementAtPosition(x, y, elements);
      if (element) {
        setSelectedElement({ ...element, offsetX: x - element.x1, offsetY: y - element.y1 });
        setAction('moving');
      }
    } else {
      const newElement = createElement(x, y, x, y, tool);
      setElements((prevElements) => [...prevElements, newElement]);
      setAction('drawing');
    }
  };

  const handleMouseMove = (event) => {
    const canvas = document.getElementById('canvas');
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (action === 'drawing') {
      const index = elements.length - 1;
      const { x1, y1 } = elements[index];
      const updatedElement = createElement(x1, y1, x, y, tool);

      setElements((prevElements) =>
        prevElements.map((el, i) => (i === index ? updatedElement : el))
      );
    } else if (action === 'moving' && selectedElement) {
      const { id, offsetX, offsetY } = selectedElement;
      const index = elements.findIndex((el) => el === selectedElement);
      const updatedElement = createElement(
        x - offsetX,
        y - offsetY,
        x - offsetX + (selectedElement.x2 - selectedElement.x1),
        y - offsetY + (selectedElement.y2 - selectedElement.y1),
        selectedElement.type
      );

      setElements((prevElements) =>
        prevElements.map((el, i) => (i === index ? updatedElement : el))
      );
    }
  };

  const handleMouseUp = () => {
    setAction('none');
    setSelectedElement(null);
  };

  return (
    <div>
      <div style={{ position: 'fixed', padding: '10px', background: '#fff' }}>
        <input
          type="radio"
          id="selection"
          checked={tool === 'selection'}
          onChange={() => setTool('selection')}
        />
        <label htmlFor="selection">Selection</label>
        <input
          type="radio"
          id="line"
          checked={tool === 'line'}
          onChange={() => setTool('line')}
        />
        <label htmlFor="line">Line</label>
        <input
          type="radio"
          id="rectangle"
          checked={tool === 'rectangle'}
          onChange={() => setTool('rectangle')}
        />
        <label htmlFor="rectangle">Rectangle</label>
        <button onClick={() => setElements([])}>Clear Canvas</button>
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
