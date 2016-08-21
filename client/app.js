import React from "react"
import {render} from "react-dom"
import Layout from "./components/layout.js"
import sio from "socket.io-client"

let socket = sio();

render(<Layout socket={socket} />, document.getElementById("root"));
