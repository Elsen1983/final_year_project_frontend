<template>
    <div class="col-md-12">
        <div id="loginContainer" class="card card-container">
            <img id="profile-img" src="//ssl.gstatic.com/accounts/ui/avatar_2x.png" class="profile-img-card"/>
            <form name="form" @submit.prevent="handleLogin">
                <div class="form-group">
                    <label>Username</label>
                    <input type="text" class="form-control"
                           name="username" v-model="user.username"
                           v-validate="'required'"/>
                    <div class="alert alert-danger" role="alert"
                         v-if="this.errors.has('username')">
                        Username is required.
                    </div>
                </div>
                <div class="form-group">
                    <label>Password</label>
                    <input type="password" class="form-control"
                           name="password" v-model="user.password"
                           v-validate="'required'"/>
                    <div class="alert alert-danger" role="alert"
                         v-if="this.errors.has('password')">
                        Password is required.
                    </div>
                </div>
                <div class="form-group">
                    <button class="btn btn-primary btn-block"
                            :disabled="loading">
                    <span class="spinner-border spinner-border-sm"
                          v-show="loading"></span>
                        <span>Login</span>
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>
<script>
    import UserService from '../services/user.service';
    import User from '../models/user';
    export default {
        name: 'login',
        data() {
            return {
                user: new User('',''),
                loading: false,
            };
        },
        mounted() {
            if(UserService.currentUserValue) {
                this.$router.push('/userdata');
            }
        },
        methods: {
            handleLogin() {
                this.loading = true;
                this.$validator.validateAll();
                if(this.errors.any()) {
                    this.loading = false;
                    return;
                }

                UserService.login(this.user).then(
                    // eslint-disable-next-line no-unused-vars
                    data => {
                        //You can get warning (error: 'data' is defined but never used;), if you don't use parameters;
                        console.log(data);
                        this.$router.push('/userdata');
                        },
                    error => {
                        console.log(error);
                        this.$store.dispatch('error', 'Username or password is not valid.');
                        this.loading = false;
                    }
                );


            }
        }
    }
</script>
<style>
    label {
        display: block;
        margin-top: 10px;
    }

    #loginContainer{
        border: 3px solid black;
        -webkit-box-shadow: 9px 10px 15px 0px rgba(77,75,77,0.66);
        -moz-box-shadow: 9px 10px 15px 0px rgba(77,75,77,0.66);
        box-shadow: 9px 10px 15px 0px rgba(77,75,77,0.66);
    }

    .card-container.card {
        max-width: 350px !important;
        padding: 40px 40px;
    }
    .card {
        background-color: #f7f7f7;
        /* just in case there no content*/
        padding: 20px 25px 30px;
        margin: 50px auto 25px;
        /* shadows and rounded borders */
        -moz-border-radius: 2px;
        -webkit-border-radius: 2px;
        border-radius: 2px;
        -moz-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
        -webkit-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
        box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
    }
    .profile-img-card {
        width: 96px;
        height: 96px;
        margin: 0 auto 10px;
        display: block;
        -moz-border-radius: 50%;
        -webkit-border-radius: 50%;
        border-radius: 50%;
    }
</style>