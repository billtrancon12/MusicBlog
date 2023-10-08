import React from "react";
import HomeNav from "./components/nav";
import Homepage from "./pages/mainpage";
import Playlist from "./pages/playlist";
import AuthorPage from "./pages/author";
import SongPage from "./pages/song";
import Top100 from "./pages/top100";
import NotFound from "./pages/notfound";
import { Routes, Route} from 'react-router-dom';
import BlogEditor from "./pages/blogEditor";


function App() {
  return (
    <React.Fragment>
      <HomeNav></HomeNav>
      <Routes>
        <Route path='/' element={<Homepage></Homepage>}></Route>
        <Route path='/playlist' element={<Playlist></Playlist>}></Route>
        <Route path='/author' element={<AuthorPage></AuthorPage>}></Route>
        <Route path='/song' element={<SongPage></SongPage>}></Route>
        <Route path='/top100' element={<Top100></Top100>}></Route>
        <Route path="/admin" element={<BlogEditor></BlogEditor>}></Route>
        <Route path='/*' element={<NotFound></NotFound>}></Route>
      </Routes>
    </React.Fragment>
  );
}

export default App;