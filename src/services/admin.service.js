import axios from 'axios';
import {BehaviorSubject} from 'rxjs';
import UserService from './user.service';

const API_URL = 'http://localhost:8080/api/admin/';
const dataByCalledType = new BehaviorSubject(JSON.parse(localStorage.getItem('dataByCalledType')));



class AdminService {
    constructor() {
        UserService.currentUser.subscribe(data => {
            this.headers = {
                'Content-Type':'application/json',
                'authorization':'Bearer ' + (data ? data.token:'')
            };
        });
    }

    get dataByCalledTypeData() {
        return dataByCalledType;
        //return dataByCalledType.asObservable();
    }

    get dataByCalledTypeDataValue() {
        return dataByCalledType.value;
    }

    logOut() {
        return axios.post(API_URL + "logout", {}).then(
            () => {
                //simple user localStorage
                localStorage.removeItem('currentUser');
                localStorage.removeItem('currentUserBasicData');
                localStorage.removeItem('currentUser_visualizationData');
                //admin localStorage
                localStorage.removeItem('detailUser');
                localStorage.removeItem('dataByCalledType');

                dataByCalledType.next(null);
            }
        );
    }


    findAllUsers() {
        return axios.get(API_URL + 'all', {headers: this.headers});
    }


    findAllByType(type) {

        console.log('findAllByType called from admin service by type ' + type)

        return axios({
            method: 'get',
            url: API_URL + 'listbytype',
            params: {
                type: type
            },
            headers: this.headers
        }).then(
            response => {
                //console.log("login -- response: " + response.data.toString());
                localStorage.setItem('dataByCalledType', JSON.stringify(response.data));
                dataByCalledType.next(response.data);
            }
        );
    }
}

export default new AdminService();