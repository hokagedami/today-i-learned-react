import "./style.css"
import {useState} from "react";

const CATEGORIES = [
    { name: "technology", color: "#3b82f6" },
    { name: "science", color: "#16a34a" },
    { name: "finance", color: "#ef4444" },
    { name: "society", color: "#eab308" },
    { name: "entertainment", color: "#db2777" },
    { name: "health", color: "#14b8a6" },
    { name: "history", color: "#f97316" },
    { name: "news", color: "#8b5cf6" },
];

const initialFacts = [
    {
        id: 1,
        text: "React is being developed by Meta (formerly facebook)",
        source: "https://opensource.fb.com/",
        category: "technology",
        votesInteresting: 24,
        votesMindblowing: 9,
        votesFalse: 4,
        createdIn: 2021,
    },
    {
        id: 2,
        text: "Millennial dads spend 3 times as much time with their kids than their fathers spent with them. In 1982, 43% of fathers had never changed a diaper. Today, that number is down to 3%",
        source:
            "https://www.mother.ly/parenting/millennial-dads-spend-more-time-with-their-kids",
        category: "society",
        votesInteresting: 11,
        votesMindblowing: 2,
        votesFalse: 0,
        createdIn: 2019,
    },
    {
        id: 3,
        text: "Lisbon is the capital of Portugal",
        source: "https://en.wikipedia.org/wiki/Lisbon",
        category: "society",
        votesInteresting: 8,
        votesMindblowing: 3,
        votesFalse: 1,
        createdIn: 2015,
    },
];
function App() {
    const [showForm, setShowForm] = useState(false);
  return (
      <>
          <Header showForm={showForm} setShowForm={setShowForm}/>

          {showForm ? <NewFactForm/> : null}

          <main className={"main"}>
              <CategoryFilter/>
              <FactList/>
          </main>
      </>
  )
}

function Header({showForm, setShowForm}){
    const appTitle = "Today I Learned";
    return <header className={"header"}>
        <div className={"logo"} >
            <img src={"logo.png"} alt="Today I Learned Logo"/>
        </div>
        <h1>{appTitle}</h1>

        <button className={"btn btn-large"} onClick={() => setShowForm(!showForm)}>
            {showForm ? "Close" : "Share a fact"}
        </button>
    </header>
}
function NewFactForm(){

    const [text, setText] = useState("");
    return <form className={"fact-form"}>
        <input type="text"
               placeholder="Share a fact with the world..."
               onChange={(e) => setText(e.target.value)}/>
        <span>200</span>
        <input type="text" placeholder="Trustworthy source..."/>
        <select>
            <option value="">Choose category:</option>
            {CATEGORIES.map((category) => (
                <option key={category.name} value={category.name}>{category.name.toUpperCase()}</option>
            ))}
        </select>
        <button className="btn btn-large">Post</button>
    </form>
}
function CategoryFilter(){
  return <aside>
    <ul>
        <li className={"category"}>
            <button
                className={"btn btn-all-categories"}>
                All
            </button>
        </li>
        { CATEGORIES.map((category) => (
            <li key={category.name} className={"category"}>
                <button
                    className={"btn btn-category"}
                    style={{"backgroundColor": category.color}}>
                    {category.name}
                </button>
            </li>
        ))}
    </ul>
  </aside>
}
function FactList(){
    return <section>
        <ul className={"facts-list"}>
            {
                initialFacts.map((fact) => (
                    <Fact factObject={fact} key={fact.id}/>
                ))
            }
        </ul>
    </section>
}
function Fact(props){
    const fact = props.factObject;
    return <li className={"fact"}>
        <p>{fact.text}
            <a href={fact.source}
               className={"source"}
               target={"_blank"} rel="noreferrer">
                (Source)
            </a>
        </p>
        <span className={"tag"} style={{backgroundColor: "#3b82f6"}}>
                            {fact.category}
                        </span>
        <div className={"vote-buttons"}>
            <button>👍 {fact.votesInteresting}</button>
            <button>🤯 {fact.votesMindblowing}</button>
            <button>⛔️ {fact.votesFalse}</button>
        </div>
    </li>
}
export default App;