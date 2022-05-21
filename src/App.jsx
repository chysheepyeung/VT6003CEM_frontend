import React from 'react';
import './App.css';
import { Card, Button, DatePicker, Layout, Space } from 'antd';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import Home from './components/Home/Home';
import Login from './components/Account/Login';
import Register from './components/Account/Register';
import AppHeader from './components/Header/AppHeader';
import AppFooter from './components/Footer/AppFooter';
import Dog from './components/Dog/DogDetail'
import DogEdit from './components/Dog/DogEdit'
import DogSearch from './components/Dog/DogSearch'
import DogFavourite from './components/Dog/DogFavourite'
import MessageList from './components/Message/MessageList'
import withRoot from './components/withRoot';

const { Header, Content, Footer } = Layout;

function App() {
    return (
        
        <Router>
            <AppHeader />
            <Content>
                <Routes>
                    <Route exact path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dogs/:dogId" element={<Dog />} />
                    <Route path="admin/dogs/:dogId/:type" element={<DogEdit />} />
                    <Route path="admin/dogs/:type" element={<DogEdit />} />
                    <Route path="/search" element={<DogSearch />} />
                    <Route path="/favourite" element={<DogFavourite />} />
                    <Route path="/message" element={<MessageList />} />
                </Routes>
            </Content>
            {/* <AppFooter /> */}
        </Router>
    );
}

export default withRoot(App);