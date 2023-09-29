import axios from 'axios'

const service="http://gsheng.does-it.net:8081/flappy-bird/";

export class ScoreRepo {
    // using axios
    static getTopRecords(count, onResp) {
        const url = service + "topN?n=" + count;
        axios.get(url).then(resp => {
            console.log(resp.data);
            onResp(resp.data);
        });
    }

    static getPlayerRecord(name, onResp){
        const url = service + "player?name=" + name;
        axios.get(url).then(resp => {
            console.log(resp.data);
            onResp(resp.data);
        });
    }

    static savePlayerRecord(playerRecord, onResp) {
        const url = service + "update";
        axios.post(url, playerRecord)
        .then((resp) => {
            console.log(resp.data);
            onResp(resp.data);            
        });
    }

    // using George's Way
    // static request(suffix, type, data = undefined, onResp = undefined){
    //     const call = new XMLHttpRequest();
    //     call.open(type, service + "" + suffix);
    //     call.setRequestHeader('Content-Type', 'application/json');
    //     debugger
    //     if(data !== undefined){
    //         call.send(data);
    //     }
    //     else{
    //         call.send();
    //     }
    //     if(onResp !== undefined){
    //         call.onResp = () => {
    //             onResp(call);
    //         };
    //     }
    // }

    // static getTopRecords(count, onResp){
    //     this.request("topN", "GET", count, (e) => {
    //         let reply = JSON.parse(e.response);
    //         onResp(reply);
    //         console.log(reply);
    //     });
    // }

    // static getPlayerRecord(playerName, onResp){
    //     this.request("player", "GET", playerName, (e) => {
    //         let reply = JSON.parse(e.response);
    //         onResp(reply);                
    //         console.log(reply);
    //     });
    // }

    // static savePlayerRecord(playerRecord, onResp) {
    //     let data = JSON.stringify(playerRecord);
    //     this.request("save", "POST", data, (e) => {
    //         let reply = JSON.parse(e.response);
    //         onResp(reply);
    //         console.log(reply);
    //     })
    // }

    // for local testing
    static scoreRepo =  [
        { name: "Bob", bestScore: 80, rank: 1, recordTime: "2023-07-01 11:30:33" },
        { name: "George", bestScore: 50, rank: 2, recordTime: "2023-04-01 11:50:33" },
        { name: "Codey", bestScore: 40, rank: 3, recordTime: "2023-03-01 07:39:13" },
        { name: "Mia", bestScore: 30, rank: 4, recordTime: "2023-05-01 15:30:23" },
        { name: "MaoMao", bestScore: 3, rank: 5, recordTime: "2023-01-01 10:25:18" }
    ];

    static getTopRecords2(count, updateFunction){
        let reply = this.scoreRepo.filter(player => player.rank <= count);
        updateFunction(reply);
        console.log(reply);
    }

    static getPlayerRecord2(player, updateFunction){
        let reply = this.scoreRepo.filter(score => score.name === player);
        updateFunction(reply.length > 0 ? reply[0] : null);
        console.log(reply.length > 0 ? reply[0] : "null");
    }

    static savePlayerRecord2(playerRecord) {

    }



}
