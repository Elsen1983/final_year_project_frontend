<template>
    <div>
        <nav class="navbar navbar-expand">
            <a href="https://www.xmldation.com/en/" class="navbar-brand">
                <img src="./assets/xmldation.png" width="30" height="30" class="d-inline-block align-top"/>
                XMLdation
            </a>
            <div class="navbar-nav ml-4">
                <li class="nav-item" v-if="isAdmin">
                    <a href="/userslist" class="nav-link">
                        <font-awesome-icon icon="user-shield"/> Users List
                    </a>
                </li>
            </div>
            <div class="navbar-nav mr-auto">
                <li class="nav-item" v-if="isAdmin">
                    <a href="/admindashboard" class="nav-link">
                        <font-awesome-icon icon="user-shield"/> Admin Dashboard
                    </a>
                </li>
            </div>
            <div class="navbar-nav ml-auto" v-if="!currentUser">
                <li class="nav-item">
                    <a href="/register" class="nav-link">
                        <font-awesome-icon icon="user"/> Sign Up
                    </a>
                </li>
                <li class="nav-item">
                    <a href="/login" class="nav-link">
                        <font-awesome-icon icon="sign-in-alt"/> Login
                    </a>
                </li>
            </div>
            <div class="navbar-nav ml-auto" v-if="currentUser">
                <li class="nav-item">
                    <a href="/userdata" class="nav-link">
                        <font-awesome-icon icon="user"/> {{currentUser.name}}
                    </a>
                </li>
                <li class="nav-item">
                    <a v-on:click="logOut" class="nav-link">
                        <b-icon icon="box-arrow-right" variant="warning"></b-icon> <span style="color: white">LogOut</span>
                    </a>
                </li>
            </div>
        </nav>


                <div id="messageArea">
                    <div style="width: 30vw; margin: auto;" v-if="alert.message" :class="alertStyle">
                        {{alert.message}}
                    </div>
                    <router-view></router-view>
                </div>

    </div>
</template>

<script>
    import UserService from './services/user.service';
    import Role from './models/role';

    export default {
        data() {
            return {
                currentUser: null,
                currentUserBasicData: [],
                currentUserVisualizationData: []
            };
        },
        created() {
            UserService.currentUser.subscribe(data => {
                this.currentUser = data;
            });
            UserService.currentUserBasicData.subscribe(data => {
                this.currentUserBasicData = data;
            });

            UserService.currentUserVisualizationData.subscribe(data => {
                this.currentUserVisualizationData = data;
            });


        },
        computed: {
            isAdmin() {
                return this.currentUser && this.currentUser.role === Role.ADMIN;
            },
            alert() {
                return this.$store.state;
            },
            alertStyle() {
                return this.$store.getters.alertStyle;
            }
        },
        methods: {
            logOut() {
                UserService.logOut().then(() => {
                    this.$router.push('/login');
                });
            },
            clearAlert() {
                this.$store.dispatch('clear');
            }
        },
        watch: {
            $route(to, from) {
                //You can get warning (error: 'from' is defined but never used), if you don't use parameters;
                console.log(to + " -> " + from);
                this.clearAlert();
            }
        }

    }
</script>
<style>

    body{
        margin: auto;
        padding: 0;
        height: 100vh;
        width: 100vw;
        /*min-width: 1280px;*/
        /*min-height: 720px;*/
        /* min-height: 40vw; */
        background: url(assets/xmldation_background.png) bottom 0 right 0 no-repeat #4D4D4F;
        background-size: auto 75%;
        color: black;
        overflow: hidden;
    }

    .navbar{
        background-color: rgb(43,60,67);
    }

    a {
        color: white;
        text-decoration: none;
    }

    a:hover
    {
        color:#00A0C6;
        text-decoration:none;
        cursor:pointer;
    }

    #messageArea{
        /*width: 30vw;*/
        /*margin: auto;*/
    }
</style>
