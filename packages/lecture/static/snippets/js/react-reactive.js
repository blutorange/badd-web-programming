"babel transform-react-jsx";

const { useEffect, useState } = React;


function MyApp() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <h1>Zähler</h1>
      <p>
        <output>{count}</output>
      </p>
      <button onClick={() => setCount(count - 1)} type="button">Runterzählen</button>
      <button onClick={() => setCount(count - 1)} type="button">Zurücksetzen</button>
      <button onClick={() => setCount(count + 1)} type="button">Hochzählen</button>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<MyApp />);
