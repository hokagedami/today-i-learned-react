import "./style.css"
import {useEffect, useState} from "react";
import supabase from "./data";

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
        votesMindBlowing: 9,
        votesFalse: 4,
        createdAt: 2021,
    },
    {
        id: 2,
        text: "Millennial dads spend 3 times as much time with their kids than their fathers spent with them. In 1982, 43% of fathers had never changed a diaper. Today, that number is down to 3%",
        source:
            "https://www.mother.ly/parenting/millennial-dads-spend-more-time-with-their-kids",
        category: "society",
        votesInteresting: 11,
        votesMindBlowing: 2,
        votesFalse: 0,
        createdAt: 2019,
    },
    {
        id: 3,
        text: "Lisbon is the capital of Portugal",
        source: "https://en.wikipedia.org/wiki/Lisbon",
        category: "society",
        votesInteresting: 8,
        votesMindBlowing: 3,
        votesFalse: 1,
        createdAt: 2015,
    },
];

function isValidUrl(urlString){
    try {
        return Boolean(new URL(urlString));
    }
    catch(e){
        return false;
    }
}

function App() {
    const [showForm, setShowForm] = useState(false);
    const [facts, setFacts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingText, setIsLoadingText] = useState("Loading...");
    const [currentCategory, setCurrentCategory] = useState("all");
    useEffect( function() {
        async function getFacts(){
            setIsLoading(true);
            let query = supabase
                .from('facts')
                .select('*');
            if(currentCategory !== "all"){
                query = query.eq('category', currentCategory);
            }
            query = query.order("created_at", {ascending: false})
            const { data: facts, error } = await query;
            if(error) {
                setIsLoadingText("Error loading facts! Reload page.")
            }
            else {
                setFacts(facts)
                setIsLoading(false)
            }
        }
        getFacts();
    }, [currentCategory])

  return (
      <>
          <Header showForm={showForm} setShowForm={setShowForm}/>

          {showForm ? <NewFactForm setFacts={setFacts} setShowForm={setShowForm}/> : null}

          <main className={"main"}>
              <CategoryFilter setCurrentCategory={setCurrentCategory} />
              {isLoading ? <Loader isLoadingText={isLoadingText}/> : <FactList facts={facts}/>}
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
function NewFactForm({setFacts, setShowForm}){

    const [text, setText] = useState("");
    const [source, setSource] = useState("");
    const [category, setCategory] = useState("");
    const textLength = text.length;

    function handleFormSubmit(e){
        e.preventDefault();
        console.log(text, source, category)
        if(text && isValidUrl(source) && category && textLength <= 200 ){
            const newFact = {
                id: initialFacts.length + 1,
                text,
                source,
                category,
                votesInteresting: 0,
                votesMindBlowing: 0,
                votesFalse: 0,
                createdAt: new Date().getFullYear(),
            }
            setFacts((facts) => [newFact, ...facts]);

            //reset form
            setText("");
            setCategory("");
            setSource("");
            setShowForm(false);
        }
    }

    return <form className={"fact-form"} onSubmit={handleFormSubmit}>
        <input type="text" value={text}
               placeholder="Share a fact with the world..."
               onChange={(e) => setText(e.target.value)}/>
        <span>{200 - textLength}</span>
        <input type="text"
               placeholder="Trustworthy source..."
               value={source}
               onChange={(e) => setSource(e.target.value)}/>
        <select value={category}
                onChange={(e)=>setCategory(e.target.value)}>
            <option value="">Choose category:</option>
            {CATEGORIES.map((category) => (
                <option key={category.name} value={category.name}>{category.name.toUpperCase()}</option>
            ))}
        </select>
        <button className="btn btn-large">Post</button>
    </form>
}
function CategoryFilter({setCurrentCategory}){
  return <aside>
    <ul>
        <li className={"category"}>
            <button
                className={"btn btn-all-categories"} onClick={() => {
                    console.log('category is all')
                setCurrentCategory("all")
            }}>
                All
            </button>
        </li>
        { CATEGORIES.map((category) => (
            <li key={category.name}
                className={"category"}>
                <button
                    className={"btn btn-category"}
                    style={{"backgroundColor": category.color}} onClick={() => {
                    setCurrentCategory(category.name)
                }}>
                    {category.name}
                </button>
            </li>
        ))}
    </ul>
  </aside>
}
function FactList({facts}){
    return <section>
        {
            Array.isArray(facts) && facts.length >= 1 ? <ul className={"facts-list"}>
                {
                    facts.map((fact) => (
                        <Fact factObject={fact} key={fact.id}/>
                    ))
                }
            </ul> :
                <Loader isLoadingText={"No facts in selected category. Add new facts!"}/>
        }

    </section>
}
function Fact(props){
    const fact = props.factObject;
    const cat = CATEGORIES.filter(x => x.name === fact.category);

    return <li className={"fact"}>
        <p>{fact.text}
            <a href={fact.source}
               className={"source"}
               target={"_blank"} rel="noreferrer">
                (Source)
            </a>
        </p>
        <span className={"tag"} style={{backgroundColor: cat.length >= 1 ? cat[0].color : "#3b82f6"}}>
                            {fact.category}
                        </span>
        <div className={"vote-buttons"}>
            <button>👍 {fact.votesInteresting}</button>
            <button>🤯 {fact.votesMindBlowing}</button>
            <button>⛔️ {fact.votesFalse}</button>
        </div>
    </li>
}

function Loader({isLoadingText}){
    return <p className={isLoadingText === "Loading..."? "loading" : "loadingError"}>
        {isLoadingText}</p>
}
export default App;
