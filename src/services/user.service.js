import axios from 'axios';
import {BehaviorSubject} from 'rxjs';

const API_URL = 'http://localhost:8080/api/user/';
const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));
const currentUserBasicData = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser_allData')));
const currentUserVisualizationData = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser_visualizationData')));

class UserService {

    get currentUser(){
        return currentUserSubject.asObservable();
    }

    get currentUserValue() {
        return currentUserSubject.value;
    }

    get currentUserBasicData(){
        return currentUserBasicData.asObservable();
    }
    get currentUserBasicDataValue(){
        return currentUserBasicData.value;
    }

    get currentUserVisualizationData(){
        return currentUserVisualizationData.asObservable();
    }
    get currentUserVisualizationDataValue(){
        return currentUserVisualizationData.value;
    }

    login(user){
        //console.log('Basic ' + btoa(user.username + ':' + user.password))
        //btoa: Basic64 encryption
        const headers = {
            authorization: 'Basic ' + btoa(user.username + ':' + user.password)
        };

        return axios.get(API_URL + 'login', {headers: headers}).then(
            response => {
                //console.log("login -- response: " + response.data.toString());
                localStorage.setItem('currentUser', JSON.stringify(response.data));
                currentUserSubject.next(response.data);
            }
        );
    }

    userBasicData(user){
        //console.log(user)
        const headers = {
            authorization: 'Basic ' + btoa(user.username + ':' + user.password)
        };
        return axios.get(API_URL + 'basicdata?username='+user.username, {headers: headers}).then(
            response => {
                //console.log("userData -- response: " + JSON.stringify(response.data));
                localStorage.setItem('currentUserBasicData', JSON.stringify(response.data));
                currentUserBasicData.next(response.data);
                //console.log(currentUserBasicData)

            }
        );
    }

    userVisualizationData(user,validationType){
        // const axios = require('axios');
        //
        // async function makeRequest() {
        //     const config = {
        //         method: 'get',
        //         url: ''+API_URL + 'visualization',
        //         params: {username: user.username, type: validationType,
        //                 },
        //         headers: { authorization: 'Basic ' + btoa(user.username + ':' + user.password) }
        //     }
        //     let res = await axios(config)
        //
        //     console.log(res.request._header);
        // }
        //
        // makeRequest();

        console.log('Basic ' + btoa(user.username + ':' + user.password))
        const method = 'get'
        const url = API_URL + 'visualization';
        const params = {username: user.username, type: validationType};
        const headers = {
            authorization: 'Basic ' + btoa(user.username + ':' + user.password)
        };

        async function makeRequest(){
            const config ={
                method: method,
                url: url,
                params: params,
                headers: headers
            }

            let res = await axios(config).then( response => {
                    console.log("userVisData -- response: " + JSON.stringify(response.data));
                    localStorage.setItem('currentUser_visualizationData', JSON.stringify(response.data));
                    currentUserVisualizationData.next(response.data);
                    //console.log(currentUserBasicData));
                }
            );
            console.log(res.data);
        }

        makeRequest().then(r => console.log (r));

        // return axios.get(API_URL+'visualization?username='+ user.username + '?type=' + validationType, {headers: headers}).then(
        // return axios.get(API_URL+'visualization', {
        //     params: {
        //         username: user.username,
        //         type: validationType,
        //     }
        // }
        // , {headers: headers}).then(
        //     response => {
        //         console.log("userVisData -- response: " + JSON.stringify(response.data));
        //         localStorage.setItem('currentUser_visualizationData', JSON.stringify(response.data));
        //         currentUserVisualizationData.next(response.data);
        //         //console.log(currentUserBasicData)
        //
        //     }
        // );
    }



    logOut(){
        return axios.post(API_URL + "logout", {}).then(
            ()=> {
                localStorage.removeItem('currentUser');
                localStorage.removeItem('currentUserBasicData');
                localStorage.removeItem('currentUser_visualizationData');
                currentUserSubject.next(null);
            }
        );
    }

    register(user) {
        return axios.post(API_URL + 'registration', JSON.stringify(user),
            {headers: {'Content-Type':'application/json; charset=UTF-8'}});
    }


}

export default new UserService();