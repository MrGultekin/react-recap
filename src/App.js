import './style.css'
import {useState} from "react";

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
          {/* Header */}
          <Header showForm={showForm} setShowForm={setShowForm}/>
          {showForm ? <NewFactForm/> : null}
          {/*<NewFactForm/>*/}
          <main className={"main"}>
             <CategoryFilter/>
             <FactList/>
          </main>

       </>
   );
}

function Header({showForm, setShowForm}) {
   const appTitle = "What to code today?";
   return (
       <header className="header">
          <div className="logo">
             <img
                 src="logo.png"
                 height="68"
                 width="68"
                 alt="Today I Learned Logo"
             />
             <h1>{appTitle}</h1>
          </div>

          <button className="btn btn-large btn-open"
                  onClick={() => setShowForm((show) => !show)}>
             {showForm ? "Close" : "Share a fact"}
          </button>
       </header>
   )
}

const CATEGORIES = [
   {name: "technology", color: "#3b82f6"},
   {name: "science", color: "#16a34a"},
   {name: "finance", color: "#ef4444"},
   {name: "society", color: "#eab308"},
   {name: "entertainment", color: "#db2777"},
   {name: "health", color: "#14b8a6"},
   {name: "history", color: "#f97316"},
   {name: "news", color: "#8b5cf6"},
];


function NewFactForm() {
   const [text, setText] = useState("");
   const [source, setSource] = useState("");
   const [category, setCategory] = useState("");
   const textLength = text.length;

   function handleSubmit(e) {
      e.preventDefault();
      console.log(text, source, category);
   }

   return (
       <form className={"fact-form"} onSubmit={handleSubmit}>
          <input value={text}
                 onChange={(e) => setText(e.target.value)}
                 type="text"
                 placeholder="Share a fact with the world..."/>
          <span>{200 - textLength}</span>
          <input value={source}
                 onChange={(e) => setSource(e.target.value)}
                 type="text"
                 placeholder="Trustworthy source..."/>
          <select value={category}
                  onChange={(e) => setCategory(e.target.value)}
          >
             <option value="">Choose category:</option>
             {CATEGORIES.map((cat) => <option value={cat.name} key={cat.name}>{cat.name.toUpperCase()}</option>)}

             {/*<option value="technology">Technology</option>*/}
             {/*<option value="science">Science</option>*/}
             {/*<option value="finance">Finance</option>*/}
          </select>
          <button className="btn btn-large">Post</button>
       </form>
   );
}


function CategoryFilter() {
   return (
       <aside>
          <ul>
             <li className="category">
                <button className="btn btn-all-categories">All</button>
             </li>

             {CATEGORIES.map((cat) => <li className="category" key={cat.name}>
                <button
                    className="btn btn-category"
                    style={{backgroundColor: cat.color}}
                >
                   {cat.name}
                </button>
             </li>)}

          </ul>
       </aside>
   );
}

function FactList() {
   // Temporary data
   const facts = initialFacts;
   return (
       <section>
          <ul className={"facts-list"}>
             {facts.map((fact) => <Fact fact={fact} key={fact.id}/>)}
          </ul>
          <p>There are {facts.length} facts. Add your own!</p>
       </section>
   );
}

function Fact({fact}) {
   // console.log(props)
   // const {facthObj} = props;
   return (
       <li className="fact">
          <p>
             {fact.text}
             <a
                 className="source"
                 href={fact.source}
                 target="_blank" rel="noreferrer"
             >(Source)</a
             >
          </p>
          <span className="tag"
                style={{backgroundColor: CATEGORIES.find((cat) => cat.name === fact.category).color}}
          >{fact.category}</span
          >
          <div className="vote-buttons">
             <button>👍 {fact.votesInteresting}</button>
             <button>🤯 {fact.votesMindblowing}</button>
             <button>⛔️ {fact.votesFalse}</button>
          </div>
       </li>
   )

}


export default App;
