import React, { useEffect } from "react";
import Modal from "react-modal";
import { useState } from "react";
import Phaser from 'phaser';
import config from "./GameConfig";
import { ScoreRepo } from "./ScoreRepo";

console.log("in App.jsx")
console.log(config);
let game = new Phaser.Game(config);

function App() {
    const[scoreModalIsOpen, setScoreModalIsOpen] = useState(false);
    const[loginModalIsOpen, setLoginModalIsOpen] = useState(false);
    const[registerModalIsOpen, setRegisterModalIsOpen] = useState(false);
    const[playerName, setPlayerName] = useState();
    const[topRecords, setTopRecords] = useState([]);
    const[playerRecord, setPlayerRecord] = useState({});
    const[topCount, setTopCount] = useState(5);

    function handleScore(score) {
        if (score > playerRecord.bestScore) {
            console.log("Congrats on best score: " + score);
            const tmstmpStr = new Date().toISOString()
            const newRecord = {...playerRecord, bestScore: score, recordTime: tmstmpStr};
            setPlayerRecord(newRecord);
            ScoreRepo.savePlayerRecord(newRecord, (savedRecord) => {
                setPlayerRecord(savedRecord);
            });
        }
    }

    game.config = {...game.config, scoreHandler: handleScore};

    function getTopRecords(topN) {
        ScoreRepo.getTopRecords(topN, (recordsFromDb) => {
            setTopRecords(recordsFromDb);            
        });
    }

    function getPlayerRecord(playerName) {
        ScoreRepo.getPlayerRecord(playerName, (recordFromDb) => {
            setPlayerRecord(
                recordFromDb ? recordFromDb 
                            : {name: playerName, 
                                bestScore: 0, 
                                rank: 0, 
                                recordTime: new Date().toISOString()});
        });
    }

    useEffect(() => {
        getTopRecords(topCount);
        getPlayerRecord(playerName);        
    }, []);

    // top player modal
    function openScoreModal() {
        setScoreModalIsOpen(true);
        getTopRecords(topCount);
    }
    function closeScoreModal() {        
        setScoreModalIsOpen(false);
    }
    function onIncreaseCount() {
        setTopCount(topCount + 1);
    }
    function onDecreaseCount() {
        setTopCount(topCount - 1);
    }
    function applyCount() {
        getTopRecords(topCount);
    }

    // login modal
    function openLoginModal() {
        setLoginModalIsOpen(true);
    }
    function closeLoginModal() {
        setLoginModalIsOpen(false);
    }
    function logout() {
        const resp = confirm("Are you sure to logout " + playerName + "?");
        if (resp) {
            setPlayerName(null);
            // setPlayerRecord(null);
        }        
    }
    function applyLoginModal(event) {
        event.preventDefault();
        setLoginModalIsOpen(false);
        const loginUser = event.target.loginUser.value;
        if (loginUser) { // login
            setPlayerName(loginUser);
            getPlayerRecord(loginUser);            
        }
    }
    function formatTmstmp(tmstmp) {
        if (tmstmp) {
            const dotIndex = tmstmp.indexOf(".");
            return tmstmp.substring(0, dotIndex).replace("T", " ");
        }
        return null;
    }

    // register
    function openRegisterodal() {
        setRegisterModalIsOpen(true);
    }
    function closeRegisterModal() {
        setRegisterModalIsOpen(false);
    }
    function applyRegisterModal(event) {
        event.preventDefault();
        const email = event.target.email.value;
        const name = event.target.name.value;
        const password = event.target.password.value;
        const rePassword = event.target.rePassword.value;
        if (password === rePassword) {
            ScoreRepo.register(email, name, password, (playerRecord) => {
                if (playerRecord) {
                    setPlayerName(playerRecord.name);
                    setPlayerRecord(playerRecord);
                    setRegisterModalIsOpen(false);
                }
                else {
                    alert("Failed to register [" + email + "] as [" + name + "]!");
                }
            });
        }
        else {
            alert("Passwords not match!");
        }

    }

    return (
        <div id="App">
            <button onClick={openScoreModal}>Top {topCount} Players</button>&nbsp;&nbsp;&nbsp;
            <button onClick={openRegisterodal}>Register to Create Free Acount</button>&nbsp;&nbsp;&nbsp;
            <button onClick={playerName ? logout : openLoginModal}>
                {playerName ? "Logout" : "Login to Enter the Competition"}
            </button>&nbsp;&nbsp;&nbsp;&nbsp;
            { playerName ?
                <label>(
                    {playerRecord.name}, 
                    best score <b>{playerRecord.bestScore}</b>, 
                    ranked <b>#{playerRecord.bestRank}</b>,  
                    at {formatTmstmp(playerRecord.updateOn)}
                )</label>
                : <label></label>
            }<br/><br/>
            <Modal isOpen={scoreModalIsOpen} contentLabel="Score Modal" >
                <h1>Top {topCount} Player Records</h1>
                <label># of Top Player to Show:&nbsp;</label>
                <input id="topCount"  readOnly type='text' value={topCount} />
                <button onClick={onIncreaseCount}>Inc</button>
                <button onClick={onDecreaseCount}>Dec</button>
                <button onClick={applyCount}>Apply</button>
                <ol>{ topRecords.map(record => {
                    return <div key={record.name}><li><b>{record.name}</b> -------------- {record.bestScore}</li></div>
                })}</ol> <br/>
                <button onClick={closeScoreModal}>Close</button>              
            </Modal>
            <Modal isOpen={registerModalIsOpen} contentLabel="Register Modal">
                <center><h2>Registration</h2>
                <form onSubmit={applyRegisterModal}>
                    <label>Email&nbsp;</label>
                    <input id="email" type='text' /><br/><br />
                    <label>Your Name&nbsp;</label>
                    <input id="name" type='text' /><br/><br />
                    <label>Password&nbsp;</label>
                    <input id="password" type='password' /><br/><br />                    
                    <label>ReType Password&nbsp;</label>
                    <input id="rePassword" type='password' /><br/><br />                    
                    <button>OK</button>                
                    <button onClick={closeRegisterModal}>Cancel</button>                
                </form></center>
            </Modal>
            <Modal isOpen={loginModalIsOpen} contentLabel="Login Modal">
                <center><h2>Login to Enter Competition </h2>
                <form onSubmit={applyLoginModal}>
                    <label>Your Name&nbsp;</label>
                    <input id="loginUser" type='text' placeholder={playerRecord.name} defaultValue={playerRecord.name} /><br/><br />
                    <label>Password&nbsp;</label>
                    <input id="password" type='password' placeholder={playerRecord.pswd} defaultValue={playerRecord.name} /><br/><br />                    
                    <button>OK</button>                
                    <button onClick={closeLoginModal}>Cancel</button>                
                </form></center>
            </Modal>
        </div>
    );

}

export default App;