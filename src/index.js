import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
// import 'rsuite/dist/rsuite.min.css';
import './css/main.css'
import "rsuite/styles/index.less"
import '@mui/material/CssBaseline'
import App from './App';
// import HomeNav from './components/nav';
// import Homepage from './pages/mainpage';
// import Playlist from './pages/playlist';
// import AuthorPage from './pages/author';
// import SongPage from './pages/song';
// import Top100 from './pages/top100';
// import NotFound from './pages/notfound';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path='/*' exact element={<App></App>}>
        </Route>
      </Routes>
    </Router>
  </React.StrictMode>
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
