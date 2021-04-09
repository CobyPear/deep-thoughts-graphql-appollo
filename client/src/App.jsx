import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'

import { ApolloProvider } from '@apollo/react-hooks'
import ApolloClient from 'apollo-boost'

import Header from './components/Header';
import Footer from './components/Footer';

import Home from './pages/Home.jsx';
import Login from "./pages/Login";
import NoMatch from './pages/NoMatch'
import SingleThought from './pages/SingleThought'
import Profile from './pages/Profile'
import Signup from './pages/Signup'

const client = new ApolloClient({
  uri: 'http://localhost:3001/graphql'
})

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
      <div className='flex-column justify-flex-start min-100-vh'>
        <Header />
        <div className='container'>
          <Route exact path="/" component={Home} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={Signup} />
          <Route exact path="/profile" component={Profile} />
          <Route exact path="/thought" component={SingleThought} />
        </div>
        <Footer />
      </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
