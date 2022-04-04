import React, { useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'
import axios from 'axios'
import axiosWithAuth from '../axios'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)


  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => { navigate("/")}
  const redirectToArticles = () => {navigate("/articles")}

  const logout = () => {
    // If a token is in local storage it should be removed:
    window.localStorage?.removeItem('token')
    // A message saying "Goodbye!" should be set in its proper state:
    setMessage("Goodbye!")
    // In any case, redirect back to the login screen, using helper above:
    redirectToLogin()
  }

  const login = ({ username, password }) => {
    // Flush the message state:
    setMessage('') 
    //Turn on the spinner:
    setSpinnerOn(true)
    // Request to send credentials to API to get back token:
    axios.post(loginUrl, {username, password})
      .then(response => {
        // Set the token to local storage in a 'token' key:
        window.localStorage.setItem('token', response.data.token)
        //Put the server success message in its proper state:
        setMessage(response.data.message)
        //Redirect to the Articles screen:
        redirectToArticles()
        //Turn off the spinner:
      })
      .catch(error => {
        setMessage(error.response.data.message)
      })
      .finally(() => {
        setSpinnerOn(false)
      })
  }

  const getArticles = () => {
    // Flush the message state:
    setMessage('')
    //Turn on the spinner:
    setSpinnerOn(true)
    // Launch an authenticated request to the proper endpoint:
    axiosWithAuth().get(articlesUrl)
      .then(response => {
        //Set the articles in their proper state:
        setArticles(response.data.articles)
        // put the server success message in its proper state:
        setMessage(response.data.message)
      })
      .catch(error => {
        // if it's a 401 the token might have gone bad, and we should redirect to login.
        error.response.status === 401 ? redirectToLogin() : setMessage(error.response.data.message)
      })
      .finally(() => {
        // In either case, turn off the spinner:
        setSpinnerOn(false)
      }) 
  }

  const postArticle = article => {
    setSpinnerOn(true)
    axiosWithAuth().post(articlesUrl, article)
      .then(response => {
        setArticles([...articles, response.data.article])
        setMessage(response.data.message)
      })
      .catch(error => {
        error.response.status === 401 ? redirectToLogin() : setMessage(error.response.data.message)
      })
      .finally(() => {
        setSpinnerOn(false)
      })
  }

  const updateArticle = ( article_id, article ) => {
    setSpinnerOn(true)
    axiosWithAuth().put(`${articlesUrl}/${article_id}`, article)
      .then(response => {
        setMessage(response.data.message)
        setArticles(articles.map(art => art.article_id === article_id ? response.data.article : art))
        setCurrentArticleId(null)
      })
      .catch(error => {
        error.response.status === 401 ? redirectToLogin() : setMessage(error.response.data.message)
      })
      .finally(() => {
        setSpinnerOn(false)
      })
  }

  const deleteArticle = article_id => {
    setSpinnerOn(true)
    axiosWithAuth().delete(`${articlesUrl}/${article_id}`)
      .then(response => {
        setArticles(articles.filter(article => article.article_id !== article_id))
        setMessage(response.data.message)
      })
      .catch(error => {
        error.response.status === 401 ? redirectToLogin() : setMessage(error.response.data.message)
      })
      .finally(() => {
        setSpinnerOn(false)
      })
  }

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <React.StrictMode>
      <Spinner on={spinnerOn}/>
      <Message message={message}/>
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login} />} />
          <Route path="articles" element={
            <>
              <ArticleForm 
                currentArticle={articles.find(article => article.article_id === currentArticleId)} 
                postArticle={postArticle} 
                updateArticle={updateArticle} 
                setCurrentArticleId={setCurrentArticleId} 
              />
              <Articles 
                articles={articles} 
                getArticles={getArticles} 
                setCurrentArticleId={setCurrentArticleId} 
                currentArticleId={currentArticleId} 
                deleteArticle={deleteArticle}
              />
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </React.StrictMode>
  )
}


