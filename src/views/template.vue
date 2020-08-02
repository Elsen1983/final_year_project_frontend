template>
<div class="container">
    <header class="jumbotron">
        <h1 class="display-3">
            <strong>{{currentUser.name}}</strong>
            All User Data:
        </h1>
        <!--            <input type="text" v-model="getData" list="dataAll">-->
        <!--            <datalist id="dataAll">-->
        <!--                <option v-for="getData in jsonData" v-bind:key="getData">{{getData}}</option>-->
        <!--            </datalist>-->

        <!--                        <select v-model="getData">-->
        <!--                            <option value="" disabled>Select type</option>-->
        <!--                            <option v-for="(t, index) in jsonData" :value="t" :key="index">{{t.type}}</option>-->
        <!--                        </select>-->
    </header>
    <a class="btn btn-link log-out" @click="logOut">LogOut</a>
</div>
</template>