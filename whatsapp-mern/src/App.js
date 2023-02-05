import React,{ useEffect,useState } from "react";
import "./App.css";
import Sidebar from "./Sidebar";
import Chat from "./Chat";
import Pusher from "pusher-js";
import axios from "./axios.js";

function App() {
  const [messages,setMessages]=useState([]);
  useEffect(()=>{
    axios.get('/messages/sync').then(resposne=>{
      setMessages(resposne.data);
    })
  },[]);
  useEffect(()=>{
    const pusher = new Pusher('2d032d72406beaa3b0cf', {
      cluster: 'ap2'
    });

    const channel = pusher.subscribe('messages');
    channel.bind('inserted', (newMessage)=> {
      setMessages((messages)=>[...messages,newMessage]);
    });
    return ()=>{
      channel.unbind_all();
      channel.unsubscribe();
    };
  },[messages]);
  console.log(messages);
  return (
    <div className="app">
      <div className="app__body">
        <Sidebar />
        <Chat messages={messages}/>
      </div>
    </div>
  );
}

export default App;
