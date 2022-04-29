<template>
    <div>
        <b-navbar toggleable="lg" type="dark" variant="info" class="p-1">
            <b-navbar-brand href="/" class="m-2">PyMixEth</b-navbar-brand>
            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
            <b-collapse id="nav-collapse" is-nav>
                <b-navbar-nav>
                    <b-nav-item href="/">Home</b-nav-item>
                    <b-nav-item href="/about/">About</b-nav-item>
                    <b-nav-item href="/utilities/">Utilities</b-nav-item>
                </b-navbar-nav>
            </b-collapse>
        </b-navbar>
    </div>    
</template>

<script>
    export default {
        name: 'NavBar'
    }
</script>

<style scoped>

</style>