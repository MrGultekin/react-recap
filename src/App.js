import './style.css'

function App() {
    return (
        <>
            {/* Header */}
            <header className="header">
                <div className="logo">
                    <img
                        src="logo.png"
                        height="68"
                        width="68"
                        alt="Today I Learned Logo"
                    />
                    <h1>Today I Learned</h1>
                </div>

                <button className="btn btn-large btn-open">Share a fact</button>
            </header>

            <NewFactForm/>
            <main className={"main"}>
                <CategoryFilter/>
                <FactList/>
            </main>

        </>
    );
}

function NewFactForm() {
    return (
        <form className={"fact-form"}>
            New Fact Form
        </form>
    );
}

function CategoryFilter() {
    return (
        <aside>
            Categories
        </aside>
    );
}

function FactList() {
    return (
        <section>
            FactList
        </section>
    );
}

export default App;
