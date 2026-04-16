import "./App.css";
// import RangeBasicsDemo from "./days/day01/range-basics";
// import SelectionControl from "./days/day02/selection-control";
// import SelectionControlAnswer from "./days/day02/selection-control.answer";
import TreeWalker from "./days/day03/tree-walker";
import TreeWalkerAnswer from "./days/day03/tree-walker.answer";

function App() {
  return (
    <div
      style={{
        display: "flex",
        gap: "200px",
      }}
    >
      {/* <RangeBasicsDemo /> */}
      {/* <SelectionControl /> */}
      {/* <SelectionControlAnswer /> */}
      <TreeWalkerAnswer />
      <TreeWalker />
    </div>
  );
}

export default App;
