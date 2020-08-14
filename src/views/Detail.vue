<template>
    <div class="container">
        <header class="jumbotron mt-4">
            <p>
                User <strong>{{currentUser.name}}</strong> details are displayed below.
            </p>
            <p>
                User full name  : <strong>{{currentUser.name}}</strong>
            </p>
            <p>
                User login name : <strong>{{currentUser.username}}</strong>
            </p>
            <p>
                User role       : <strong>{{currentUser.role}}</strong>
            </p>
            <p>
                User ID         : <strong>{{userId}}</strong>
            </p>
        </header>
    </div>
</template>
<script>
    export default {
        name: 'detail',
        data() {
            return {
                userId: null,
                currentUser: null
            };
        },
        created() {
            this.currentUser = JSON.parse(localStorage.getItem('detailUser'));
            this.userId = this.$route.params.id;
        }
    }
</script>
<style>
</style>