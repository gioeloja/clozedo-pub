import logo from './unsigned_in_components/assets/logo.svg';
//import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Routes } from 'react-router-dom';
import Pricing from './unsigned_in_components/pricing_page/Pricing'
import SideNavBar from './signed_in_components/dashboard_components/SideNavBar';
import UserSettings from './signed_in_components/settings_components/userSettings'
import SalesDataSetup from './signed_in_components/settings_components/SalesDataSetup'

function App() {

  const [reqStatus, setStatus] = useState("NONE")

   useEffect(() =>  {
    }, [])

  return (
    <BrowserRouter>

  <Routes>
        <Route path ="/" element={<DefPage  status={reqStatus}/>}/>
        <Route path="/home" element={<HomePage/>}/>
        <Route path="/about" element={<AboutPage/>}/>
        <Route path="/pricing" element={<Pricing/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/settings" element ={<Settings/>}/>
        <Route path="/settings/setup" element ={<SettingsSetup/>}/>
      </Routes>



    </BrowserRouter>
  );
}

export default App;


function DefPage(props) {


  async function testFunction()
  {
    let res = await fetch('http://34.174.29.218:3001')
    .then(response => response.text())
    .then(data => console.log(data))
    
    
  }


  return (
    <div>

      {/* <LandingPage /> */}
      <SideNavBar/>
    </div>
)}

function ClickButton(props) {


  return (
    <div>
      <button onClick={props.handleClick}>test</button>
    </div>
  );
}

function HomePage() {
  return (
      //<PoshyPage />
      <div></div>
  );
}

function PricingPage() {
  return (
    <div><Pricing/></div>
  )
}

function AboutPage() {
  return (
    <div>
      <h1>About Page</h1>
      <p>This is the about page!</p>
      <ul><Link to="/">Default</Link></ul>
      <ul><Link to="/home">Home</Link></ul>
          <ul><Link to="/about">About</Link></ul>
    </div>
  );
}

function Dashboard(props) {
  return (
    <div className='fixed inset-0 overflow-hidden'>
      <SideNavBar/>
  </div>
  );
}

function Settings() {
  return (
    <div>
      <UserSettings/>
  </div>
  );
}

function SettingsSetup() {
  return (
    <div>
      <SalesDataSetup/>
    </div>
  );
}
