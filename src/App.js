import React from "react";
import HomeNav from "./components/nav";
import Homepage from "./pages/mainpage";
import PlaylistPage from "./pages/playlist";
import ArtistPage from "./pages/artist";
import SongPage from "./pages/song";
import Top100 from "./pages/top100";
import NotFound from "./pages/notfound";
import { Routes, Route} from 'react-router-dom';
import BlogEditor from "./pages/blogEditor";
import BlogPage from "./pages/blogPages";
import SongSearchPage from "./pages/songSearch";
import ArtistSearchPage from "./pages/artistSearch";
import './css/media.css'
import PlaylistHomepage from "./pages/playlistHomepage";
// import PlaylistPersonalPage from "./pages/playlistPersonal";
import PlaylistOneSong from "./pages/playlistOneSong";



function App() {
  return (
    <React.Fragment>
      <HomeNav></HomeNav>
      <Routes>
        <Route path='/' element={<Homepage></Homepage>}></Route>
        <Route path='/playlist'>
          <Route path="/playlist" exact element={<PlaylistHomepage></PlaylistHomepage>}></Route>
          <Route path=':playlistId/:playlistIndex?' element={<PlaylistPage></PlaylistPage>}></Route>
          <Route path="/playlist/song/videoId/:videoId" element={<PlaylistOneSong></PlaylistOneSong>}></Route>
        </Route>
        <Route path='/artist'>
          <Route path="/artist" element={<ArtistSearchPage></ArtistSearchPage>}></Route>
          <Route path=":artistName/:artistId?" element={<ArtistPage></ArtistPage>}></Route>
        </Route>
        <Route path='/song'>
          <Route path="/song" element={<SongSearchPage></SongSearchPage>}></Route>
          <Route path="/song/videoId/:videoId" element={<SongSearchPage></SongSearchPage>}></Route>
          <Route path=":songName/:authorName" element={<SongPage></SongPage>}></Route>
        </Route>
        <Route path='/top100' element={<Top100></Top100>}></Route>
        <Route path="/admin" element={<BlogEditor></BlogEditor>}></Route>
        <Route path="/blog/:topic" element={<BlogPage></BlogPage>}></Route>
        <Route path='/*' element={<NotFound></NotFound>}></Route>
      </Routes>
    </React.Fragment>
  );
}

export default App;
