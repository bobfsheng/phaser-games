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

    function getTopRecords() {
        ScoreRepo.getTopRecords(topCount, (recordsFromDb) => {
            setTopRecords(recordsFromDb);            
        });
    }

    function getPlayerRecord(player) {
        ScoreRepo.getPlayerRecord(player, (recordFromDb) => {
            setPlayerRecord(recordFromDb ? recordFromDb : {name: player, bestScore: 0, rank: 6, recordTime: new Date().toISOString()});
        });
    }

    useEffect(() => {
        getTopRecords();
        getPlayerRecord("MaoMao");        
    }, []);

    function openScoreModal() {
        setScoreModalIsOpen(true);
        getTopRecords();
    }

    function closeScoreModal() {        
        setScoreModalIsOpen(false);
    }
    
    function openLoginModal() {
        setLoginModalIsOpen(true);
    }

    function closeLoginModal() {
        setLoginModalIsOpen(false);
    }

    function applyLoginModal(event) {
        event.preventDefault();
        setLoginModalIsOpen(false);
        const loginUser = event.target.loginUser.value;
        const topRecordCount = event.target.topCount.value;
        if (loginUser !== playerRecord.name) {
            getPlayerRecord(loginUser);            
        }
        if (topRecordCount !== topCount) {
            setTopCount(topRecordCount);            
        }
    }

    return (
        <div id="App">
            <button onClick={openScoreModal}>Top {topCount} Players</button>&nbsp;&nbsp;&nbsp;
            <button onClick={openLoginModal}>Settings</button>&nbsp;&nbsp;&nbsp;&nbsp;
            <label>({playerRecord.name}, best score <b>{playerRecord.bestScore}</b> ranked <b>#{playerRecord.rank}</b> @{playerRecord.recordTime})</label>
            <br/><br/>
            <Modal isOpen={scoreModalIsOpen} contentLabel="Score Modal" >
                <h1>Top {topCount} Player Records</h1>
                <ol>{ topRecords.map(record => {
                    return <div key={record.name}><li><b>{record.name}</b> -------------- {record.bestScore}</li></div>
                })}</ol> 
                <button onClick={closeScoreModal}>Close</button>              
            </Modal>
            <Modal isOpen={loginModalIsOpen} contentLabel="Login Modal">
                <form onSubmit={applyLoginModal}>
                    <label>Play As User:&nbsp;</label>
                    <input id="loginUser" type='text' placeholder={playerRecord.name} defaultValue={playerRecord.name} /><br/><br />
                    <label># of Top Player to Show:&nbsp;</label>
                    <input id="topCount" type='text' placeholder={topCount} defaultValue={topCount} /><br/><br />
                    <button>OK</button>                
                    <button onClick={closeLoginModal}>Cancel</button>                
                </form>
            </Modal>
        </div>
    );

}

export default App;