import axios from 'axios';
import {BehaviorSubject} from 'rxjs';

const API_URL = 'http://localhost:8080/api/user/';

const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));
// eslint-disable-next-line no-unused-vars
const currentUserBasicData = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser_allData')));
// eslint-disable-next-line no-unused-vars
const currentUserVisualizationData = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser_visualizationData')));

class AuthService {

    // login(user) {
    //     return axios
    //         .post(API_URL + 'signin', {
    //             username: user.username,
    //             password: user.password
    //         })
    //         .then(response => {
    //             if (response.data.accessToken) {
    //                 localStorage.setItem('user', JSON.stringify(response.data));
    //             }
    //
    //             return response.data;
    //         });
    // }

    login(user){
        //console.log('Basic ' + btoa(user.username + ':' + user.password))
        //btoa: Basic64 encryption
        const headers = {
            authorization: 'Basic ' + btoa(user.username + ':' + user.password)
        };

        return axios.get(API_URL + 'login', {headers: headers})
            .then(response => {
                if (response.data.accessToken) {
                    //console.log("login -- response: " + response.data.toString());
                    localStorage.setItem('currentUser', JSON.stringify(response.data));
                    currentUserSubject.next(response.data);
                }
                return response.data;
            }
        );
    }






    logout() {
        localStorage.removeItem('user');
    }

    register(user) {
        return axios.post(API_URL + 'signup', {
            username: user.username,
            email: user.email,
            password: user.password
        });
    }
}

export default new AuthService();