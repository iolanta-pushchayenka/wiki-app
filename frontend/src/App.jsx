import React, { useState } from "react";
import ArticleList from "./components/ArticleList";
import ArticleView from "./components/ArticleView";
import ArticleForm from "./components/ArticleForm";


function App() {
  const [selectedId, setSelectedId] = useState(null);
  const [reload, setReload] = useState(false)
  
return (
  <> 
  {!selectedId ? (
        <>
        <h2>Create your article &#128203;</h2>
          <ArticleForm onCreated={() => setReload(prev => !prev)} />
          <ArticleList onSelect={setSelectedId} key={reload} />
        </>
      ) : (
        <ArticleView id={selectedId} onBack={() => setSelectedId(null)} />
      )} 
  </>
)
 }

export default App;

