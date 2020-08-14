import axios from 'axios';
import {BehaviorSubject} from 'rxjs';

const API_URL = 'http://localhost:8080/api/user/';
const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));
const currentUserBasicData = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser_allData')));
const currentUserVisualizationData = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser_visualizationData')));

class UserService {

    get currentUser() {
        return currentUserSubject.asObservable();
    }

    get currentUserValue() {
        return currentUserSubject.value;
    }

    get currentUserBasicData() {
        return currentUserBasicData.asObservable();
    }

    get currentUserBasicDataValue() {
        return currentUserBasicData.value;
    }

    get currentUserVisualizationData() {
        return currentUserVisualizationData.asObservable();
    }

    get currentUserVisualizationDataValue() {
        return currentUserVisualizationData.value;
    }

    login(user) {
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

    logOut() {
        return axios.post(API_URL + "logout", {}).then(
            () => {
                //simple user localStorage
                localStorage.removeItem('currentUser');
                localStorage.removeItem('currentUserBasicData');
                localStorage.removeItem('currentUser_visualizationData');
                //admin localStorage
                localStorage.removeItem('dataByCalledType');

                currentUserSubject.next(null);
                currentUserBasicData.next(null);
                currentUserVisualizationData.next(null);
            }
        );
    }

    register(user) {
        return axios.post(API_URL + 'registration', JSON.stringify(user),
            {headers: {'Content-Type': 'application/json; charset=UTF-8'}});
    }

    userBasicData(user) {
        //console.log(user)
        const headers = {
            authorization: 'Bearer ' + user.token
        };

        return axios({
            method: 'get',
            url: API_URL + 'basicdata',
            params: {
                username: user.username
            },
            headers: headers
        }).then(
            response => {
                localStorage.setItem('currentUserBasicData', JSON.stringify(response.data));
                currentUserBasicData.next(response.data);

            }
        );


    }

    userVisualizationData(user, validationType) {

        const headers = {
            authorization: 'Bearer ' + user.token
        };

        return axios({ method: 'get', url: API_URL + 'visualization',
                        params: { username: user.username, type: validationType,},
                        headers: headers
        }).then(
            response => {
                localStorage.setItem('currentUser_visualizationData', JSON.stringify(response.data));
                currentUserVisualizationData.next(response.data);
            }
        );
    }


}

export default new UserService();