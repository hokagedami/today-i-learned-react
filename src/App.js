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
    const [isUploadingText, setIsUploadingText] = useState(false);
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

          {showForm ? <NewFactForm setFacts={setFacts}
                                   setShowForm={setShowForm}
                                   isUploadingText={isUploadingText}
                                   setIsUploadingText={setIsUploadingText}/> : null}

          <main className={"main"}>
              <CategoryFilter setCurrentCategory={setCurrentCategory} />
              {isLoading ? <Loader isLoadingText={isLoadingText}/>
                  : <FactList facts={facts} setFacts={setFacts}/>}
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
function NewFactForm({setFacts, setShowForm, isUploadingText, setIsUploadingText}){

    const [text, setText] = useState("");
    const [source, setSource] = useState("");
    const [category, setCategory] = useState("");
    const textLength = text.length;

    async function handleFormSubmit(e){
        e.preventDefault();
        setIsUploadingText(true);
        if(text && isValidUrl(source) && category && textLength <= 200 ){
            const { data:newFact, error } = await supabase
                .from('facts')
                .insert([
                    { text, source, category },
                ])
                .select('*');

            if(error){
                alert("Error saving fact. Try again please.")
            }
            else {
                setFacts((facts) => newFact.concat(facts));
            }

            //reset form
            setText("");
            setCategory("");
            setSource("");
            setShowForm(false);
            setIsUploadingText(false);
        }
    }

    return <form className={"fact-form"} onSubmit={handleFormSubmit}>
        <input type="text" value={text}
               placeholder="Share a fact with the world..."
               disabled={isUploadingText}
               onChange={(e) => setText(e.target.value)}/>
        <span>{200 - textLength}</span>
        <input type="text"
               placeholder="Trustworthy source..."
               value={source}
               disabled={isUploadingText}
               onChange={(e) => setSource(e.target.value)}/>
        <select value={category}
                onChange={(e)=>setCategory(e.target.value)}
                disabled={isUploadingText}>
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
function FactList({facts, setFacts}){
    return <section>
        {
            Array.isArray(facts) && facts.length >= 1 ? <ul className={"facts-list"}>
                {
                    facts.map((fact) => (
                        <Fact fact={fact}
                              setFacts={setFacts}
                              key={fact.id} />
                    ))
                }
            </ul> :
                <Loader isLoadingText={"No facts in selected category. Add new facts!"}/>
        }

    </section>
}
function Fact({fact, setFacts}){
    const cat = CATEGORIES.filter(x => x.name === fact.category);

    async function vote(voteColumn){
        const { data:updatedFact, error } = await supabase
            .from('facts')
            .update({ [voteColumn]: fact[voteColumn] + 1 })
            .eq('id', fact.id)
            .select()
        if(error){
            alert("Voting failed. Try again")
        }
        else {

            setFacts((facts) => facts.map((f) => {
                if (f.id === fact.id) {
                    return updatedFact[0];
                }
                else {
                    return f;
                }
            }));
        }
    }

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
            <button onClick={() => vote('votes_interesting')}>
                👍 {fact.votes_interesting }</button>
            <button onClick={() => vote('votes_mind_blowing')}>
                🤯 {fact.votes_mind_blowing }</button>
            <button onClick={() => vote('votes_false')}>
                ⛔️ {fact.votes_false }</button>
        </div>
    </li>
}

function Loader({isLoadingText}){
    return <p className={isLoadingText === "Loading..."? "loading" : "loadingError"}>
        {isLoadingText}</p>
}
export default App;
