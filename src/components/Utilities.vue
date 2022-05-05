<template>
    <b-container class="my-4">
        <b-row>
            <b-col>
                <b-row>
                    <b-card class="my-2" header-tag="header">
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
                    <b-card class="my-2" v-if="this.pem_pubk.show">
                        <b-card-text>
                            {{ this.util.pub_k }}
                            {{ this.pem_pubk.pub_k_pem }}
                            {{ this.pem_pubk.address }}
                        </b-card-text>
                    </b-card>
                </b-row>
                <b-row>
                    <b-card class="my-2" header-tag="header">
                        <template #header>
                            <h4 class="mb-0">Sign with Shuffled Secret Key</h4>
                        </template>
                        <b-card-text>
                            <b-form @submit="onSubmitSign">
                                <b-form-group
                                    id="sign-secret-group"
                                    label="Private Key: "
                                    label-for="sign-secret-input"
                                    description="Your Private Key Will Not Be Stored Anywhere"
                                    >
                                    <b-form-input
                                        id="sign-secret-input"
                                        v-model="sign.priv_k"
                                        placeholder="Enter Private Key"
                                        type="password"
                                        required>
                                    </b-form-input>
                                </b-form-group>
                                <b-container class="py-4 fluid">
                                    <b-form-group
                                        id="sign-secret-G_-group"
                                        label="G' (PEM)"
                                        label-for="sign-secret-G_-input"
                                        description="G' in PEM Format"
                                    >
                                        <b-form-file accept=".pem, .txt"
                                            id="sign-secret-G_-input"
                                            v-model="sign.G_file"
                                            :state="Boolean(sign.G_file)"
                                            placeholder="Select G'"
                                            drop-placeholder="Drop G' Here"
                                        ></b-form-file>
                                    </b-form-group>
                                </b-container>
                                <b-container class="py-4 fluid">
                                    <b-form-group
                                        id="sign-secret-pk-group"
                                        label="PK' (PEM)"
                                        label-for="sign-secret-pk-input"
                                        description="PK' in PEM Format"
                                    >
                                        <b-form-file accept=".pem, .txt"
                                            id="sign-secret-pk-input"
                                            v-model="sign.pub_k_file"
                                            :state="Boolean(sign.pub_k_file)"
                                            placeholder="Select PK'"
                                            drop-placeholder="Drop PK' Here"
                                        ></b-form-file>
                                    </b-form-group>
                                </b-container>
                                <b-button type="submit">Submit</b-button>
                            </b-form>
                        </b-card-text>
                    </b-card>
                    <b-card class="my-2" v-if="this.sign.show">
                        <b-card-text>
                            {{ this.sign.signature }}
                        </b-card-text>
                    </b-card>
                </b-row>
            </b-col>
            <b-col>
                <b-card header-tag="header">
                    <template #header>
                        <h4 class="mb-0">Compute Shuffled Public Key</h4>
                    </template>
                    <b-card-text>
                        <b-form @submit="onSubmitCompute">
                            <b-container class="py-4 fluid">
                                <b-form-group
                                    id="compute-priv-key-group"
                                    label="Private Key: "
                                    label-for="compute-priv-key-input"
                                    description="Your Private Key Will Not Be Stored Anywhere"
                                    >
                                    <b-form-input
                                        id="compute-priv-key-input"
                                        v-model="compute.priv_k"
                                        placeholder="Enter Private Key (HEX)"
                                        type="password"
                                        required>
                                    </b-form-input>
                                </b-form-group>
                            </b-container>
                            <b-container class="py-4 fluid">
                                <b-form-group
                                    id="compute-G_-group"
                                    label="G' (PEM)"
                                    label-for="compute-G_-input"
                                    description="G' in PEM Format"
                                >
                                <b-form-file accept=".pem, .txt"
                                    id="compute-G_-input"
                                    v-model="compute.G_file"
                                    :state="Boolean(compute.G_file)"
                                    placeholder="Select G'"
                                    drop-placeholder="Drop G' Here"
                                ></b-form-file>
                                </b-form-group>
                            </b-container>
                            <b-button type="submit">Submit</b-button>
                        </b-form>
                    </b-card-text>
                </b-card>
                <b-card v-if="this.compute.show">
                    <b-card-text>
                        {{ this.compute.pk_ }}
                    </b-card-text>
                </b-card>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
const privateKeyToPublicKey = require('ethereum-private-key-to-public-key')
const publicKeyToAddress = require('ethereum-public-key-to-address')
import KeyEncoder from 'key-encoder'
var keyEncoder = new KeyEncoder('secp256k1')
import axios from 'axios';

export default {
    name: 'Utilities',
    data() {
        return {
            util: {
                priv_k: '',
                pub_k: '',
            },
            pem_pubk: {
                show: false,
                pub_k_pem: null,
                address: null,
            },
            compute: {
                priv_k: null,
                G_file: null,
                G_pem: null,
                priv_k_pem: null,
                pk_: null,
                show: false
            },
            sign: {
                priv_k: null,
                G_file: null,
                G_pem: null,
                pub_k_file: null,
                pub_k_pem: null,
                signature: null,
                show: false
            }
        }
    },
    methods: {

        readFileAsync(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsText(file);
            })
        },

        onSubmitUtil(event) {
            event.preventDefault()
            // console.log(this.util.priv_k)

            

            this.util.pub_k = privateKeyToPublicKey(this.util.priv_k).toString('hex')

            // console.log(this.util.pub_k)
            this.pem_pubk.address = publicKeyToAddress(this.util.pub_k)
            this.pem_pubk.pub_k_pem = keyEncoder.encodePublic(this.util.pub_k, 'raw', 'pem')

            console.log(this.util)
            // alert(this.util.pub_k_pem)
            this.pem_pubk.show = true
        },

        async onSubmitCompute(event) {
            event.preventDefault();

            console.log({
                priv_k: this.compute.priv_k,
                G_file: this.compute.G_file
            })

            let G_file = this.compute.G_file;

            let G_pem = await this.readFileAsync(G_file);

            axios.post('https://pymixeth-server.herokuapp.com/api/get_shuffled', {
                sk: this.compute.priv_k,
                G_: G_pem
            })
            .then(response => {
                this.compute.pk_ = response.data.pk_;
                this.compute.show = true;
            })
            .catch(error => {
                console.log(error)
            })
        },

        async onSubmitSign(event) {
            event.preventDefault();

            console.log({
                priv_k: this.sign.priv_k,
                G_file: this.sign.G_file,
                pub_k_file: this.sign.pub_k_file
            })

            let G_file = this.sign.G_file;
            let pub_k_file = this.sign.pub_k_file;

            let G_pem = await this.readFileAsync(G_file);
            let pub_k_pem = await this.readFileAsync(pub_k_file);

            axios.post('https://pymixeth-server.herokuapp.com/api/sign', {
                sk: this.sign.priv_k,
                G_: G_pem,
                msg: pub_k_pem
            }).then(response => {
                this.sign.signature = [response.data.c1, response.data.c2].toString().replace(',', ' ')
                this.sign.show = true;
                console.log(this.sign.signature)
            }).catch(error => {
                console.log(error);
            })
        }
    }
}
</script>

<style scoped>

</style>