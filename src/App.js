import './style.css'
import {useEffect, useState} from "react";
import supabase from "./supabase";
// No need mock data anymore
// const initialFacts = [
//    {
//       id: 1,
//       text: "React is being developed by Meta (formerly facebook)",
//       source: "https://opensource.fb.com/",
//       category: "technology",
//       votesInteresting: 24,
//       votesMindblowing: 9,
//       votesFalse: 4,
//       createdIn: 2021,
//    },
//    {
//       id: 2,
//       text: "Millennial dads spend 3 times as much time with their kids than their fathers spent with them. In 1982, 43% of fathers had never changed a diaper. Today, that number is down to 3%",
//       source:
//           "https://www.mother.ly/parenting/millennial-dads-spend-more-time-with-their-kids",
//       category: "society",
//       votesInteresting: 11,
//       votesMindblowing: 2,
//       votesFalse: 0,
//       createdIn: 2019,
//    },
//    {
//       id: 3,
//       text: "Lisbon is the capital of Portugal",
//       source: "https://en.wikipedia.org/wiki/Lisbon",
//       category: "society",
//       votesInteresting: 8,
//       votesMindblowing: 3,
//       votesFalse: 1,
//       createdIn: 2015,
//    },
// ];

function App() {
   const [showForm, setShowForm] = useState(false);
   const [facts, setFacts] = useState([]);
   const [loading, setLoading] = useState(false);
   const [currentCategory, setCurrentCategory] = useState("all");

   useEffect(() => {
      // before we fetch the data, we set the loading state to true
      setLoading(true);

      // fetch the data
      async function fetchFacts() {
         let query = supabase.from("facts").select("*");
         if (currentCategory !== "all") {
            query = query.eq("category", currentCategory);
         }

         const {data: facts, error} = await query
             // .from('facts')
             // .select('*')
             // shows only history facts
             // .eq("category", "history")
             .order('votesInteresting', {ascending: false})
             .limit(100)
         // console.log(facts)
         console.log(error)
         if (!error) {
            setFacts(facts)
         } else {
            alert(error.message)
         }

         setFacts(facts)
         setLoading(false);
      }

      fetchFacts()
   }, [currentCategory]);

   return (
       <>
          {/* Header */}
          <Header showForm={showForm} setShowForm={setShowForm}/>
          {showForm ? <NewFactForm setFacts={setFacts} setShowForm={setShowForm}/> : null}
          {/*<NewFactForm/>*/}
          <main className={"main"}>
             <CategoryFilter setCurrentCategory={setCurrentCategory}/>
             {loading ? <Loading/> : <FactList facts={facts} setFacts={setFacts}/>}
             {/*<FactList facts={facts}/>*/}
          </main>

       </>
   );
}

function Loading() {
   return (
       <p className="message">
          Loading...
       </p>
   );
}

function Header({showForm, setShowForm}) {
   const appTitle = "What to code today?";
   return (
       <header className="header">
          <div className="logo">
             <img
                 src="/logo.png"
                 height="150"
                 width="150"
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
   const [source, setSource] = useState("");
   const [category, setCategory] = useState("");
   const [isUploading, setIsUploading] = useState(false);
   const textLength = text.length;

   async function handleSubmit(e) {
      // 1- Prevent the page from reloading
      e.preventDefault();
      console.log(text, source, category);
      // 2- Check if data is valid, if so create a new fact
      if (text && isValidHttpUrl(source) && category && textLength <= 200) {
         console.log("Valid data created");
         // 3- Create a new fact object
         // const newFact = {
         //    id: Math.round(Math.random() * 1000000000000),
         //    // text: text,
         //    text,
         //    source,
         //    category,
         //    votesInteresting: 0,
         //    votesMindblowing: 0,
         //    votesFalse: 0,
         //    createdIn: new Date().getFullYear(),
         // };

         // 3- Upload the new fact to the database and receive the new fact object
         setIsUploading(true);
         const {data: newFact, error} = await supabase.from("facts").insert([{text, source, category}]).select()
         setIsUploading(false);
         // 4- Add the new fact to the list of facts
         // With [0] fact is added both database and also local state
         if (!error) {
            setFacts((facts) => [newFact[0], ...facts]);
         }
         // setFacts((facts) => [newFact[0], ...facts]);
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
          <input
              disabled={isUploading}
              value={text}
              onChange={(e) => setText(e.target.value)}
              type="text"
              placeholder="Share a fact with the world..."/>
          <span>{200 - textLength}</span>
          <input
              disabled={isUploading}
              value={source}
              onChange={(e) => setSource(e.target.value)}
              type="text"
              placeholder="Trustworthy source..."/>
          <select
              disabled={isUploading}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
          >
             <option value="">Choose category:</option>
             {CATEGORIES.map((cat) => <option value={cat.name} key={cat.name}>{cat.name.toUpperCase()}</option>)}

             {/*<option value="technology">Technology</option>*/}
             {/*<option value="science">Science</option>*/}
             {/*<option value="finance">Finance</option>*/}
          </select>
          <button className="btn btn-large" disabled={isUploading}>Post</button>
       </form>
   );
}


function CategoryFilter({setCurrentCategory}) {
   return (
       <aside>
          <ul>
             <li className="category">
                <button className="btn btn-all-categories"
                        onClick={() => setCurrentCategory("all")}>All
                </button>
             </li>

             {CATEGORIES.map((cat) => <li className="category" key={cat.name}>
                <button
                    className="btn btn-category"
                    style={{backgroundColor: cat.color}}
                    onClick={() => setCurrentCategory(cat.name)}
                >
                   {cat.name}
                </button>
             </li>)}

          </ul>
       </aside>
   );
}

function FactList({facts, setFacts}) {
   // Temporary data
   // const facts = initialFacts;
   // const [facts, setFacts] = useState(initialFacts); carry it to the App component (parent)

   if (facts.length === 0) {
      return (
          <p className="message">No facts to show... Create the first one.</p>
      );
   }

   return (
       <section>
          <ul className={"facts-list"}>
             {facts.map((fact) => <Fact fact={fact} key={fact.id} setFacts={setFacts}/>)}
          </ul>
          <p>There are {facts.length} facts. Add your own!</p>
       </section>
   );
}

function Fact({fact, setFacts}) {
   // console.log(props)
   const [isUpdatingLike, setIsUpdatingLike] = useState(false);
   let isDisputed = fact.votesInteresting + fact.votesMindblowing < fact.votesFalse ;

   async function handleVote(columnName) {
      setIsUpdatingLike(true);
      const {data: updatedFact, error} = await supabase.from("facts")
          .update({[columnName]: fact[columnName] + 1})
          .eq("id", fact.id)
          .select();
      setIsUpdatingLike(false);
      console.log(updatedFact);
      if (!error) {
         setFacts((facts) =>
             facts.map((f) => (f.id === fact.id ? updatedFact[0] : f))
         );
      }
   }

   // const {facthObj} = props;

   return (
       <li className="fact">
          <p>
             {isDisputed ? <span className="disputed">[ ??? DISPUTED ]</span> : null}
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
             <button onClick={() => handleVote
             ("votesInteresting")} disabled={isUpdatingLike}>???? {fact.votesInteresting}</button>
             <button onClick={() => handleVote
             ("votesMindblowing")} disabled={isUpdatingLike}>???? {fact.votesMindblowing}</button>
             <button onClick={() => handleVote
             ("votesFalse")} disabled={isUpdatingLike}>?????? {fact.votesFalse}</button>
          </div>
       </li>
   )

}


export default App;
