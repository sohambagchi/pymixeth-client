<template>
    <b-container class="my-4">
        <b-card header-tag="header">
            <template #header>
                <h4 class="mb-0">Private Key to Public Key (PEM)</h4>
            </template>
            <b-card-text>
                <b-form @submit="onSubmitUtil">
                    <b-form-group
                        id="priv-k-2-pub-k-group"
                        label="Private Key: "
                        label-for="priv-k-2-pub-k-input"
                        description="Your Private Key Will Not Be Stored Anywhere"
                        >
                        <b-form-input
                            id="priv-k-2-pub-k-input"
                            v-model="util.priv_k"
                            placeholder="Enter Private Key"
                            type="password"
                            required>
                        </b-form-input>
                    </b-form-group>
                    <b-button type="submit">Submit</b-button>
                </b-form>
            </b-card-text>
        </b-card>
    </b-container>
</template>

<script>
const privateKeyToPublicKey = require('ethereum-private-key-to-public-key')
// const crypto                = require('crypto')
// var KeyEncoder            = require('key-encoder'), keyEncoder = new KeyEncoder('secp256k1')
import KeyEncoder from 'key-encoder'
var keyEncoder = new KeyEncoder('secp256k1')

export default {
    name: 'Utilities',
    data() {
        return {
            util: {
                priv_k: '',
                pub_k: '',
            },
        }
    },
    methods: {
        onSubmitUtil() {
            console.log(this.util.priv_k)

            this.util.pub_k = privateKeyToPublicKey(this.util.priv_k).toString('hex')

            console.log(this.util.pub_k)

            // this.util.pub_k_pem = crypto.createPublicKey({
            //     key: this.util.pub_k,
            //     format: 'der',
            //     type: 'spki',
            // }).export({
            //     type: 'pem',
            //     format: 'pem',
            // })
            
            this.util.pub_k_pem = keyEncoder.encodePublic(this.util.pub_k, 'raw', 'pem')

            console.log(this.util.pub_k_pem)

        }
    }
}
</script>

<style scoped>

</style>