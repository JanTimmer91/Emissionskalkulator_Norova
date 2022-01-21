import React, {useState} from 'react';
import Emissionskalkulator from "./views/Emissionskalkulator";

import {BrowserRouter} from "react-router-dom";

function App() {

    return (
        <BrowserRouter>
            <Emissionskalkulator/>
        </BrowserRouter>
    );
}

export default App;
