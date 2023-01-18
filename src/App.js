import './style.css'
import {useEffect, useState} from "react";
import supabase from "./supabase";

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
   const [facts, setFacts] = useState([]);

   useEffect(() => {
      async function fetchFacts() {
         const { data: facts, error } = await supabase
             .from('facts')
             .select('*')
            // console.log(facts)
         setFacts(facts)
      }
        fetchFacts()
   }, []);

   return (
       <>
          {/* Header */}
          <Header showForm={showForm} setShowForm={setShowForm}/>
          {showForm ? <NewFactForm setFacts={setFacts} setShowForm={setShowForm}/>  : null  }
          {/*<NewFactForm/>*/}
          <main className={"main"}>
             <CategoryFilter/>
             <FactList facts={facts}/>
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


function isValidHttpUrl(str) {
   let url;

   try {
      url = new URL(str);
   } catch (_) {
      return false;
   }

   return url.protocol === "http:" || url.protocol === "https:";
}

function NewFactForm({setFacts, setShowForm}) {
   const [text, setText] = useState("");
   const [source, setSource] = useState("https://exemple.com");
   const [category, setCategory] = useState("");
   const textLength = text.length;

   function handleSubmit(e) {
      // 1- Prevent the page from reloading
      e.preventDefault();
      console.log(text, source, category);
      // 2- Check if data is valid, if so create a new fact
      if (text && isValidHttpUrl(source) && category && textLength <= 200) {
         console.log("Valid data created");
         // 3- Create a new fact object
         const newFact = {
            id: Math.round(Math.random() * 1000000000000),
            // text: text,
            text,
            source,
            category,
            votesInteresting: 0,
            votesMindblowing: 0,
            votesFalse: 0,
            createdIn: new Date().getFullYear(),
         };
         // 4- Add the new fact to the list of facts
         setFacts((facts) => [newFact, ...facts]);
         // 5- Reset the form
         setText("");
         setSource("");
         setCategory("");
         // 6- Close the form
            setShowForm(false);

      }
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

function FactList({facts}) {
   // Temporary data
   // const facts = initialFacts;
   // const [facts, setFacts] = useState(initialFacts); carry it to the App component (parent)


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
